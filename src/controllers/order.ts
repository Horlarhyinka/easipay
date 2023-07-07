import Order from "../models/order";
import catchAsyncErrors from "../util/catchasync";
import { Request, Response} from "express";
import { validateItem } from "../util/validators";
import payment_methods from "../util/payment_methods";
import { sendMissingDependency, sendResourceNotFound, sendServerFailed } from "../util/responseHandlers";
import catchMongooseErr from "../util/catchMongooseErr";
import { user_int } from "../models/types/user";
import { ObjectId } from "mongoose";
import { order_int } from "../models/types/order";
import { item_int } from "../models/types/item";

export const createOrder = catchAsyncErrors(async(req: Request, res: Response)=>{
    interface item_int{name: string, price: number, note?: string, quantity?: number, images: string[]}
    const items: item_int[] = req.body.items 
    if(!items || !Array.isArray(items) || items.length < 1)return sendMissingDependency(res, "items list")
    let {method} = req.body
    if(!method){
        method = payment_methods.DEFAULT
    }
    method = method.toUpperCase();
    for(let i = 0; i < items.length; i++){
        const item = items[i]
        const validationResponse = validateItem(item);
        if(validationResponse.error)return res.status(400).json(validationResponse.error.message)
    }
    try{
        const data: {method: string, items: item_int[], note?: string} = {items, method}
        const {note} = req.body
        if(note){
            data.note = note
        }
    const newOrder = await Order.create(data)
    const user = req.user! as user_int
    user.orders.push(newOrder._id)
    await user.save()
    return res.status(201).json(newOrder)
    }catch(ex){
        console.log(ex)
        const messages = catchMongooseErr(ex)
        if(messages?.message)return res.status(400).json(messages)
        return sendServerFailed(res, "create order")
    }
})

export const updateOrder = catchAsyncErrors(async(req: Request, res: Response)=>{
    const mutables = ["method", "note"]
    const {orderId} = req.params || req.query || req.body
    if(!orderId)return sendMissingDependency(res, "order id")
    const order = await Order.findById(orderId)
    if(!order)return sendResourceNotFound(res, "order")
    const orderIndex = (req.user! as user_int).orders.findIndex((order: string | ObjectId)=>order.toString() === orderId.toString())
    if(orderIndex < 0)return res.status(403).json({message: "forbiden"})
    let {method} = req.body
    if(method){
        req.body.method = method.toUpperCase()
    }
    try {
        for(let key in req.body){
            if(mutables.includes(key.toLowerCase())){
                order.set(key, req.body[key])
            }
        }
        const updatedOrder = await order.save()
        return res.status(200).json(updatedOrder)
    } catch (ex) {
        const mongooseErrMessage = catchMongooseErr(ex)
        if(mongooseErrMessage?.message)return res.status(400).json(mongooseErrMessage)
        return sendServerFailed(res, "update order")
    }
})

export const deleteOrder = catchAsyncErrors(async(req: Request, res: Response)=>{
    const {orderId} = req.params || req.query
    if(!orderId)return sendMissingDependency(res, "order id")
    const orderIndex = (req.user! as user_int).orders.findIndex((order: string | ObjectId)=>order.toString() === orderId.toString())
    if(orderIndex < 0)return sendResourceNotFound(res, "order")
    const deletedOrder = await Order.findByIdAndDelete(orderId)
    if(!deletedOrder)return sendResourceNotFound(res, "order")
    return res.status(204).json(deletedOrder)
})

export const getOrders = catchAsyncErrors(async(req: Request, res: Response)=>{
    const {orders} = await (req.user as user_int).populate("orders");
    return res.status(200).json(orders)
})

export const getOrder = catchAsyncErrors(async(req: Request, res: Response)=>{
    const {orderId} = req.params || req.query
    if(!orderId)return sendMissingDependency(res, "order id")
    const orders = (await (req.user as user_int).populate("orders")).orders as unknown
    const orderIndex = (orders as order_int[]).findIndex((order)=>order._id.toString() === orderId.toString())
    if(orderIndex < 0)return sendResourceNotFound(res, "order")
    return res.status(200).json((orders as order_int[])[orderIndex])
})

export const updateOrderItem = catchAsyncErrors(async(req: Request, res: Response)=>{
    const {orderId, itemId} = req.params || req.query || req.body
    if(!orderId)return sendMissingDependency(res, "order id")
    if(!itemId)return sendMissingDependency(res, "item id")
    const orderIndex = (req.user as user_int).orders.findIndex((order)=>order.toString() === orderId.toString())
    if(orderIndex < 0)return sendResourceNotFound(res, "order")
    const order = await Order.findById(orderId).populate("items").select("items");
    const itemIndex = (order!.items as item_int[]).findIndex((item)=>item._id.toString() === itemId.toString())
    if(itemIndex < 0)return sendResourceNotFound(res, "item")
    const item = order!.items[itemIndex] as item_int
    for(let key in req.body){
        item.set(key, req.body[key])
    }
    try{
    order!.items[itemIndex] = item
    const updatedOrder = await order!.save()
    return res.status(200).json(updatedOrder)
    }catch(ex){
        const mongooseErrMessage = catchMongooseErr(ex)
        if(mongooseErrMessage?.message)return res.status(400).json(mongooseErrMessage)
        return sendServerFailed(res, "update order item")
    }
})

export const getOrderItem = catchAsyncErrors(async(req: Request, res: Response)=>{
    const {orderId, itemId} = req.params || req.query || req.body
    if(!orderId)return sendMissingDependency(res, "order id")
    if(!itemId)return sendMissingDependency(res, "item id")
    const orderIndex = (req.user as user_int).orders.findIndex((order)=>order.toString() === orderId.toString())
    if(orderIndex < 0)return sendResourceNotFound(res, "order")
    const order = await Order.findById(orderId).populate("items").select("items");
    const itemIndex = (order!.items as item_int[]).findIndex((item)=>item._id.toString() === itemId.toString())
    if(itemIndex < 0)return sendResourceNotFound(res, "item")
    const item = order!.items[itemIndex] as item_int
    return res.status(200).json(item)

})





/**
 * {
  "items": [
    {
      "name": "item 01",
      "price": 10000,
      "note": "a nice item",
      "quantity": 2,
      "images": ["img01.jpg"]
    }
    ]
}
 */