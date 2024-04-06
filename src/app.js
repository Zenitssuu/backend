import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGINS,
    credentials:true
}));

//accepting json file
app.use(express.json({limit:"16kb"}));
//encoding url
app.use(express.urlencoded({extended:true,limit:"16kb"}));
//making the public folder accesible to user to store assets
app.use(express.static("public"));

// for CRUD operation in cookies of users
app.use(cookieParser())


//routes import 

import userRouter from "./routes/user.routes.js";


//routes declaration
app.use("/api/v1/users",userRouter)

// http://localhost:3000/api/v1/users/register

export {app}