import express from "express";
import { placeOrder, getUserOrders } from "../controllers/order.controller.js";
import { protect as authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, placeOrder); 
router.get("/", authMiddleware, getUserOrders); 

export default router;