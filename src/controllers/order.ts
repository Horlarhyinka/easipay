import Order from "../models/order";
import catchasync from "../util/catchasync";
import { Request, Response} from "express";
import media from "../services/media";
import { validateItem } from "../util/validators";
import payment_methods from "../util/payment_methods";
import { sendMissingDependency, sendServerFailed } from "../util/responseHandlers";
import flushMedias from "../util/flushMedias";

export const createOrder = catchasync(async(req: Request, res: Response)=>{
    interface item_int{name: string, price: number, note?: string, quantity?: number, images?: string[], id: number | string}
    let {items, method, } = req.body;
    items = JSON.parse(items) as item_int[]
    if(!method){
        method = "CARD"
    }

    if(!items){
        flushMedias()
        return sendMissingDependency(res, "items list")
    }
    const images:{[key: number]: string[]} = {}
    const imageFiles = req.files as Request["file"][];
    if(!imageFiles){
        flushMedias()
        return sendMissingDependency(res, "image")
    }
    try{
    for(let i in imageFiles){
        type image_key = keyof typeof image
        const image = imageFiles[i];
        const id = image!.fieldname.slice( image!.fieldname.lastIndexOf("-")+1)
        const urls = (await media.handleMedias(image)) as string[]
        if(!urls?.length){
            flushMedias()
            return sendServerFailed(res, "upload media")
        }
        if(images[id as image_key]){
            images[id as image_key] = [...(images[id as image_key]), ...urls!]
        }else{
            images[id as image_key] = [...urls]
        }
    }
    }catch(ex){
        flushMedias()
        return sendServerFailed(res, "upload media")
    }

    for(let i in items){
        const item: item_int = items[i];
        item.images = images[(item.id as Number) as keyof typeof images] as string[]
    }
    try{
        const order = await Order.create({items, method})
        
    }catch(ex: Error | any){
        console.log(ex)
        const messages: string[] = []
        for(let key in ex.errors){
            messages.push(ex.errors[key]?.properties?.message)
        }
        flushMedias()
        return res.status(400).json({message: messages.join("\n")})
    }
})

export const updateOrder = catchasync(async(req: Request, res: Response)=>{

})