import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
	addToCart,
	getCart,
	removeFromCart,
	updateItemQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:productId", protect, removeFromCart);
// update quantity for a cart item (item._id)
router.put("/item/:itemId", protect, updateItemQuantity);

export default router;
