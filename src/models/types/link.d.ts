import { Document, ObjectId, Model } from "mongoose"
import { user_int } from "./user"

export interface link_int extends Document{
    url: string,
    revoke: ()=>Promise<void>,
    active: boolean
}

declare enum status_enum {ACTIVE, REVOKED}

export interface link_model extends Model<user_int>{
    
}