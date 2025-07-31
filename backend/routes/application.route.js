import express from "express";
import isAuth from "../middlewares/isAuth";
import { getAllApplications } from "../controllers/application.controller.js";



const applicationRouter = express.Router();

applicationRouter.get("/applications", isAuth, getAllApplications)

export default applicationRouter