import express from "express"
import isAuth from "../middlewares/isAuth.js"
import getCurrentAdmin from "../controllers/admin.controller.js"
import { getAllContacts } from "../controllers/contact.controller.js"
import {getAllApplications } from "../controllers/application.controller.js"

const adminRouter = express.Router()

adminRouter.get("/currentadmin", isAuth, getCurrentAdmin)
adminRouter.get("/contact",  getAllContacts)
adminRouter.get("/application", getAllApplications)


export default adminRouter