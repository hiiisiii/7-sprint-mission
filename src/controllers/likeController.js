import * as likeService from "../services/likeService.js";

// 좋아요
export const likeProduct = async (req, res) => {
  const productId = BigInt(req.params.id);
  const userId = req.user.id;

  await likeService.likeProduct({ userId, productId });

  res.status(204).send();
};

// 좋아요 취소
export const unlikeProduct = async (req, res) => {
  const productId = BigInt(req.params.id);
  const userId = req.user.id;

  await likeService.unlikeProduct({ userId, productId });

  res.status(204).send();
};
