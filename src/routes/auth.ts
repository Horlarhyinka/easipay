import {Router} from "express";
import * as auth from "../controllers/auth";
import { usePassport } from "../config/passport";
import passport from "passport";

const router = Router()

router.post("/register",auth.register)
router.post("/login", auth.login)
router.get("/google", usePassport)
router.get("/redirect", passport.authenticate("google"), auth.oauthRedirect)

export default router