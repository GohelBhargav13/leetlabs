import express from "express"
import { getMeUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register",registerUser)
authRoutes.post("/login",loginUser)
authRoutes.post("/logout",authMiddleware,logoutUser)
authRoutes.get("/getMe",authMiddleware,getMeUser)



export default authRoutes