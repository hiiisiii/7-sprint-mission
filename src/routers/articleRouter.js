import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import * as articleController from "../controllers/articleController.js";
import { auth } from "../middlewares/auth.js";
import { authorizeArticleOwner } from "../middlewares/authorize.js";

const router = express.Router();

function validateArticle(req, res, next) {
  const { title, content } = req.body;

  if (!title) return res.status(400).json({ message: "게시글 제목을 입력해 주세요." });
  if (!content) return res.status(400).json({ message: "게시글 내용을 입력해 주세요." });

  next();
}

router.post("/", auth, validateArticle, asyncHandler(articleController.create));
router.get("/:id", asyncHandler(articleController.detail));
router.patch("/:id", auth, authorizeArticleOwner, asyncHandler(articleController.update));
router.delete("/:id", auth, authorizeArticleOwner, asyncHandler(articleController.remove));
router.get("/", asyncHandler(articleController.list));
router.post("/:id/comments", auth, asyncHandler(articleController.createComment));
router.get("/:id/comments", asyncHandler(articleController.listComments));

export default router;
