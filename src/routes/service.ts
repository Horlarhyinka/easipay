import { Router } from "express";
import * as services from "../controllers/services"

const router = Router()

router.get("/banks", services.listBanks)
router.get("/accounts/verify", services.verifyAccount)

export default router