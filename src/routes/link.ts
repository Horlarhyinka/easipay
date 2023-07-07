import * as link from "../controllers/link";
import { Router } from "express";
import auth from "../middlewares/auth"
import validateObjectIdParam from "../middlewares/validateObjectIdParam";
const router = Router()

router.get("/:linkId",validateObjectIdParam , link.getLink)
router.use(auth)
router.post("/", link.createLink)
router.get("/", link.getLinks)
router.put("/:linkId", link.updateLink)
router.delete("/:linkId", link.deleteLink)


// http://localhost:7001/api/v1/links?orderId=64a3cf5e2aba9507301685b9

export default router