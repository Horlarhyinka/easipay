import User from "../models/user";
import catchasync from "../util/catchasync";
import {Request, Response} from "express";
import { sendInvalidEntry, sendMissingDependency, sendResourceNotFound, sendServerFailed } from "../util/responseHandlers";
import { getCurrency, minAmount, transaction_types } from "../util/factory";
import * as payment from "../services/transaction";
import Transaction from "../models/transaction";
import Account from "../models/account"

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
    try{
        const url = await payment.checkout({email, amount})
        if(!url)return res.status(501).json({message:"could not process payment at this time."})
        return res.status(200).json(url)
    }catch(ex){ 
        return  sendServerFailed(res, "complete payment")
    }
})

export const verifyPayment = catchasync(async(req: Request, res: Response, )=>{
    return res.send(" payment verified...")
})

export const paymentCallback =catchasync(async(req: Request, res: Response)=>{
    const {reference} = req.query;
    if(!reference)return res.status(403).json("payment verification failed")
    const existingTransaction = await Transaction.findOne({reference})
    if(existingTransaction)return res.status(200).json(existingTransaction)
    const verification = await payment.verifyPayment(String(reference) as string)
    const {amount, channel, currency, customer} = verification.data
    const account = await Account.getOrcreateAccount(customer.email)
    const transaction = await Transaction.create({amount: amount/100, channel, currency, successful: verification.status?true:false, email: customer.email, type: transaction_types.payment, reference, accountId: account._id})
    return res.status(200).json(transaction) 
})