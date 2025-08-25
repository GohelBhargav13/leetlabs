import jwt from "jsonwebtoken"
import { ApiError } from "../utills/api-error.js";
import { db } from "../libs/db.js";

export const authMiddleware = async(req,res,next) => {

    try {

        const token = req.cookies?.jwt;

        if(!token){
            return res.status(401).json(new ApiError(401,"Unauthorized - No token Provided"))
        }

        let decode;

        try {
            decode = jwt.verify(token,process.env.JWT_SECRET);
            
        } catch (error) {
            return res.status(401).json(new ApiError(401,"Unauthorized - No token Provided"))
        }

        const user = await db.user.findUnique({
            where:{ id:decode.id },
            select:{ id:true,image:true,name:true,email:true,role:true }
        })

        if(!user){
            return res.status(404).json(new ApiError(404,"User not found"))
        }

        req.user = user;
        next();
        
    } catch (error) {
        return res.status(500).json(new ApiError(500,"Internal error in auth middleware"))
    }


}