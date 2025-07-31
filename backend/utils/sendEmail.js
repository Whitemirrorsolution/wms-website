import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export const sendApplicationEmail = async (application) => {
  const resumePath = application.resumePath;

  const deleteResume = () => {
    fs.unlink(resumePath, (err) => {
      if (err) console.error("❌ Error deleting resume:", err);
      else console.log("🗑️ Resume file deleted");
    });
  };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = `
New Job Application Received:

🧑 Full Name: ${application.fullName}
📧 Email: ${application.email}
📞 Phone: ${application.phone}
⚥ Gender: ${application.gender}
🎂 Date of Birth: ${application.dateOfBirth || application.dob}
🎓 Qualification: ${application.qualification}
💼 Applied For: ${application.appliedJobTitle}
📝 Cover Letter: ${application.coverLetter || "N/A"}
`;

    const mailOptions = {
      from: `"Career Page" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Application - ${application.appliedJobTitle}`,
      text: message,
      attachments: [
        {
          filename: path.basename(resumePath),
          path: resumePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");

    // Async delete after response (non-blocking)
    deleteResume();

    return { success: true, message: "Email sent and resume deleted." };

  } catch (error) {
    console.error("❌ Email sending failed:", error);

    // Still delete resume even if error happens
    deleteResume();

    // Propagate the error to handle in controller
    throw new Error("Email sending failed");
  }
};
