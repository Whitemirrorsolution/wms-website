// routes/service.route.js
import express from "express";
import { getAllServices } from "../controllers/service.controller.js";

const serviceRouter = express.Router();
serviceRouter.get("/", getAllServices);

export default serviceRouter;
