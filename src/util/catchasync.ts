import { NextFunction, Request, Response } from "express";

export default (fn: Function)=>{
    return async(req: Request, res: Response, next: NextFunction)=>{
        try{
        return await fn(req, res)
        }catch(ex){
            next(ex)
        }
    }
}