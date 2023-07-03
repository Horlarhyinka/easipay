import Link from "../models/link";
import catchasync from "../util/catchasync";
import { Request, Response } from "express";
import { sendMissingDependency, sendResourceNotound, sendServerFailed } from "../util/responseHandlers";
import Order from "../models/order";
import { user_int } from "../models/types/user";
import { ObjectId } from "mongoose";

export const createLink = catchasync(async(req: Request, res: Response)=>{
    const {orderId} = req.params || req.query || req.body
    if(!orderId)return sendMissingDependency(res, "order id")
    const orderIndex = (req.user as user_int).orders.findIndex((order: string | ObjectId)=>String(order) === orderId)
    if(orderIndex < 0)return sendResourceNotound(res, "order")
    const link = await Link.create({ order: orderId})
    if(!link)return sendServerFailed(res, "create link")
    return res.status(201).json(link)
})