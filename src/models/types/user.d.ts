import { Document, Model, ObjectId } from "mongoose";
import { order_ref_type } from "./order";

export interface user_int extends Document{
    email: string,
    password: string | undefined, 
    firstName?:string, 
    lastName? : string, 
    tel?: string,
    orders: order_ref_type[],
    genToken: ()=>string,
    validatePassword: (password: string)=>Promise<boolean>,
    resetToken: string | undefined,
    tokenExpiresIn: Date | undefined
    username?: string
    avatar?: string
    country?: string
    account: string
}

export type user_ref_type = user_int | string | ObjectId

interface user_model extends Model<user_int>{
  }