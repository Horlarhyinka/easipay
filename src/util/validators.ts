import joi from "joi";
import mongoose from "mongoose";

export const validateItem = (info: object) =>joi.object({
    name: joi.string().required().min(3),
    price: joi.number().required(),
    note: joi.string().max(255),
    quantity: joi.number().min(1).default(1),
    images: joi.array().min(1).required()
}).validate(info)

export const validateLinkData = (data: object) =>joi.object({
    
})

export const validateObjectId = (id: string) =>mongoose.Types.ObjectId.isValid(id)