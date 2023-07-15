import dotenv from "dotenv";
import { randomUUID } from "crypto";
import axios from "axios";

dotenv.config()

interface payment_service{
    acceptFund: (customerInfo:{email: string, tel: string}, transactionInfo:{amount: number , currency: string})=>Promise<{status: string, link: string} | {status: string, message: string}>,
    sendFund: ()=>Promise<string>,
}

enum response_status {SUCCESS = "success", FAILED = "failed"}

//fwv stands for flutterwave
export default class FWV implements payment_service{
    constructor(
        private API_KEY: string = process.env.FLUTTERWAVE_API_KEY!,
        private API_SECRET: string = process.env.FLUTTERWAVE_SECRET_KEY!,
        private FWV_BASE_URL: string = process.env.FLUTTERWAVE_BASE_URL!
    ){}
    private generateUniqueId = () =>randomUUID()+"-"+ (Math.floor(Math.random() * Date.now() * 10000)).toString()
    public acceptFund = async(customerInfo:{email: string, tel: string}, transactionInfo:{amount: number, currency: string})=>{
        const {email, tel} = customerInfo;
        const {amount, currency} = transactionInfo;
        try{
             const response = await axios.post(this.FWV_BASE_URL,{
                tx_re: this.generateUniqueId(),
                amount: amount,
                currency: currency,
                customer:{ email, tel },
                payment_options: "card, ussd, credit",
                redirect_url: process.env.BASE_URL! + "/payment/redirect"
            },{
                headers:{
                    Authorization: `Bearer ${this.API_SECRET}`
                }
            })
        const responseData = <{status: response_status.SUCCESS, message: string, data:{link: string }}>response.data;
        const returnObj = {status: response_status.SUCCESS, link: responseData.data.link!}
        return returnObj;
        }catch(ex: any){
            const message = ex.response.data.message!;
            return {status: response_status.FAILED, message }
        }
       
    }
    public sendFund = async() =>{
        return String()
    }
}