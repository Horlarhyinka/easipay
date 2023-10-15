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
import invoiceRouter from "./routes/invoice"

const app: Application = express()
const Server = createServer(app);
const {port, node_env} = config.APP
const appPort = node_env?.includes("test")? undefined: port;

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

app.use(notFound)

async function start(){

try{
await connectDB()
console.log("connected to db")
}catch(ex){
    console.log("could not connect to db", ex)
}
app.listen(port,()=>{
    console.log(`server running ${node_env} mode on port ${appPort}`)
})
}


start()
export default Server;