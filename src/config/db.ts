import mongoose from "mongoose";
import config from "./config";

export default ():Promise<void | any> =>{
    return mongoose.connect(config.DB.url!)
}