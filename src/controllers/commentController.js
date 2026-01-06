import * as commentService from "../services/commentService.js";
import { Comment } from "../constructors/comment.js";
import { HttpError } from "../../errors/customErrors.js";

export const update = async (req, res) => {
  const id = BigInt(req.params.id);
  const { content } = req.body;

  if (!content) {
    throw new HttpError("content는 필수입니다.", 400);
  }

  const exists = await commentService.getCommentById(id);
  if (!exists) {
    throw new HttpError("댓글을 찾을 수 없습니다.", 404);
  }

  const updated = await commentService.updateComment(id, { content });
  res.json(Comment.fromEntity(updated));
};

export const remove = async (req, res) => {
  const id = BigInt(req.params.id);

  const exists = await commentService.getCommentById(id);
  if (!exists) {
    throw new HttpError("댓글을 찾을 수 없습니다.", 404);
  }

  await commentService.deleteComment(id);
  res.status(204).send();
};
