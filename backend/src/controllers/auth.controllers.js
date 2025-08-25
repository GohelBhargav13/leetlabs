import bc from "bcryptjs"
import {db} from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"

export const registerUser = async(req,res) => {
    const { email,password,name } = req.body;

    try {

       const existingUser = await db.user.findUnique({
            where:{
                email
            }
        })

        if(existingUser){
            return res.status(400).json({
                error:"User is already exists"
            })
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

        res.status(201).json({ message:"User created Sucessfully",
            user:{
                name:newUser.name,
                email:newUser.email
        } })
        
    } catch (error) {

        console.error(error);
        res.status(500).json({ error:error })
        
    }
}


export const loginUser = async(req,res) => {
    const { email,password } = req.body;

    try {

        const user = await db.user.findUnique({
            where:{email}
        })

        if(!user){
            return res.status(401).json({ error:"User not found" })
        }

        const IsMatched = await bc.compare(password,user.password);
        if(!IsMatched){
            return res.status(401).json({ error:"Invalid Credentails" })
        }

        const token = jwt.sign({ id:user.id },process.env.JWT_SECRET,{ expiresIn:"7d" })

        console.log(user);

         res.cookie("jwt",token,{ httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV !== "development",maxAge:1000 * 60 * 60 * 24 * 7 }) // 7 days

        res.status(200).json({ message:"User LoggedIn Sucessfully",
            user:{
                name:user.name,
                email:user.email
        } })
        
    } catch (error) {
         console.error(error);
         res.status(500).json({ error:"Error in login User" })
    }
}

export const logoutUser = async(req,res) => {

    try {

        res.cookie("jwt","",{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
        })

        res.status(200).json({
            success:true,
            message:"Logout successfully"
        })
        
    } catch (error) {
         console.error(error);
         res.status(500).json({ error:"Error in logout User" })
    }

}

export const getMeUser = async(req,res) => {

    try {
        
    } catch (error) {
        
    }

}