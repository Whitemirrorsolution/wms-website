import Contact from "../models/contact.model.js";
import moment from "moment"; 

export const createContact = async (req, res) => {
  try {
    const { fullName, email, number, subject, message } = req.body;

    // ✅ Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ Number validation (10 digits, numeric only)
    const numberRegex = /^[0-9]{10}$/;
    if (!numberRegex.test(number)) {
      return res.status(400).json({ message: "Invalid phone number (must be 10 digits)" });
    }

    // ✅ Check if already messaged today
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    const existing = await Contact.findOne({
      email: email,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existing) {
      return res.status(400).json({ message: "You have already sent a message today" });
    }

    const newMessage = await Contact.create({ fullName, email, number, subject, message });

    res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });

  } catch (error) {
    console.error("❌ Contact error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Error fetching contact messages" });
  }
};
