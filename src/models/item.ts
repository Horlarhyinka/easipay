import { Schema, model } from "mongoose";
import {item_int, item_model} from "./types/item"

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        default: 1,
        min: 1
    },
    images: {
        type: [String]
    },
    note: {
        type: String
    }
})

export default itemSchema