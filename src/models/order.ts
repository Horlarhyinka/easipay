import mongoose, { Model, Schema, Types, model } from "mongoose";
import { order_int, order_model } from "./types/order";
import itemSchema from "./item";
import payment_methods from "../util/payment_methods";
import { item_int } from "./types/item";

const orderSchema = new Schema<order_int>({
    items: {
         type: [itemSchema],
         required: true
        },
    method: {
        type: String,
        enum:[...Object.values(payment_methods)]
    },
    note: {
        type: String
    },
    publicId: {
        type: String
    }
}, {timestamps: true, virtuals: true})

orderSchema.virtual("total").get(async function(){
    const total = this.items.reduce((prev: number, curr: item_int)=>prev+(curr.quantity * curr.price),0)
    return total
})


export default model("order", orderSchema)