import { Document, Model } from "mongoose";

export interface item_int extends Document{
    name: string,
    quantity: number,
    images: [],
    note?: string,
    price: number
}

export interface item_model extends Model<item_int>{

}