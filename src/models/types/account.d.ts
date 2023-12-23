import { Document, Model, ObjectId } from "mongoose"
import { transaction_int } from "./transaction"

export interface account_int extends Document{
    email: string
    balance: number
}

export interface account_model extends Model<account_int>{
    getOrcreateAccount: (email: string)=>Promise<account_int>
}