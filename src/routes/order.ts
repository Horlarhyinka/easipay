import { Router } from "express";
import { uploadMany, uploadOne, smartUpload } from "../middlewares/media";
import auth from "../middlewares/auth"
import { createOrder } from "../controllers/order";
import { Request, Response } from "express";
const router = Router()

router.use(auth)
router.post("/", uploadOne, createOrder)

export default router;