import { Document, ObjectId } from "mongoose";
import { transaction_types } from "../../util/factory";

export interface transaction_int extends Document{
    reference: string
    type: transaction_types //payment  || withdrawal
    accountId: ObjectId
    amount: number
    successful: boolean
    channel?: string
}