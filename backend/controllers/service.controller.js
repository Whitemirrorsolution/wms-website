// controllers/service.controller.js
import Service from "../models/service.model.js";

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services." });
  }
};
