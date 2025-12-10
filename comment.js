// comment.js
export class ArticleComment {
  constructor(id, content, createdAt, articleId) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.articleId = articleId;
  }

  static fromEntity(entity) {
    return new ArticleComment(
      entity.id.toString(),
      entity.content,
      entity.created_at,
      entity.article_id?.toString() ?? null
    );
  }
}

export class ProductComment {
  constructor(id, content, createdAt, productId) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.productId = productId;
  }

  static fromEntity(entity) {
    return new ProductComment(
      entity.id.toString(),
      entity.content,
      entity.created_at,
      entity.product_id?.toString() ?? null
    );
  }
}
