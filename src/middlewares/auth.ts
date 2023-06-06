import { NextFunction, Request, Response } from "express";
import { sendUnauthenticated } from "../util/responseHandlers";
import User from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()


export default async(req: Request, res: Response, next: NextFunction) =>{
    let token = req.headers.authorization
    if(!token || !token?.toLowerCase().startsWith("bearer"))return sendUnauthenticated(res)
    token = token.split(" ")[1]
    const payload= jwt.verify(token, process.env.SECRET!)
    const user = await User.findById(payload)
    if(!user)return sendUnauthenticated(res)
    req.user = user
    return next()
}