import bc from "bcryptjs"
import {db} from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utills/api-error.js"
import { ApiResponse } from "../utills/api-respose.js"

export const registerUser = async(req,res) => {
    const { email,password,name } = req.body;

    try {

       const existingUser = await db.user.findUnique({
            where:{
                email
            }
        })

        if(existingUser){
            return res.status(400).json(new ApiError(400,"This User is already Exists"))
        }

        const hashedPassword = await bc.hash(password,10);

        const newUser = await db.user.create({
            data:{
                email,
                name,
                password:hashedPassword,
                role:UserRole.USER
            }
        })

        const token = jwt.sign({ id:newUser.id },process.env.JWT_SECRET,{ expiresIn:"7d" })

        res.cookie("token",token,{ httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV !== "development",maxAge:1000 * 60 * 60 * 24 * 7 }) // 7 days

        res.status(201).json(new ApiResponse(201,newUser,"Registartion sucessfully"))
        
    } catch (error) {

        console.error(error);
        res.status(500).json(new ApiError(500,"Internal Error in registration"))
        
    }
}


export const loginUser = async(req,res) => {
    const { email,password } = req.body;

    try {

        const user = await db.user.findUnique({
            where:{email}
        })

        if(!user){
            return res.status(401).json(new ApiError(401,"User not found"))
        }

        const IsMatched = await bc.compare(password,user.password);
        if(!IsMatched){
            return res.status(401).json(new ApiError("Invalid credantial"))
        }

        const token = jwt.sign({ id:user.id },process.env.JWT_SECRET,{ expiresIn:"7d" })

        console.log(user);

         res.cookie("jwt",token,{ httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV !== "development",maxAge:1000 * 60 * 60 * 24 * 7 }) // 7 days

        res.status(200).json(new ApiResponse(200,{ message:"LoggedIn Successfully" }))
        
    } catch (error) {
         console.error(error);
         res.status(500).json(new ApiError(500,"Internal Error in login"))
    }
}

export const logoutUser = async(req,res) => {

    try {

        res.cookie("jwt","",{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
        })

        res.status(200).json(new ApiResponse(200,{ message:"Logout Successfully" }))
        
    } catch (error) {
         console.error(error);
         res.status(500).json(new ApiError(500,"Internal Error in Logout"))
    }

}

export const getMeUser = async(req,res) => {
    try {

        res.status(200).json(new ApiResponse(200,req.user,"user authenticated successfully"))
        
    } catch (error) {
        res.status(500).json(new ApiError(500,"Please Login First - You're not loggedIn"))
    }

}