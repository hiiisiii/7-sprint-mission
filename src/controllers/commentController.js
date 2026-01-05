import * as commentService from "../services/commentService.js";
import { Comment } from "../constructors/comment.js";

export const update = async (req, res) => {
  const id = BigInt(req.params.id);
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "content는 필수입니다." });
  }

  const exists = await commentService.getCommentById(id);
  if (!exists) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }

  const updated = await commentService.updateComment(id, { content });
  res.json(Comment.fromEntity(updated));
};

export const remove = async (req, res) => {
  const id = BigInt(req.params.id);

  const exists = await commentService.getCommentById(id);
  if (!exists) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }

  await commentService.deleteComment(id);
  res.status(204).send();
};
