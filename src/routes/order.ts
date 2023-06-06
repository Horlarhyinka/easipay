import { Router } from "express";
import { useMedia } from "../middlewares/media";
import { createOrder } from "../controllers/order";
const router = Router()

router.post("/", useMedia, createOrder)

export default router;