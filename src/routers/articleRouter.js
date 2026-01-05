// src/routers/articleRouter.js
import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import * as articleController from "../controllers/articleController.js";

const router = express.Router();

function validateArticle(req, res, next) {
  const { title, content } = req.body;

  if (!title) return res.status(400).json({ message: "title은 필수입니다." });
  if (!content) return res.status(400).json({ message: "content는 필수입니다." });

  next();
}

function validateComment(req, res, next) {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "content는 필수입니다." });
  next();
}

router.post("/", validateArticle, asyncHandler(articleController.create));
router.get("/:id", asyncHandler(articleController.detail));
router.patch("/:id", asyncHandler(articleController.update));
router.delete("/:id", asyncHandler(articleController.remove));
router.get("/", asyncHandler(articleController.list));
router.post("/:id/comments", validateComment, asyncHandler(articleController.createComment));
router.get("/:id/comments", asyncHandler(articleController.listComments));

export default router;
