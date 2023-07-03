import mongoose, { Schema, model } from "mongoose";
import { link_int, link_model } from "./types/link";
import status from "../util/status";
import { url_regex } from "../util/regex";

const linkSchema = new Schema<link_int>({
    url:{
        type: String,
        required: true,
        match: url_regex
    },
    status: {
        type: String,
        enum:[status.ACTIVE, status.COMPLETED, status.REVOKED, status.EXPIRED],
        required: true,
        default: status.ACTIVE
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order"
    },
    discuss: {
        type: Boolean,
        default: true
    },
    expiresIn: {
        type: Date,
        default: new Date(Date.now() + 1000*60*60*24*30)
    }
})

linkSchema.pre("save", function(){
    this.status = this.status.toUpperCase()
})

linkSchema.methods.updateStatus = function(newStatus: string){
    if(!newStatus || !status[newStatus])return null;
    this.status = newStatus
}

export default model<link_int, link_model>("link", linkSchema)