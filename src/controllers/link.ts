import Link from "../models/link";
import catchasync from "../util/catchasync";
import { Request, Response } from "express";
import { sendMissingDependency, sendResourceNotFound, sendServerFailed } from "../util/responseHandlers";
import { user_int } from "../models/types/user";
import { ObjectId } from "mongoose";
import generateUrl from "../util/generateUrl";
import catchMongooseErr from "../util/catchMongooseErr"
import { link_int } from "../models/types/link";

export const createLink = catchasync(async(req: Request, res: Response)=>{
    const {orderId} = req.query || req.body
    if(!orderId)return sendMissingDependency(res, "order id")
    const orderIndex = (req.user as user_int).orders.findIndex((order: string | ObjectId)=>String(order) === orderId)
    if(orderIndex < 0)return sendResourceNotFound(res, "order")
    const url = generateUrl()
    try{
    const link = await Link.create({ order: orderId, url})
    if(!link)return sendServerFailed(res, "create link");
    (req.user! as user_int).links.push(link._id)
    await (req.user as user_int).save()
    return res.status(201).json(link)
    }catch(ex){
        const mongooseErrorMessage = catchMongooseErr(ex)
        if(mongooseErrorMessage?.message)return res.status(400).json(mongooseErrorMessage)
        console.log(ex)
        return sendServerFailed(res, "generate link")
    }
})

export const updateLink = catchasync(async(req: Request, res: Response)=>{
    const user = req.user! as user_int
    const {linkId} = req.params || req.query;
    if(!linkId)return sendMissingDependency(res, "link id")
    const linkIndx = user.links.findIndex((link=>link.toString() === linkId.toString()))
    if(linkIndx < 0)return sendResourceNotFound(res, "link")
    const link = (await Link.findById(linkId))! as link_int
    try{
    for(let key in req.body){
        if(key.toLowerCase() == "expiresin" && !Date.parse(req.body[key])){
            const val = req.body[key]
            if(typeof val === "number"){
                let date = new Date(val)
                if(date.getTime() + 10000 < (new Date()).getTime()){
                    date = new Date(Date.now() + val)
                }
                link.set(key, date)
            }
            continue;
        }
        link.set(key, req.body[key])
    }
    const status = req.query.status || req.body.status;
    if(status){
        link.status = status.toString().toUpperCase()
    }
    const updatedLink = await link.save()
    return res.status(200).json(updatedLink)
    }catch(ex){
        const mongooseErrorMessage = catchMongooseErr(ex)
        if(mongooseErrorMessage?.message)return res.status(400).json(mongooseErrorMessage)
        console.log(ex, mongooseErrorMessage)
        return sendServerFailed(res, "update link")
    }
})

export const getLinks = catchasync(async(req: Request, res: Response)=>{
    const {links} = await (req.user as user_int).populate('links');
    return res.status(200).json(links)
})

export const getLink = catchasync(async(req: Request, res: Response)=>{
    const {linkId} = req.params || req.query;
    if(!linkId)return sendMissingDependency(res, "link id")
    const link = await Link.findById(linkId).populate("order")
    if(!link)return sendResourceNotFound(res, "link")
    return res.status(200).json(link)
})

export const deleteLink = catchasync(async(req: Request, res: Response)=>{
    const {linkId, url} = req.params || req.query || req.body;
    try{
        let deletedLink: link_int | null;
        if(linkId){
            deletedLink = await Link.findByIdAndDelete(linkId)
        }else{
            deletedLink = await Link.findOneAndDelete({url})
        }
        return res.status(204).json(deleteLink)
    }catch(ex){
        const mongooseErrorMessage = catchMongooseErr(ex)
        if(mongooseErrorMessage?.message)return res.status(400).json(mongooseErrorMessage)
        console.log(ex)
        return sendServerFailed(res, "delete link")
    }
})