// routes/comment.route.js
import express from "express";
import { prisma } from "../prisma/prisma.js";

const router = express.Router();

class Comment {
  constructor(id, content, createdAt, productId, articleId) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    if (productId) this.productId = productId;
    if (articleId) this.articleId = articleId;
  }

  static fromEntity(entity) {
    return new Comment(
      entity.id.toString(),
      entity.content,
      entity.created_at,
      entity.product_id?.toString(),
      entity.article_id?.toString()
    );
  }
}

// 댓글 수정 PATCH /api/comments/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const commentId = BigInt(req.params.id);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "content는 필수입니다." });
    }

    const exists = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!exists) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.json(Comment.fromEntity(updated));
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 댓글 삭제 DELETE /api/comments/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const commentId = BigInt(req.params.id);

    const exists = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!exists) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.status(204).send();
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default router;
