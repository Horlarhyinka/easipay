import dotenv from "dotenv";

dotenv.config()

const APP_HOST = process.env.APP_HOST || "localhost"
const APP_PORT = process.env.APP_PORT || 7001
const APP_SECRET = process.env.APP_SECRET!
const NODE_ENV = process.env.NODE_ENV
const BASE_URL = process.env.APP_BASE_URL || "http://localhost:7001/api/v1"

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/expert"

const MAIL_USER = process.env.MAIL_USER!
const MAIL_PASS = process.env.MAIL_PASS !
const MAIL_HOST = process.env.MAIL_HOST || "smtp.mailtrap.io"
const MAIL_PORT = process.env.MAIL_PORT || 465
const MAIL_ADDRESS = process.env.MAIL_ADDRESS || "testfromemailaddress@gmail"
const MAIL_SERVICE = process.env.MAIL_SERVICE || "mailtrap"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

const PAYMENT_SECRET_KEY = process.env.PAYMENT_SECRET_KEY!
const PAYMENT_PUBLIC_KEY= process.env.PAYMENT_PUBLIC_KEY!
const PAYMENT_BASE_URL=process.env.PAYMENT_BASE_URL!

const REDIS_USER = process.env.REDIS_USER
const REDIS_PASS = process.env.REDIS_PASS
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = process.env.REDIS_PORT

const REDIS = {
    user: REDIS_USER, password: REDIS_PASS, host: REDIS_HOST, port: REDIS_PORT
}

const GOOGLE = {
    clientId: GOOGLE_CLIENT_ID,
    secret: GOOGLE_CLIENT_SECRET
}

const OAUTH = {
    GOOGLE
}

const PAYMENT = {
    secret_key: PAYMENT_SECRET_KEY,
    public_key: PAYMENT_PUBLIC_KEY,
    base_url: PAYMENT_BASE_URL
}

const APP = {
    port: APP_PORT,
    host: APP_HOST,
    secret: APP_SECRET,
    client_url: CLIENT_URL,
    node_env: NODE_ENV,
    baseUrl: BASE_URL,
    auth: {
        OAUTH
    }
}

const MAIL = {
    user: MAIL_USER,
    pass: MAIL_PASS,
    port: MAIL_PORT,
    host: MAIL_HOST,
    address: MAIL_ADDRESS,
    service: MAIL_SERVICE
}

const DB = {
    url: DB_URL
}

const SERVICES = {
    MAIL,
    PAYMENT,
    REDIS
}

const config = {
    APP, DB, SERVICES
}

export default config