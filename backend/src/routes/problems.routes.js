import express from "express"
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblems, getAllProblemById, getAllProblems, getAllProblemsSolvedByUser, updateProblem } from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem",authMiddleware,checkAdmin,createProblem)
problemRoutes.get("/get-all-problems",authMiddleware,getAllProblems);
problemRoutes.get("/get-problem/:id",authMiddleware,getAllProblemById)
problemRoutes.put("/upadte-problem/:id",authMiddleware,checkAdmin,updateProblem)
problemRoutes.delete("/delete-problem",authMiddleware,checkAdmin,deleteProblems)
problemRoutes.get("/get-solved-problems",authMiddleware,getAllProblemsSolvedByUser)

export default problemRoutes