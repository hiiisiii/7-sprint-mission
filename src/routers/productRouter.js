import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import * as productController from "../controllers/productController.js";
import { auth } from "../middlewares/auth.js";
import { authorizeProductOwner } from "../middlewares/authorize.js";

const router = express.Router();

function validateProduct(req, res, next) {
  const { name, price } = req.body;

  if (!name) return res.status(400).json({ message: "name은 필수입니다." });
  if (price === undefined) return res.status(400).json({ message: "price는 필수입니다." });

  next();
}

function validateComment(req, res, next) {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "content는 필수입니다." });
  next();
}

router.get("/", asyncHandler(productController.list));
router.post("/", auth, validateProduct, asyncHandler(productController.create));
router.get("/:id", asyncHandler(productController.detail));
router.patch("/:id", auth, authorizeProductOwner, asyncHandler(productController.update));
router.delete("/:id", auth, authorizeProductOwner, asyncHandler(productController.remove));
router.post("/:id/comments", auth, validateComment, asyncHandler(productController.createComment));
router.get("/:id/comments", asyncHandler(productController.listComments));

export default router;
