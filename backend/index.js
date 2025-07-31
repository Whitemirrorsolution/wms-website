import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import careerRouter from "./routes/careerRoute.js"
import authRouter from "./routes/auth.route.js"
import adminRouter from "./routes/admin.route.js"
import jobRouter from "./routes/job.route.js"
import contactRouter from "./routes/contact.route.js";
import serviceRouter from "./routes/service.route.js";

// import adminRoutes from "./routes/adminRoutes.js";





dotenv.config()
const app = express()
app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRouter)
app.use("/api/admin", adminRouter)

app.use("/api/services", serviceRouter);

app.use("/api/jobs", jobRouter)
app.use("/api", contactRouter);
app.use("/api/career", careerRouter)

const port = process.env.PORT || 8080

app.get("/", (req, res)=>{
    res.send("hii")
})

app.listen(port, (req, res)=>{
    connectDB()
    console.log(`server started on ${port}`)
})