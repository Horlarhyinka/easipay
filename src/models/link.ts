import { Schema, model } from "mongoose";
import { link_int, link_model } from "./types/link";
import { boolean } from "joi";

const linkSchema = new Schema<link_int>({
    url:{
        type: String,
        required: true
    },
    active:{
        type: Boolean,
        default: true
    }
})

export default model<link_int, link_model>("link", linkSchema)