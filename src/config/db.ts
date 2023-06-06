import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

export default ():Promise<void | any> =>{
    return mongoose.connect(process.env.DB_URI!)
}