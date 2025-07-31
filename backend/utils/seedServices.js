// scripts/seedServices.js
import mongoose from "mongoose";
import Service from "../models/service.model.js";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGODB_URL);

await Service.insertMany([
  { title: "Web Development" },
  { title: "App Development" },
  { title: "Digital Marketing" },
  { title: "IT Consulting" },
]);

console.log("Services seeded");
process.exit();
