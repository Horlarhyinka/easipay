import { Router } from "express";
import * as payments from "../controllers/transaction";
import auth from "../middlewares/auth";

const router = Router()

router.post("/initialize", payments.makePayment)
router.get("/verify", payments.verifyPayment)
router.get("/callback", payments.paymentCallback)

export default router;