import catchasync from "../util/catchasync";
import User from "../models/user"
import { Request, Response } from "express";
import { user_int } from "../models/types/user";

interface ExtReq extends Request{
    user: user_int
}

export const updateProfile = catchasync(async(req: ExtReq, res: Response)=>{
    const mutables = ["username", "tel", "avatar", "about", "firstName", "lastName", "country"]
    let user = req.user;
    for(let field of mutables){
        if(req.body[field]){
            user.set(field, req.body[field])
        }
    }
    user = await user.save()
    user.password = ""
    return res.status(200).json(user)
})

export const getProfile = catchasync(async(req: ExtReq, res: Response)=>{
    const user = req.user
    user.password = ""
    return res.status(200).json(user)
})