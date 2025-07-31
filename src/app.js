import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app= express();


app.use(cors({
    origin:process.env.CORD_ORIGIN,
     credentials:true
}))
app.use(express.json({limit:"32kb"}))
app.use(express.urlencoded({extended:true,limt:"32kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes
import userRouter from "./routes/user.routes.js"

// routes declare
app.use("/api/v1/users",userRouter)

export default app;

