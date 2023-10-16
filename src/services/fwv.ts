import mongoose from "mongoose";
import config from "../config/config";
import { fetch_balance_res, fetch_transaction_res, fwv_int, subaccount_int, transaction_int } from "./types/fwv";
import axios from "axios";

class FWV implements fwv_int{
    constructor(private public_key: string, private secret_key: string, private base_url: string, private encryption_key: string ){
        this.public_key = public_key
        this.secret_key = secret_key
        this.base_url = base_url
        this.encryption_key = encryption_key
    }
    createPayment = async(obj: { email: string; amount: number; subaccount: string; currency: string }) =>{
        const res = (await axios.post(this.base_url+"/payments",{
            customer: {email: obj.email},
            amount: obj.amount,
            currency: obj.currency || "NGN",
            redirect_url: config.APP.baseUrl + "/payments/redirect",
            customization: "add customization later",
            logo: "add logo later",
            tx_ref: String(new mongoose.Types.ObjectId())
        }, {headers: { Authorization: `Bearer ${this.secret_key}`}})).data as { message: string, data: {link: string}}
        console.log({res}, res.data)
        return res.data.link
    }
    createSubaccount = async(obj: { account_name: string; email: string; mobilenumber: string; country: string; })=>{
        const res = (await axios.post(this.base_url + "/payout-subaccounts", {
            ...obj
        }, {
            headers: {Authorization: `Bearer ${this.secret_key}`}
        })).data as {status: string, data: subaccount_int}
        console.log(res.data, 1)
        return res.data.account_reference
    }
    getSubaccount = async(ref: string) =>{
        const res = (await axios.get(this.base_url + "/payout-subaccounts/" + ref, {
            headers: {Authorization: `Bearer ${this.secret_key}`}
        })).data as {status: string, data: subaccount_int}
        return res.data
    }

    updateSubaccount = async(ref: string, update: { account_name: string; mobilenumber: string; email: string; country: string})=>{
        const res = (await axios.put(this.base_url + "/payout-subaccounts/" + ref, {...update}, {headers:{
            Authorization: `Bearer ${this.secret_key}`
        }})).data as {status: string, data: subaccount_int}
        return res.data
    }

    getTransactions = async(ref: string, currency: string, from?: string, to?: string) =>{
        const toDate = new Date()
        const fromDate = new Date(Date.now() - (1000 *60*60*24*30))
        const req_to = to || `${toDate.getFullYear()}-${toDate.getMonth()}-${toDate.getDay()}`
        const req_from = from || `${fromDate.getFullYear()}-${fromDate.getMonth()}-${fromDate.getDay()}`
        const res = (await axios.get(`${this.base_url}/payout-subaccounts/${ ref }/transactions/?currency=${currency || "NGN"}&&from=${req_from}&&to=${req_to}`, {
            headers: {Authorization: `Bearer ${this.secret_key}`}
        })).data as {status: string, data: fetch_transaction_res}
        return res.data
    }

    getBalance = async(ref: string) =>{
        const res = (await axios.get(this.base_url + "/payout-subaccounts/"+ref + "/balances", {
            headers: {Authorization: `Bearer ${this.secret_key}`}
        })).data as {status: string, data:fetch_balance_res}
        return res.data
    }
}

const fwv = new FWV(config.SERVICES.FWV.public_key, config.SERVICES.FWV.secret_key, config.SERVICES.FWV.base_url, config.SERVICES.FWV.encrryption_key )

export default Object.freeze(fwv)