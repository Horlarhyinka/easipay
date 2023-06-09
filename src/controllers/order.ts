import Order from "../models/order";
import catchasync from "../util/catchasync";
import { Request, Response} from "express";
import media from "../services/media";
import { validateItem } from "../util/validators";
import payment_methods from "../util/payment_methods";
import mongoose from "mongoose"

export const createOrder = catchasync(async(req: Request, res: Response)=>{
    const items: {name: string, price: number, note?: string, quantity?: number, _id?: mongoose.Types.ObjectId}[] = req.body.items
    if(!items)return res.status(400).json({message: "provide items in order"})
    let totalPrice = 0
    items.forEach((item)=>{
        const validate = validateItem(item)
        if(validate.error)return res.status(400).json(validate.error.message)
        totalPrice += item.price
    })
    if(!payment_methods.includes(req.body.method?.toUpperCase()))return res.status(400).json({message: "payment method must be " + payment_methods.join(" or ")})
    try{
        //handle uploads
    const order = await Order.create({...req.body, total: totalPrice})
    return res.status(201).json(order)
    }catch(ex: Error | any){
        const messages: string[] = []
        for(let key in ex.errors){
            messages.push(ex.errors[key]?.properties?.message)
        }
        return res.status(400).json({message: messages.join("\n")})
    }
})