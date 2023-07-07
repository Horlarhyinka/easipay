import { Model, Schema, Types, model } from "mongoose";
import { order_int, order_model } from "./types/order";
import itemSchema from "./item";
import payment_methods from "../util/payment_methods";

const orderSchema = new Schema<order_int>({
    items: {
         type: [itemSchema],
         required: true
        },
    total: Number,
    method: {
        type: String,
        enum:[...Object.values(payment_methods)]
    },
    note: {
        type: String
    }
})


export default model("order", orderSchema)