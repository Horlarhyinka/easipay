import { Document, Model, ObjectId } from "mongoose";

export interface user_int extends Document{
    email: string,
    password: string | undefined, 
    firstName?:string, 
    lastName? : string, 
    tel?: string,
    links: (string | ObjectId)[],
    orders: (string | ObjectId )[],
    genToken: ()=>string,
    validatePassword: (password: string)=>Promise<boolean>,
    resetToken: string | undefined,
    tokenExpiresIn: Date | undefined
}

interface user_model extends Model<user_int>{
  }