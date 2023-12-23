import express, {Application, Request, Response} from "express";
import { createServer } from "http";
import cors from "cors";
import helemt from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import path from "path";
import notFound from "./routes/not-found";
import config from "./config/config";
import authRoute from "./routes/auth";
import orderRouter from "./routes/order";
import invoiceRouter from "./routes/invoice";
import profileRouter from "./routes/profile";
import transactionRouter from "./routes/transaction";
import fs from "fs";
import { checkout } from "./services/transaction";

const app: Application = express()
const {port, node_env} = config.APP
const appPort = node_env?.includes("test")? undefined: port;


// (async()=>{
//     try{
//     const res = await checkout({email: "testing@gmail.com", amount: 2000})
//     console.log(res)
//     }catch(ex){
//         throw ex
//     }
// })()

//set view engine
app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")

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
    store: new MongoStore({collectionName: "sessions", mongoUrl: config.DB.url}),
    secret: config.APP.secret,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())

//use routes middlewares
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/invoice", invoiceRouter)
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/payments", transactionRouter)

app.use(notFound)

async function start(){

// const Server = createServer({
//     cert: fs.readFileSync(path.resolve(__dirname, "../cert/cert.pem")), 
//     key: fs.readFileSync(path.resolve(__dirname, "../cert/key.pem"))}, app);
const Server = createServer(app)

try{  
await connectDB()
console.log("connected to db")
}catch(ex){
    console.log("could not connect to db", ex)
}
return Server.listen(port,()=>{
    console.log(`server running ${node_env} mode on port ${appPort}`)
})
}


const Server = start()
export default Server;