import User from "../models/user";
import catchasync from "../util/catchasync";
import {Request, Response} from "express";
import { sendInvalidEntry, sendMissingDependency, sendResourceNotFound, sendServerFailed } from "../util/responseHandlers";
import { getCurrency, minAmount, transaction_types } from "../util/factory";
import Paystack from "../services/paystack";
import Transaction from "../models/transaction";
import Account from "../models/account"
import { user_int } from "../models/types/user";
import { recipient_int, transfer_int } from "../services/types/paystack";
import { mail_regex } from "../util/regex";

interface ExtReq extends Request{
    user: user_int
}

export const makePayment = catchasync(async(req: Request, res: Response, )=>{
    let {email, amount} = req.body;
    if(!email || !amount) return sendMissingDependency(res, "email and amount")
    if(!mail_regex.test(email))return sendInvalidEntry(res, "email address")
    amount = Number(amount)
    if(isNaN(amount))return sendInvalidEntry(res, "amount")
    if(amount < minAmount)return res.status(400).json({message: `amount cannot be less than ${minAmount}`})
    const currency = getCurrency("NG")
    try{
        const url = await Paystack.checkout({email, amount})
        if(!url)return res.status(501).json({message:"could not process payment at this time."})
        return res.status(200).json(url)
    }catch(ex){ 
        return  sendServerFailed(res, "complete payment")
    }
})

export const paymentCallback =catchasync(async(req: Request, res: Response)=>{
    const {reference} = req.query;
    if(!reference)return res.status(403).json("payment verification failed")
    const existingTransaction = await Transaction.findOne({reference})
    if(existingTransaction)return res.status(200).json(existingTransaction)
    const verification = await Paystack.verifyPayment(String(reference) as string)
    const {amount, channel, currency, customer} = verification.data
    const account = await Account.getOrcreateAccount(customer.email)
    const transaction = await Transaction.create({amount: amount/100, channel, currency, successful: verification.status?true:false, email: customer.email, type: transaction_types.payment, reference, accountId: account._id})
    return res.status(200).json(transaction) 
})

export const withdrawToBank = catchasync(async(req: ExtReq, res: Response)=>{
    const user = req.user as user_int
    const {account_number, bank_code, amount} = req.body
    if(!amount)return sendMissingDependency(res, "amount")
    if(isNaN(Number(amount)))return sendInvalidEntry(res, "amount")
    if(!account_number || !bank_code)return sendMissingDependency(res, "account_number and bank_code")
    try{
        const recipient = await Paystack.createRecipient({name: `${user?.firstName} ${user?.lastName}`, account_number: String(account_number), bank_code: String(bank_code)})
        const transfer = await Paystack.createTransfer({amount: Number(amount), reference: crypto.randomUUID(), recipient: (recipient as recipient_int).recipient_code})
        const userAccount = await Account.getOrcreateAccount(user.email)
        const transaction = await Transaction.create({reference: (transfer as transfer_int).reference, accountId: userAccount._id, type: transaction_types.withdrawal, amount: Number(amount)})
        userAccount.balance = userAccount.balance - Number(amount)
        const updatedAccount = await userAccount.save()
        return res.status(200).json({
            transaction, balance: updatedAccount.balance
        })
    }catch(err: any){
        if(err?.response?.data)return err.response.data.message
        return sendServerFailed(res, "complete transaction")
    }
})

export const withdrawalCallBack = catchasync(async(req: Request, res: Response)=>{
    //
    
})