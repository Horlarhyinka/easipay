import {Request, Response} from "express";
import catchAsync from "../util/catchasync";
import User from "../models/user";
import { sendDuplicateResource, sendMissingDependency, sendResourceNotFound, sendServerFailed } from "../util/responseHandlers";
import { user_int } from "../models/types/user";
import crypto from "crypto";
import Mailer from "../services/mailer";
import config from "../config/config";

export const register = catchAsync(async(req: Request, res: Response)=>{
    const {email, password, ...args} = req.body;
    try{
        const user = await User.create({email, password, ...args})
        if(!user)return sendServerFailed(res, "register user")
        user.password = undefined
        const token = user.genToken();
        (req.session as unknown as {token: string}).token = token
        return res.status(200).json(user)
    }catch(ex: Error | any){
        if(ex.code == 11000)return sendDuplicateResource(res, "user")
        throw ex
    }
})

export const login = catchAsync(async(req: Request, res: Response)=>{
    const {email, password} = req.body;
    if(!email || !password)return sendMissingDependency(res, "email & password")
    const user = await User.findOne({email})
    if(!user)return sendResourceNotFound(res, "user")
    const validatePassword = await user.validatePassword(password)
    if(!validatePassword)return res.status(400).json({message: "incorrect password"});
    user.password = undefined
    const token = user.genToken();
    (req.session as unknown as {token: string}).token = token
    return res.status(200).json(user)
})

export const oauthRedirect = catchAsync(async(req: Request, res: Response)=>{
    const user: user_int = req.user as user_int
    if(!user)return res.status(400).json({message: "invalid entry"})
    const token = user.genToken()
    user.password = undefined;
    (req.session as unknown as {token: string}).token = token
    return res.status(200).json(user)
})

export const forgetPasswordTokenRequest = catchAsync(async(req: Request, res: Response)=>{
    const {email} = req.body || req.query;
    if(!email)return sendMissingDependency(res, "user email");
    const user = await User.findOne({email})
    if(!user)return sendResourceNotFound(res, "user")
    const tokenBuffer = crypto.randomBytes(12)
    const token = tokenBuffer.toString("hex")
    user.resetToken = token;
    user.tokenExpiresIn = new Date(Date.now() + 1000 * 60 * 15)
    await user.save()
    const url = config.APP.client_url + "/" + token
    try{
    const mailer = new Mailer(email)
    await mailer.sendPasswordResetMail(url)
    return res.status(204).json({message: "check inbox to complete password reset"})
    }catch(ex){
        return sendServerFailed(res, "complete password reset")
    }
})

export const resetPassword = catchAsync(async(req: Request, res: Response)=>{
    const {password, confirmPassword} = req.body || req.query
    if(!password || !confirmPassword)return sendMissingDependency(res, "password and confirmPassword")
    if(password !== confirmPassword)return res.status(400).json({message: "passsword and confirmPassword must be the same"})
    const {token} = req.params || req.query || req.body
    if(!token)return sendMissingDependency(res, "reset token")
    const user = await User.findOne({resetToken: token, tokenExpiresIn:{$gte: Date.now()}})
    if(!user)return sendResourceNotFound(res, "user");
    user.password = password;
    user.resetToken = undefined;
    user.tokenExpiresIn = undefined;
    await user.save()
    user.password = undefined;
    const authToken = user.genToken();
    (req.session as unknown as {token: string}).token = authToken
    return res.status(200).json(user)
})


// User.deleteMany({}).then(()=>console.log("deleted all"))