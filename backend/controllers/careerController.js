import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import JobApplication from "../models/contact.model.js"; // Make sure this is the correct path

export const ApplyUserJob = async (req, res) => {
  let resumePath = "";

  try {
    const {
      selectedJobTitle,
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      qualification,
      coverLetter,
    } = req.body;

    if (!fullName || !email || !selectedJobTitle) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    resumePath = req.file?.path;
    if (!resumePath) {
      return res.status(400).json({ message: "Resume file is required." });
    }

    // ✅ Duplicate Email Check for Same Job
    const existing = await JobApplication.findOne({
      email,
      appliedJobTitle: selectedJobTitle,
    });

    if (existing) {
      fs.unlink(resumePath, () => {});
      return res.status(409).json({
        message: "You have already applied for this job with this email.",
      });
    }

    // ✅ Save to MongoDB
    const newApplication = new JobApplication({
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      qualification,
      coverLetter,
      appliedJobTitle: selectedJobTitle,
      resume: resumePath,
    });

    await newApplication.save();

    // ✅ Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Application for ${selectedJobTitle}`,
      text: `
        New Job Application Received:

        Full Name: ${fullName}
        Email: ${email}
        Phone: ${phone}
        Gender: ${gender}
        DOB: ${dateOfBirth}
        Qualification: ${qualification}
        Cover Letter: ${coverLetter || "N/A"}
      `,
      attachments: [
        {
          filename: path.basename(resumePath),
          path: resumePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // ✅ Delete Resume After Email Sent
    fs.unlink(resumePath, (err) => {
      if (err) console.error("Error deleting resume:", err);
    });

    return res.status(201).json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("Application Error:", error.message);

    // ✅ Cleanup on error
    if (resumePath) {
      fs.unlink(resumePath, () => {});
    }

    return res.status(500).json({ message: "Server error while applying." });
  }
};

