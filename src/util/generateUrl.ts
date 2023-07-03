import dotenv from "dotenv";
import { randomUUID } from "crypto";
dotenv.config()
export default () =>((process.env.APP_UI_URL || "https://test_ui_url") + "/" + Math.floor(Math.random() * 10000) + randomUUID().replace(/[\-]/g, "."))
