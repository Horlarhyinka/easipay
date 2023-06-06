import { Document, Model } from "mongoose";

export interface user_int extends Document{
    email: string,
    password: string | undefined, 
    firstName?:string, 
    lastName? : string, 
    tel?: string,
    links: string[],
    genToken: ()=>string,
    validatePassword: (password: string)=>Promise<boolean>
}

interface user_model extends Model<user_int>{
  }