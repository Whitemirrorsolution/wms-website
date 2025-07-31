// models/service.model.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
