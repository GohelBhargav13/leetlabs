import express from "express"
import dotenv from "dotenv"
import cookieparser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js";

dotenv.config()

const app = express();
app.use(express.json())
app.use(cookieparser())
const port = process.env.PORT || 5000


app.get("/",(req,res) => {
    res.send("Hello Guys Welcome to leetlab 🔥")
})

app.use("/api/v1/auth",authRoutes);

app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})