import { prisma } from "../../prisma/prisma.js";

// 좋아요
export const likeProduct = async ({ userId, productId }) => {
  try {
    await prisma.productLike.create({
      data: {
        user_id: userId,
        product_id: productId,
      },
    });
  } catch (err) {
    if (err?.code === "P2002") return;
    if (err?.code === "P2003") return;

    throw err;
  }
};

// 좋아요 취소
export const unlikeProduct = async ({ userId, productId }) => {
  await prisma.productLike.deleteMany({
    where: {
      user_id: userId,
      product_id: productId,
    },
  });
};
