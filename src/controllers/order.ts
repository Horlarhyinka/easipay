import Order from "../models/order";
import catchasync from "../util/catchasync";
import { Request, Response} from "express";

export const createOrder = catchasync((req: Request, res: Response)=>{
    console.log(req.file)
})