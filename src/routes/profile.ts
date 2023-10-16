import { Router } from "express";
import * as profile from "../controllers/profile";
import auth from "../middlewares/auth";

const router = Router()

router.use(auth)
router.get("/", profile.getProfile)
router.put("/", profile.updateProfile)

export default router;