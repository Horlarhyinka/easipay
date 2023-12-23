import mongoose from "mongoose";
import { account_int, account_model } from "./types/account";
import "./transaction";
import "./user"

const accountSchema = new mongoose.Schema<account_int, account_model>({
    email: {
        type: String,
        ref: "user",
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    }
})

accountSchema.statics.getOrcreateAccount = async function(email: String){
    const existing = await this.findOne({email})
    if(existing)return existing;
    const created = await this.create({email})
    return created
}

export default mongoose.model<account_int, account_model>("account", accountSchema)