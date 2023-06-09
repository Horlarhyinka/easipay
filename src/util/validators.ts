import joi from "joi";

export const validateItem = (info: object) =>joi.object({
    name: joi.string().required().min(3),
    price: joi.number().required(),
    note: joi.string().max(255),
    quantity: joi.number().min(1)
}).validate(info)