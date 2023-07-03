import { sendResourceNotFound } from "../util/responseHandlers";
import {Request, Response } from "express";

export default (req: Request, res: Response) =>{
    return sendResourceNotFound(res, "route")
}