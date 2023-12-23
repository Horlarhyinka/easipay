import config from "../config/config";
import axios from "axios";

const {base_url, secret_key} = config.SERVICES.PAYMENT

export const checkout = async(obj:{email: string, amount: number}) =>{
    const res = await axios.post(base_url+"/transaction/initialize",{
        ...obj, amount: obj.amount * 100, callback_url: config.APP.baseUrl + "/payments/callback"
    }, {
        headers: {Authorization: "Bearer " + secret_key}
    })
    return res.data?.data?.authorization_url
}

export const verifyPayment = async(ref: string)=>{
    const res = await axios.get(base_url+"/transaction/verify/"+ref,{
        headers: {Authorization: "Bearer " + secret_key}
    })
    return res.data
}

export const withdraw = (obj:{email: string, amount: number})=>{

}