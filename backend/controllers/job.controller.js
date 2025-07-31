import Job from "../models/job.model.js"


// Post new job
export const postJob = async (req, res) => {
  try {
    const { title, department, location, jobType, description } = req.body;
    console.log(req.body)

    if (!title || !department || !location || !jobType || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create({ title,
        department,
        location,
        jobType: req.body.jobType?.trim(),
        description
         });
    return res.status(201).json(job);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Job posting failed" });
  }
};

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching jobs" });
  }
};
