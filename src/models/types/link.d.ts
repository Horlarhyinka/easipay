import { Document, ObjectId, Model } from "mongoose"
import { user_int } from "./user"

export interface link_int extends Document{
    url: string,
    updateStatus: ()=>Promise<link_int | null>,
    status: string,
    discuss: boolean,
    chatId?: string | ObjectId,
    expiresIn: Date,
    order: string | ObjectId
}

declare enum status_enum {ACTIVE, REVOKED}

export interface link_model extends Model<user_int>{
    
}