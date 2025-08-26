
import { UserRole } from "../generated/prisma/index.js";
import { db } from "../libs/db.js"
import { ApiError } from "../utills/api-error.js";
export const createProblem = async(req,res) => {

    const { title,description,difficulty,tag,examples,constarints,testcases,codeSnippets,referenceSolutions } = req.body;

    //check if not admin
    if(req.user.role !== UserRole.ADMIN){
        return res.status(403).json(new ApiError(403,"You are not allowed to create problem"))
    }

    try {

        
    } catch (error) {
        
    }

}

export const getAllProblems = async(req,res) => {

}
export const getAllProblemById = async(req,res) => {

}
export const updateProblem = async(req,res) => {

}
export const deleteProblems = async(req,res) => {

}
export const getAllProblemsSolvedByUser = async(req,res) => {

}