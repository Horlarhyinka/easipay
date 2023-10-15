import { NextFunction, Request, Response } from "express";
import { sendUnauthenticated } from "../util/responseHandlers";
import User from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";

export default async(req: Request, res: Response, next: NextFunction) =>{
    let token = req.headers.authorization
    if(!token || !token?.toLowerCase().startsWith("bearer"))return sendUnauthenticated(res)
    token = token.split(" ")[1]
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