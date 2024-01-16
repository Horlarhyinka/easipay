import {Request, Response} from "express";
import catchasync from "../util/catchasync";
import paystack from "../services/paystack";
import { sendInvalidEntry, sendMissingDependency } from "../util/responseHandlers";
import cache from "../services/cache";

/**
 * /services/accounts/:account_number/verify
 * /services/banks
 */

export const verifyAccount = catchasync(async(req: Request, res: Response)=>{
    const account_number = req.params.account_number || req.query.account_number
    const bank_code = req.params.bank_code || req.query.bank_code
    if(!account_number)return sendMissingDependency(res, "account_number")
    if(!bank_code)return sendMissingDependency(res, "bank_code")

    try{
        const accountInfo = await paystack.verifyAccount({bank_code: String(bank_code), account_number: String(account_number)})
        return res.status(200).json(accountInfo)
    }catch(err: any){
        if(err.error?.response?.data)return res.status(400).json(err.error.response.data)
        return res.status(500).json("unable to verify account")
    }
})

export const listBanks = catchasync(async(req: Request, res: Response)=>{
    try{
        const banks = await cache.getOrSet(req.path, paystack.listBanks)
        return res.status(200).json(banks)
    }catch(err: any){
        if(err.error?.response?.data)return res.status(400).json(err.error.response.data)
        return res.status(500).json("unable to fetch banks")
    }
})