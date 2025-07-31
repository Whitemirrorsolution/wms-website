// import Application from "../models/application.model.js";



export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Fetch Applications Error:", error);
    res.status(500).json({ message: "Error fetching applications" });
  }
};
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import { sendApplicationEmail } from "../utils/sendEmail.js";

export const getJobs = async (req, res) => {
  const jobs = await Job.find({});
  res.json(jobs);
};

export const submitApplication = async (req, res) => {
  try {

    const { email, appliedJobTitle } = req.body;

    const existingApplication = await Application.findOne({ email, appliedJobTitle });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job with this email.",
      });
    }

    const application = new Application({
      ...req.body,
      resumePath: req.file.path,
    });

    await application.save();
   sendApplicationEmail(application);

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error(" SUBMIT ERROR:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};




// export const getAllApplication = async (req, res)=>{
//   try {
//   const application = await Application.findOne({}, { password: 0 });
//    res.status(200).json({ application });
   

//   } catch (error) {
//     res.status(500).json({ message: "Error fetching Application " });
    
//   }
// }
