import { NextFunction, Request, Response } from "express";
import catchMongooseErr from "./catchMongooseErr";

export default (fn: Function)=>{
    return async(req: Request, res: Response, next: NextFunction)=>{
        try{
        return await fn(req, res)
        }catch(ex){
            const mongooseErrMessage = catchMongooseErr(ex)
            if(mongooseErrMessage)return res.status(400).json(mongooseErrMessage)
            console.log(ex)
            return res.status(500).json({message: "internal server error."})
        }
    }
}