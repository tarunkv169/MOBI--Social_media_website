import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"; // .js is must in import
import { getMessage, sendMessage } from "../controllers/message.controller.js";
const router = express.Router();

// we use id at back---let examine whatapp sending message 1. we choose forward/send---i.why--/send  2. then we choose whom to forward/send --i.why--/:id
router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/all/:id").get(isAuthenticated,getMessage);

export default router;