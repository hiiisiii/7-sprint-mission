// routes/product.js
import express from "express";
import { prisma } from "../prisma/prisma.js";
import { ProductComment } from "../comment.js";

const router = express.Router();

class Product {
  constructor(id, name, description, price, tags, createdAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new Product(
      entity.id.toString(),
      entity.name,
      entity.description,
      entity.price,
      entity.tags,
      entity.created_at
    );
  }
}

function validateProduct(req, res, next) {
  const { name, price } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name은 필수입니다." });
  }

  if (price === undefined) {
    return res.status(400).json({ message: "price는 필수입니다." });
  }

  next();
}

// 상품 등록 POST /api/products
// name, description, price, tags
router.post("/", validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;

    const entity = await prisma.product.create({
      data: { name, description, price, tags },
    });

    res.status(201).json(Product.fromEntity(entity));
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 상품 상세 조회 GET /api/products/:id
// id, name, description, price, tags, createdAt
router.get("/:id", async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);

    const entity = await prisma.product.findUnique({
      where: { id },
    });

    if (!entity) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.json(Product.fromEntity(entity));
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 상품 수정 PATCH /api/products/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);

    const exists = await prisma.product.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    res.json(Product.fromEntity(updated));
  } catch (e) {
    console.error(e);

    next(e);
  }
});

// 상품 삭제 DELETE /api/products/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = BigInt(req.params.id);

    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 상품 목록 조회 GET /api/products
// offset /최신순 /name, description 검색
router.get("/", async (req, res, next) => {
  try {
    const { limit, offset, sort, search } = req.query;

    const take = limit ? parseInt(limit, 10) : 3;
    const skip = offset ? parseInt(offset, 10) : 0;

    const findOption = {
      skip,
      take,
    };

    if (sort === "recent") {
      findOption.orderBy = { created_at: "desc" };
    }

    if (search) {
      findOption.where = {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      };
    }

    const entities = await prisma.product.findMany(findOption);
    const products = entities.map(Product.fromEntity);

    res.json(products);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 상품 댓글 등록 POST /api/products/:id/comments
router.post("/:id/comments", async (req, res, next) => {
  try {
    const productId = BigInt(req.params.id);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "content는 필수입니다." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        product_id: productId,
      },
    });

    res.status(201).json({
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.created_at,
      productId: comment.product_id?.toString(),
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// 상품 댓글 목록 조회 (Cursor)
// GET /api/products/:id/
router.get("/:id/comments", async (req, res, next) => {
  try {
    const productId = BigInt(req.params.id);
    const { limit, cursorId } = req.query;

    const take = limit ? parseInt(limit, 10) : 5;

    const where = { product_id: productId };
    const orderBy = { id: "desc" };

    const query = {
      where,
      orderBy,
      take,
    };

    if (cursorId) {
      const cursor = BigInt(cursorId);
      query.cursor = { id: cursor };
      query.skip = 1; //
    }

    const entities = await prisma.comment.findMany(query);

    const comments = entities.map((entity) => ({
      id: entity.id.toString(),
      content: entity.content,
      createdAt: entity.created_at,
      productId: entity.product_id?.toString(),
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
