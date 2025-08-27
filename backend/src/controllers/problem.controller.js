
import { UserRole } from "../generated/prisma/index.js";
import { db } from "../libs/db.js"
import { getjudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.libs.js";
import { ApiError } from "../utills/api-error.js";
import {ApiResponse} from "../utills/api-respose.js"
export const createProblem = async(req,res) => {

    const { title,description,difficulty,tag,examples,constarints,testcases,codeSnippets,referenceSolutions } = req.body;

    //check if not admin
    if(req.user.role !== UserRole.ADMIN){
        return res.status(403).json(new ApiError(403,"You are not allowed to create problem"))
    }


    try {

        for(const [ language,solutionCode ] of Object.entries(referenceSolutions)){
            const languageId = getjudge0LanguageId(language);

            if(!languageId){
                return res.status(400).json(new ApiError(400,`Language ${language} is Not Supported`))
            }

            const submision = testcases.map(({input,output}) => ({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expexted_output:output
            })) 

            const submissionResults = await submitBatch(submision);
            const tokens = submissionResults.map((res) => res.token);

            const results = await pollBatchResults(tokens);


            for(let i = 0 ; i < results.length ; i++){
                const result = results[i];

                if(result.status_id !== 3){
                    return res.status(400).json(new ApiError(400,`Testcase ${i+1} is fail for this language ${language}`))
                }
            }

            //save a problem in database 

           const newProblem =  await db.problem.create({
                data:{
                     title,description,difficulty,tag,examples,constarints,testcases,codeSnippets,referenceSolutions,userId:req.user.id
                }
            })

            return res.status(201).json(new ApiResponse(201,newProblem,"New Problem Added Sucessfully"))
        }  
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiError(500,"Internal Error in execution in code",error))
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