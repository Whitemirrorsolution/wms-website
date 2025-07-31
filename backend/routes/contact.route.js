import express from "express"
import { createContact } from "../controllers/contact.controller.js"


const contactRoute = express.Router()

contactRoute.post("/contact", createContact)



export default contactRoute