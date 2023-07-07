import mongoose, { ObjectId, Schema, model } from "mongoose";
import { link_int, link_model } from "./types/link";
import status from "../util/status";
import { url_regex } from "../util/regex";
import { user_int } from "./types/user";
import { order_int } from "./types/order";

const linkSchema = new Schema<link_int>({
    url:{
        type: String,
        required: true,
        match: url_regex,
        immutable: true
    },
    status: {
        type: String,
        enum:[status.ACTIVE, status.COMPLETED, status.REVOKED, status.EXPIRED],
        required: true,
        default: status.ACTIVE
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        immutable: true
    },
    discuss: {
        type: Boolean,
        default: true
    },
    expiresIn: {
        type: Date,
        default: new Date(Date.now() + 1000*60*60*24*30) //expires in 30 days
    }
},{
    virtuals: true
})

linkSchema.pre("save", function(){
    (this as link_int).status = (this as link_int).status.toUpperCase()
})

linkSchema.methods.updateStatus = function(newStatus: string){
    if(!newStatus || !Object(status)[newStatus])return null;
    this.status = newStatus
}

export default model("link", linkSchema)