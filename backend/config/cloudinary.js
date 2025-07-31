import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOncloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const uploadResult = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath); // Remove local file after upload

    return uploadResult.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    fs.unlinkSync(filePath);
    return null;
  }
};

export default uploadOncloudinary;
