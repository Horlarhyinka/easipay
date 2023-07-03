import { Router } from "express";
import { uploadAny, uploadMany, uploadOne } from "../middlewares/media";
import auth from "../middlewares/auth"
import { createOrder } from "../controllers/order";
import { Request, Response } from "express";
const router = Router()

// router.use(auth)
router.post("/", uploadAny, createOrder)

export default router;