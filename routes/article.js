import express from "express";
import { prisma } from "../prisma/prisma.js";
const router = express.Router();

class Article {
  constructor(id, title, content, createdAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new Article(
      entity.id.toString(),
      entity.title,
      entity.content,
      entity.created_at
    );
  }
}

function validateArticle(req, res, next) {
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({ message: "title은 필수입니다." });
  }

  if (!content) {
    return res.status(400).json({ message: "content는 필수입니다." });
  }

  next();
}

// 게시글 등록 POST /api/articles
router.post("/", validateArticle, async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const entity = await prisma.article.create({
      data: { title, content },
    });

    res.status(201).json(Article.fromEntity(entity));
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 게시글 상세 조회 GET /api/articles/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);

    const entity = await prisma.article.findUnique({
      where: { id },
    });

    if (!entity) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    res.json(Article.fromEntity(entity));
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 게시글 수정 PATCH /api/articles/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);

    const updated = await prisma.article.update({
      where: { id },
      data: req.body,
    });

    res.json(Article.fromEntity(updated));
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 게시글 삭제 DELETE /api/articles/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);

    await prisma.article.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 게시글 목록 조회 GET /api/articles
// offset / 최신순 / title, content 검색
router.get("/", async (req, res, next) => {
  try {
    const { limit, offset, sort, search, keyword } = req.query;

    const searchValue = search ?? keyword;

    const take = limit ? parseInt(limit, 10) : 10;
    const skip = offset ? parseInt(offset, 10) : 0;

    const findOption = {
      skip,
      take,
    };

    if (sort === "recent") {
      findOption.orderBy = { created_at: "desc" };
    } else {
      findOption.orderBy = { created_at: "desc" };
    }

    if (searchValue) {
      findOption.where = {
        OR: [
          { title: { contains: searchValue } },
          { content: { contains: searchValue } },
        ],
      };
    }

    const entities = await prisma.article.findMany(findOption);
    const articles = entities.map(Article.fromEntity);

    res.json(articles);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 게시글 댓글 등록 POST /api/articles/:id/comments
router.post("/:id/comments", async (req, res, next) => {
  try {
    const articleId = BigInt(req.params.id);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "content는 필수입니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        article_id: articleId,
      },
    });

    res.status(201).json({
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.created_at,
      articleId: comment.article_id?.toString(),
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 게시글 댓글 목록 조회 (Cursor)
// GET /api/articles/:id/comments
router.get("/:id/comments", async (req, res, next) => {
  try {
    const articleId = BigInt(req.params.id);
    const { limit, cursorId } = req.query;

    const take = limit ? parseInt(limit, 10) : 10;

    const where = { article_id: articleId };
    const orderBy = { id: "desc" };

    const query = {
      where,
      orderBy,
      take,
    };

    if (cursorId) {
      const cursor = BigInt(cursorId);
      query.cursor = { id: cursor };
      query.skip = 1;
    }

    const entities = await prisma.comment.findMany(query);

    const comments = entities.map((entity) => ({
      id: entity.id.toString(),
      content: entity.content,
      createdAt: entity.created_at,
      articleId: entity.article_id?.toString(),
    }));

    const last = entities[entities.length - 1];
    const nextCursorId = last ? last.id.toString() : null;

    res.json({
      items: comments,
      nextCursorId,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default router;
