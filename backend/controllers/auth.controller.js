
import jwt from "jsonwebtoken";
 const ADMIN_EMAIL = "vikas@gmail.com"
 const ADMIN_PASSWORD = "123456"
 const JWT_SECRET = "your_jwt_secret"


export const login = async(req, res)=>{

    try {
    const { email, password } = req.body;
    console.log(email)

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Token payload
    const payload = {
      email: ADMIN_EMAIL,
      role: "admin",
    };

    // Token expires in 5 hours
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" });

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
 
    
}



