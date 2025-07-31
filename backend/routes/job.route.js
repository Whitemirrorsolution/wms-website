import express, { Router } from "express"
import isAuth from "../middlewares/isAuth.js";
import { getJobs, postJob } from "../controllers/job.controller.js";


const jobRouter = express.Router();


jobRouter.post("/create", isAuth, postJob)
jobRouter.get("/", getJobs)
jobRouter.get("/all", isAuth, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

jobRouter.delete("/:id", isAuth, async (req, res) => {
  try {
    const jobId = req.params.id;
    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting job" });
  }
});



export default jobRouter