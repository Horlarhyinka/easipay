import { Router } from "express";
import auth from "../middlewares/auth"
import * as order from "../controllers/order";
import validateObjectIdParam from "../middlewares/validateObjectIdParam"

const router = Router()

router.get("/:orderId/preview", validateObjectIdParam, order.getOrder)
router.use(auth)
router.post("/", order.createOrder)
router.get("/", order.getOrders)
router.put("/:orderId", validateObjectIdParam, order.updateOrder)
router.get("/:orderId",validateObjectIdParam, order.getOrder)
router.put("/:orderId/items/:itemId", validateObjectIdParam, order.updateOrderItem )
router.get("/:orderId/items/:itemId", validateObjectIdParam, order.getOrderItem )

export default router;