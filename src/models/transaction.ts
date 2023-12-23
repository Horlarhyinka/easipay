import mongoose from "mongoose";
import { transaction_int } from "./types/transaction";
import { transaction_types } from "../util/factory";
import "./account";


const transactionSchema = new mongoose.Schema<transaction_int>({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(transaction_types)
    },
    amount: {
        type: Number,
        required: true
    },
    successful: {
        type: Boolean,
        required: true
    },
    channel:{
        type: String
    }
},{
    timestamps: true
})

export default mongoose.model("transaction", transactionSchema)
