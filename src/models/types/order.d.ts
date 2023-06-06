import { Document, ObjectId, Model } from "mongoose";

export interface order_int extends Document{
    items: (string | ObjectId)[],
    method: string,
    total: string,
    links: string[]
}

interface order_model extends Model<order_int>{
  createLink: Promise<string>, revokeLink: Promise<order_int>
  }