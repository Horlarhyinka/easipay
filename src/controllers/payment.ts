import User from "../models/user";
import catchasync from "../util/catchasync";
import {Request, Response} from "express";
import { sendInvalidEntry, sendMissingDependency, sendResourceNotFound } from "../util/responseHandlers";
import { getCurrency, minAmount } from "../util/factory";
import fwv from "../services/fwv";

export const makePayment = catchasync(async(req: Request, res: Response, )=>{
    let {email, amount} = req.body;
    if(!email || !amount) return sendMissingDependency(res, "email and amount")
    const user = await User.findOne({email})
    if(!user) return sendResourceNotFound(res, "user email")
    amount = Number(amount)
    if(isNaN(amount))return sendInvalidEntry(res, "amount")
    if(amount < minAmount)return res.status(400).json({message: `amount cannot be less than ${minAmount}`})
    const currency = getCurrency(user.country!)
    if(!currency)return sendInvalidEntry(res, `country (${user.country})`)
    const paymentLink = await fwv.createPayment({email, amount, subaccount: user.account, currency})
    return res.status(200).json({payment_link: paymentLink})
})

const getTransactions = catchasync(async(req: Request, res: Response, )=>{

})


const verifyPayment = catchasync(async(req: Request, res: Response, )=>{

})

const withdrawToBank = catchasync(async(req: Request, res: Response, )=>{

})