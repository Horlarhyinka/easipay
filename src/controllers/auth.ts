import {Request, Response} from "express";
import catchAsync from "../util/catchasync";
import User from "../models/user";
import { sendDuplicateResource, sendMissingDependency, sendResourceNotound, sendServerFailed } from "../util/responseHandlers";
import { user_int } from "../models/types/user";

export const register = catchAsync(async(req: Request, res: Response)=>{
    const {email, password} = req.body;
    try{
        const user = await User.create({email, password})
        if(!user)return sendServerFailed(res, "register user")
        user.password = undefined
        const token = user.genToken()
        return res.status(200).json({user, token})
    }catch(ex: Error | any){
        console.log(ex)
        if(ex.code == 11000)return sendDuplicateResource(res, "user")
        const messages: string[] = []
        for(let key in ex.errors){
            messages.push(ex.errors[key]?.properties?.message)
        }
        return res.status(400).json({message: messages.join("\n").replace(/path/ig, "")})
    }
})

export const login = catchAsync(async(req: Request, res: Response)=>{
    const {email, password} = req.body;
    if(!email || !password)return sendMissingDependency(res, "email & password")
    const user = await User.findOne({email})
    if(!user)return sendResourceNotound(res, "user")
    const validatePassword = await user.validatePassword(password)
    if(!validatePassword)return res.status(400).json({message: "incorrect password"});
    user.password = undefined
    const token = user.genToken()
    return res.status(200).json({user, token})
})

export const oauthRedirect = catchAsync(async(req: Request, res: Response)=>{
    const user: user_int = req.user as user_int
    if(!user)return res.status(400).json({message: "invalid entry"})
    const token = user.genToken()
    user.password = undefined
    const data = {user, token}
    res.cookie("easipay", data, {expires: new Date(Date.now() + 7200*1000)})
    return res.status(200).json({user, token})
})

// User.deleteMany({}).then(()=>console.log("deleted all"))