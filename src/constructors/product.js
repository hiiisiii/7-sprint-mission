export class Product {
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
