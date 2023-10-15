import {Router} from "express";
import auth from "../middlewares/auth";
import validateObjectIdParam from "../middlewares/validateObjectIdParam";
import * as invoice from "../controllers/invoice"

const router = Router()

router.get("/:publicId/preview", validateObjectIdParam, invoice.previewInvoice)
router.use(auth)
router.post("/", validateObjectIdParam, invoice.createInvoice)
router.get("/", invoice.getInvoices)
router.put("/:invoiceId", invoice.updateInvoice)
router.get("/:invoiceId", validateObjectIdParam, invoice.getInvoice)
router.delete("/:invoiceId", validateObjectIdParam, invoice.deleteInvoice)
router.delete("/:invoiceId/fields/:fieldId", validateObjectIdParam, invoice.deletInvoiceField)

export default router;