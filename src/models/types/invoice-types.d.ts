import { Document, Model, ObjectId } from "mongoose";

export interface invoice_int extends Document{
    title: string
    fields: field_int[]
    values: ((string | number)[])[]
    publicId: ObjectId
    userId: ObjectId
}

export interface field_int extends Document{
    name: string,
    type: string,
    values: string[]
}

export type field_input_type = {name: string, type: string }

