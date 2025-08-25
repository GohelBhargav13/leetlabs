import express from "express"
import { getMeUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controllers.js";

const authRoutes = express.Router();

authRoutes.post("/register",registerUser)
authRoutes.post("/login",loginUser)
authRoutes.post("/logout",logoutUser)
authRoutes.get("/geMe",getMeUser)



export default authRoutes