import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectdb from "./utils/db.js";   //MONGO DB CONNECTED
import userRoute from "./routes/user.route.js"
dotenv.config({});

const app = express();
const port = process.env.PORT || 3000;



app.use(express.urlencoded({extended:true})); //parse the forms
app.use(express.json());     //parse the json
app.use(cookieParser());   // parse the cookies
const corsOptions={
    option:"http://localhost:5713",
    credentials: true
}
app.use(cors(corsOptions))

app.get("/",async(_,res)=>{
    return res.status(200).json({
        message:"everything is fine",
        success: true
    })
})

app.use("/api/v1/user",userRoute);

app.listen(port,()=> { 
    connectdb();   //HERE IS FUNC CALL FOR MONGODB CONNECTION
    console.log(`server started at http://localhost:${port}`)});