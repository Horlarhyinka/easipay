import Invoice from "../models/invoice";
import {Request, Response} from "express";
import catchasync from "../util/catchasync";
import { user_int } from "../models/types/user";
import { sendInvalidEntry, sendMissingDependency, sendResourceNotFound } from "../util/responseHandlers";
import { field_input_type } from "../models/types/invoice-types";

interface ExtReq extends Request{
    user: user_int
}

export enum type_enum{string="string", number="number"}

export const createInvoice = catchasync(async(req: ExtReq, res: Response)=>{
    try{
        const newInvoice = await Invoice.create({...req.body, userId: req.user._id})
        return res.status(201).json(newInvoice)
    }catch(ex){
        throw ex
    }
})

export const getInvoices = catchasync(async(req: ExtReq, res: Response)=>{
    try{
        const invoices = await Invoice.find({userId: req.user._id})
        return res.status(200).json(invoices)
    }catch(ex){
        throw ex
    }
})

export const getInvoice = catchasync(async(req: ExtReq, res: Response)=>{
    try{
        const {invoiceId} = req.params;
        if(!invoiceId)return res.status(400).json({message: "provide a valide invoiceId param"})
        const invoice = await Invoice.findOne({_id: invoiceId, userId: req.user._id})
        if(!invoice)return sendResourceNotFound(res, "invoice")
        return res.status(200).json(invoice)
    }catch(ex){
        throw ex
    }
})

export const previewInvoice = catchasync(async(req: Request, res: Response)=>{
    try{
        const {publicId} = req.params;
        if(!publicId)return res.status(400).json({message: "provide a valide publicId param"})
        const invoice = await Invoice.findOne({ publicId })
        if(!invoice)return sendResourceNotFound(res, "invoice")
        return res.status(200).json(invoice)
    }catch(ex){
        throw ex
    }
})


export const updateInvoice = catchasync(async(req: ExtReq, res: Response)=>{
    try{

    const {invoiceId} = req.params;
    if(!invoiceId)return sendMissingDependency(res, "invoiceId")
    let invoice = await Invoice.findById(invoiceId)
    if(!invoice)return sendResourceNotFound(res, "invoice")
    const newFields = req.body.newFields as (field_input_type)[]
    if(Array.isArray(newFields) && newFields?.length){
        for(let field of newFields){
            if(typeof field === "string"){
                invoice = await Invoice.findByIdAndUpdate(invoiceId, {$push:{
                    fields: {name: field}
                }},{new: true})
                continue;
            }
            const updateObj = {name: field.name, type: field.type}
            if(!type_enum[field.type as keyof typeof type_enum] ){
                field.type = "string"
            }
            invoice = await Invoice.findByIdAndUpdate(invoiceId,{$push:{
                fields: updateObj
            }}, {new: true})
        }
    }
    if(Array.isArray(req.body.updates)){
        for(let update of req.body.updates as [{fieldId: string, index: number,value: string}]){
            const targetField = invoice!.fields.find(f=>String(f._id)===String(update.fieldId))
            if(!targetField)return sendResourceNotFound(res, "invoice field")
            if(!update.index)return sendMissingDependency(res, "update index")
            const newVal = [...targetField.values]
                newVal[update.index] = update.value  
            invoice!.fields.forEach(field=>{
                if(String(field._id) === String(targetField._id)){
                    field.values = newVal;
                }
            })
        }
    } 
    const updated = await invoice!.save()
    return res.status(200).json(updated)
    }catch(err){
        throw err
    }
})

export const deleteInvoice = catchasync(async(req: ExtReq, res: Response)=>{
    const {invoiceId} = req.params
    if(!invoiceId)return sendMissingDependency(res, "invoiceId")
    const invoice = await Invoice.findOne({_id: invoiceId, userId: req.user._id})
    if(!invoice)return sendResourceNotFound(res, "invoice")
    await invoice.deleteOne()
    return res.status(204).json({message: "successful"})
})

export const deletInvoiceField = catchasync(async(req: ExtReq, res:Response)=>{
    const {invoiceId, fieldId} = req.params
    if(!invoiceId)return sendMissingDependency(res, "invoice id")
    if(!fieldId)return sendMissingDependency(res, "invoice id")

    let invoice = await Invoice.findOne({_id: invoiceId, userId: req.user._id})
    if(!invoice)return sendResourceNotFound(res, "invoice")
    invoice.fields = invoice.fields.filter(field=>String(field._id)!==String(fieldId))
    invoice = await invoice.save()
    return res.status(200).json(invoice) 
})