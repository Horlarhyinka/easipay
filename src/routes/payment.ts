import { Router } from "express";
import * as payments from "../controllers/payment";
import auth from "../middlewares/auth";

const router = Router()

router.use(auth)
router.post("/initialize", payments.makePayment)