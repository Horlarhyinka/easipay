import express, {Application, Request, Response} from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import helemt from "helmet";
import rateLimit from "express-rate-limit";
import authRoute from "./routes/auth"
import mongoose from "mongoose";
import connectDB from "./config/db";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser"
dotenv.config()

const app: Application = express()
const Server = createServer(app);
const {PORT, NODE_ENV} = process.env
const port = NODE_ENV?.includes("test")? undefined: PORT;

//configure middlewares
app.use(cors())
app.use(rateLimit({
    windowMs: 15*60*60,
    max: 150,
    message: "too many request, try again later"
}))
app.use(helemt())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
    store: new MongoStore({collectionName: "sessions", mongoUrl: process.env.DB_URI!}),
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())

//use routes middlewares
app.use("/api/v1/auth",authRoute)

async function start(){

try{
await connectDB()
console.log("connected to db")
}catch(ex){
    console.log("could not connect to db", ex)
}
app.listen(port,()=>{
    console.log(`server running ${NODE_ENV} mode on port ${port}`)
})
}


start()
export default Server;