import mongoose from "mongoose";
const connectDB = async () =>{
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected")
    } catch (error) {
        console.log("database error")
        
    }
}

export default connectDB