import config from "../config/config";
import axios from "axios";
import { paystack_int } from "./types/paystack";
import { default_payment_description, default_payment_source } from "../util/factory";

export class Paystack implements paystack_int{
    private payment_base_url = config.SERVICES.PAYMENT.base_url
    private secret_key = config.SERVICES.PAYMENT.secret_key
    private app_base_url = config.APP.baseUrl

    public checkout = async(obj:{email: string, amount: number}) =>{
        try {
    const res = await axios.post(this.payment_base_url +"/transaction/initialize",{
                ...obj, amount: obj.amount * 100, callback_url: this.app_base_url + "/payments/callback"
                }, {
                     headers: {Authorization: "Bearer " + this.secret_key},
                    })
    return res.data?.data?.authorization_url
        } catch (error) {
            throw error
        }
    }

    public verifyPayment = async(ref: string)=>{
        const res = await axios.get(this.payment_base_url + "/transaction/verify/"+ref,{
            headers: {Authorization: "Bearer " + this.secret_key}
        })
        return res.data
    }
    public verifyAccount = async(obj: {account_number: string, bank_code: string}) =>{
        const res = await axios.get(`${this.payment_base_url}/bank/resolve?account_number=${obj.account_number}&&bank_code=${obj.bank_code}`,{
            headers: {Authorization: "Bearer " + this.secret_key}
        })
        return res.data
    }
    public createRecipient = async(obj: { name: string; account_number: string; bank_code: string; }) =>{
        const res = await axios.post(`${this.payment_base_url}/transferrecipient`,{type: "nuban", name: obj.name, account_number: obj.account_number, bank_code: obj.bank_code, currency: "NGN"},{
            headers: {Authorization: "Bearer " + this.secret_key},
        })
        return res.data
    }
    public createTransfer = async(obj: {amount: number; reference: string; recipient: string; }) =>{
        const res = await axios.post(`${this.payment_base_url}/transfer`,{
            ...obj, 
            source: default_payment_source, 
            reason: default_payment_description
        }, {
            headers: {
            Authorization: `Bearer ${this.secret_key}`
        }})
        return res.data
    }
    public listBanks = async()=>{
        const res = await axios.get(`${this.payment_base_url}/bank?country=nigeria`,)
        return res.data
    }
}

export default Object.freeze(new Paystack())