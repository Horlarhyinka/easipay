import { NextFunction, Request, Response } from "express";
import { sendUnauthenticated } from "../util/responseHandlers";
import User from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";

export default async(req: Request, res: Response, next: NextFunction) =>{
    let token = (req.session as unknown as {token: string}).token
    if(!token)return sendUnauthenticated(res)
    try{
    const payload= jwt.verify(token, config.APP.secret) as {id: string, iat: number, exp: number}
    const user = await User.findById(payload.id)
    if(!user)return sendUnauthenticated(res)
    req.user = user
    return next()
    }catch(ex){
        return sendUnauthenticated(res)
    }
}