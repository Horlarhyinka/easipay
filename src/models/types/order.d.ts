import { Document, ObjectId, Model } from "mongoose";
import { item_int } from "./item";

export interface order_int extends Document{
    items: (string | ObjectId | item_int)[],
    method: string,
    total: string,
    links: string[],
    note: string
}

interface order_model extends Model<order_int>{
  createLink: Promise<string>, revokeLink: Promise<order_int>
  }