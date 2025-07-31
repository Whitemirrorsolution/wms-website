import Admin from "../models/admin.model.js"

 export const getCurrentAdmin = async(req, res)=>{
    try {
        const admin = await Admin.findById(req.adminId).select("-password")
        if(!admin){
            return res.status(400).json({message:"admin does not found"})
        }
        return res.status(200).json({admin})
    } catch (error) {
         console.log(error)
        return res.status(400).json({message:"get cuurent user error"})
    }
}

export default getCurrentAdmin




