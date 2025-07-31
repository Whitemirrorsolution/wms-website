import jwt from "jsonwebtoken"

const isAuth = async (req, res, next)=>{
    try {

        const {token} = req.cookies
      
        if(!token){
           return res.status(400).json({message:"admin doesn't have token"})  
        }
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET)
        if(!verifyToken){
          return res.status(400).json({message:"admin doesn't have valid token"})
        }


        req.userId = verifyToken.userId
        next()
    } catch (error) {
        return res.status(500).json({message:"is auth error"})
        
    }
}

export default isAuth