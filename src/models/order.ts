import { Model, Schema, Types, model } from "mongoose";
import { order_int, order_model } from "./types/order";

const orderSchema = new Schema<order_int>({
    items: {
         type: [Types.ObjectId], 
         ref: "item",
         required: true
        },
    total: Number,
    method: {
        type: String,
        enum: ["CARD", "USSD", "PAYPAL", "CRYPTO"]
    }
})



export default model<order_int, order_model >("order", orderSchema)