import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectdb from "./utils/db.js";   //MONGO DB CONNECTED
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app,server } from "./socket/socket.js";
dotenv.config({});


const port = process.env.PORT || 3000;



app.use(express.urlencoded({extended:true})); //parse the forms
app.use(express.json());     //parse the json
app.use(cookieParser());   // parse the cookies
const corsOptions={
    origin:"http://localhost:5173",
    credentials: true                    // true :- i.e we allow both ACAO and ACAM  in response to preflight req
}
app.use(cors(corsOptions))

app.get("/",async(_,res)=>{
    return res.status(200).json({
        message:"everything is fine",
        success: true
    })
})

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);

server.listen(port,()=> { 
    connectdb();   //HERE IS FUNC CALL FOR MONGODB CONNECTION
    console.log(`server started at http://localhost:${port}`)});