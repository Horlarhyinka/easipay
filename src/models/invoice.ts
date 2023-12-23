import mongoose from "mongoose";
import { field_int, invoice_int } from "./types/invoice-types";
import "./user";


const fieldSchema = new mongoose.Schema<field_int>({
    name:{
        type:String,
        required: [true, "field name is required"]
    },
    type:{
        type: String,
        default:"string"
    },
    values:{
        type: [String],
        default: []
    }
}, {timestamps: true})



const invoiceSchema = new mongoose.Schema<invoice_int>({
    title: {
        type: String,
        required: true
    },
    fields: {
        type: [fieldSchema],
        required: true,
        default: []
    },
    publicId: {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId()
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

export default mongoose.model("invoice", invoiceSchema);