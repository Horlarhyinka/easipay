import { Document, Model, ObjectId } from "mongoose";

export interface item_int extends Document{
    name: string,
    quantity: number,
    images: [],
    note?: string,
    price: number
}

export type item_ref_type = string | ObjectId | item_int

export interface item_model extends Model<item_int>{

}