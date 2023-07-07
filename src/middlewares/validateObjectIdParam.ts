import { NextFunction, Request, Response } from "express";
import { validateObjectId } from "../util/validators";  
import { sendInvalidEntry } from "../util/responseHandlers";

export default (req: Request, res: Response, next: NextFunction) =>{
    for(let key in req.params){
        if(key.toLowerCase().endsWith("id")){
            if(!validateObjectId(req.params[key]))return sendInvalidEntry(res, key)
        }
    }
    return next()
}