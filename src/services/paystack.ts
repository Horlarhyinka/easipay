import config from "../config/config";
import axios from "axios";
import { account_info, paystack_int, recipient, transfer_int } from "./types/paystack";

const {base_url, secret_key} = config.SERVICES.PAYMENT

export class Paystack implements paystack_int{
    private payment_base_url = config.SERVICES.PAYMENT.base_url
    private secret_key = config.SERVICES.PAYMENT.secret_key
    private app_base_url = config.APP.baseUrl

    checkout = async(obj:{email: string, amount: number}) =>{
    const res = await axios.post(this.payment_base_url +"/transaction/initialize",{
                ...obj, amount: obj.amount * 100, callback_url: this.app_base_url + "/payments/callback"
                }, {
                     headers: {Authorization: "Bearer " + this.secret_key},
                    })
    return res.data?.data?.authorization_url
    }

    verifyPayment = async(ref: string)=>{
        const res = await axios.get(this.payment_base_url + "/transaction/verify/"+ref,{
            headers: {Authorization: "Bearer " + this.secret_key}
        })
        return res.data
    }
    verifyAccount = async(account_number: string, bank_code: number) =>{
        const res = await axios.get(`${this.payment_base_url}/bank/resolve?account_number=${account_number}&&bank_code=${bank_code}`,{
            headers: {Authorization: "Bearer " + this.secret_key}
        })
        return res.data
    }
    createRecipient = async(obj: { name: string; account_number: string; bank_code: string; }) =>{
        const res = await axios.post(`${this.payment_base_url}/transferrecipient`,{type: "nuban", name: obj.name, account_number: obj.account_number, bank_code: obj.bank_code, currency: "NGN"},{
            headers: {Authorization: "Bearer " + this.secret_key},
        })
        return res.data
    }
    createTransfer = async(obj: { source: string; reason: string; amount: number; reference: string; recipient: string; }) =>{
        const res = await axios.post(`${this.payment_base_url}/transfer`,{...obj})
        return res.data
    }
    
}

export default Object.freeze(new Paystack())