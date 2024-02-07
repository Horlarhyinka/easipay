import express, {Application, Request, Response} from "express";
import http, {Server} from "http"
import https from "https"
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
import serviceRouter from "./routes/service";

import "./services/cache"

const app: Application = express()
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
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/payments", transactionRouter)
app.use("/api/v1/services", serviceRouter)

app.use(notFound)

function start(){
        connectDB()
        .then(res=>console.log("connected to db"))
        .catch(err=>{
            console.log("failed to connect to db: ", err)
            process.exit(1)
        })
        try {
        const server = process.env.NODE_ENV === "production"?https.createServer({
            cert: process.env.SSL_CERT,
            key: process.env.SSL_KEY
        }, app): http.createServer(app)
        server.on("listening", ()=>{
            console.log(" server running on port", (server.address() as {port: number}).port)
        })
        return server
        } catch (error) {
            console.log("Failed to start server:", error)
            process.exit(1)  
        }
}


const server = start()
export default server;