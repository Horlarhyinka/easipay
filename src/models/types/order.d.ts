import { Document, ObjectId, Model } from "mongoose";
import { item_int } from "./item";

export interface order_int extends Document{
    items: item_int[],
    method: string,
    total: number,
    note: string,
    publicId: string | ObjectId
}

export type order_ref_type = order_int | string | ObjectId

interface order_model extends Model<order_int>{

  }