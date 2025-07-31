import express from 'express';
// import upload from '../middlewares/multer.js';
import { ApplyUserJob } from '../controllers/careerController.js';
import { getJobs, submitApplication } from "../controllers/application.controller.js";
import { upload } from "../middlewares/uploadMiddleware.js";


const careerRouter = express.Router();
// careerRouter.post('/apply', upload.single('resume'), ApplyUserJob);
careerRouter.get("/jobs", getJobs);
careerRouter.post("/apply", upload.single("resume"), submitApplication);


export default careerRouter