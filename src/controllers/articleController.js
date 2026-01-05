import * as articleService from "../services/ArticleService.js";
import { Article } from "../constructors/article.js";
import { Comment } from "../constructors/comment.js";

export const create = async (req, res) => {
  const { title, content } = req.body;

  const entity = await articleService.createArticle({ title, content });
  res.status(201).json(Article.fromEntity(entity));
};

export const detail = async (req, res) => {
  const id = BigInt(req.params.id);

  const entity = await articleService.getArticleById(id);
  if (!entity) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  res.json(Article.fromEntity(entity));
};

export const update = async (req, res) => {
  const id = BigInt(req.params.id);

  const exists = await articleService.getArticleById(id);
  if (!exists) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  const updated = await articleService.updateArticle(id, req.body);
  res.json(Article.fromEntity(updated));
};

export const remove = async (req, res) => {
  const id = BigInt(req.params.id);

  const exists = await articleService.getArticleById(id);
  if (!exists) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  await articleService.deleteArticle(id);
  res.status(204).send();
};

export const list = async (req, res) => {
  const entities = await articleService.listArticles(req.query);
  res.json(entities.map(Article.fromEntity));
};

export const createComment = async (req, res) => {
  const articleId = BigInt(req.params.id);
  const { content } = req.body;

  const article = await articleService.getArticleById(articleId);
  if (!article) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  const commentEntity = await articleService.createArticleComment({ articleId, content });
  res.status(201).json(Comment.fromEntity(commentEntity));
};

export const listComments = async (req, res) => {
  const articleId = BigInt(req.params.id);
  const { limit, cursorId } = req.query;

  const { entities, nextCursorId } = await articleService.listArticleCommentsCursor({
    articleId,
    limit,
    cursorId,
  });

  res.json({
    items: entities.map(Comment.fromEntity),
    nextCursorId,
  });
};
