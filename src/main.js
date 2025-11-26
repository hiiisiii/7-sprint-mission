// 이외의 코드들은 모두 main.js 파일에 작성해 주세요.
//  import를 활용해 주세요.
import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ArticleService.js";

import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./ProductService.js";

main().catch((error) => {
  console.error("테스트 중 에러 발생:", error);
});

// class 키워드를 이용해서 Product 클래스와 ElectronicProduct 클래스를 만들어 주세요.
class Product {
    #favoriteCount;  
    //private 필드로 캡슐화

    constructor(name, description, price, tags = [], images = []) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = tags;
        this.images = images;
        this.#favoriteCount = 0;
    }
         // Product 클래스는 name(상품명) description(상품 설명), price(판매 가격), 
         // tags(해시태그 배열), images(이미지 배열), favoriteCount(찜하기 수)프로퍼티를 가집니다.


    // Product 클래스는 favorite 메소드를 가집니다. favorite 메소드가 호출될 경우 찜하기 수가 1 증가합니다.
    favorite() {
        this.#favoriteCount++;   
        //this필요 this가 likecount가르킴   
    }
                 
    get favoriteCount() {
        return this.#favoriteCount;
    }
}

// ElectronicProduct 클래스는 Product를 상속하며, 추가로 manufacturer(제조사) 프로퍼티를 가집니다.
class ElectronicProduct extends Product {
    constructor(name, description, price, tags = [], images = [], manufacturer) {
        super(name, description, price, tags, images);
        this.manufacturer = manufacturer;
    }

    // 다형성: 부모 클래스의 메소드를 오버라이드할 수있음
    favorite() {
        super.favorite();
        console.log(`${this.manufacture}의 ${this.name} 제품이 찜되었습니다.`);
    }
}

// class 키워드를 이용해서 Article 클래스를 만들어 주세요.
//  Article 클래스는 title(제목), content(내용), writer(작성자), likeCount(좋아요 수) 프로퍼티를 가집니다.
class Article {
    #likeCount; //private 필드로 캡슐화
    #createdAt; //private 필드로 캡슐화
    // Article 클래스에 createdAt(생성일자) 프로퍼티를 만들어 주세요.
    //  새로운 객체가 생성되어 constructor가 호출될 시 createdAt에 현재 시간을 저장합니다.

    constructor(title, content, writer) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.#likeCount = 0;
        this.#createdAt = new Date();   
    }
    
    //  Article 클래스는 like 메소드를 가집니다. like 메소드가 호출될 경우 좋아요 수가 1 증가합니다.
    like() {
        this.#likeCount++;
    }

    get likeCount() {
        // getter
        return this.#likeCount;
    }
}

//   추상화/캡슐화/상속/다형성을 고려하여 코드를 작성해 주세요.


/**
 * Product 데이터 검증
 * @param {Object} productData - 검증할 Product 데이터
 * @throws {Error} 검증 실패 시 에러 발생
 */
function validateProduct(name, description, price, tags, images) {
  // 필수 필드 존재 여부 확인
  const missingFields = [];
  if (name === undefined) missingFields.push("name");
  if (description === undefined) missingFields.push("description");
  if (price === undefined || price === null) missingFields.push("price");
  if (!tags) missingFields.push("tags");
  if (!images) missingFields.push("images");

  if (missingFields.length > 0) {
    throw new Error(`필수 필드가 누락되었습니다: ${missingFields.join(", ")}`);
  }

  // 데이터 타입 검증
  if (typeof name !== "string") {
    throw new Error("name은 문자열이어야 합니다.");
  }
  if (typeof description !== "string") {
    throw new Error("description은 문자열이어야 합니다.");
  }
  if (typeof price !== "number" || price < 0) {
    throw new Error("price는 0 이상의 숫자여야 합니다.");
  }
  if (!Array.isArray(tags)) {
    throw new Error("tags는 배열이어야 합니다.");
  }
  if (!Array.isArray(images)) {
    throw new Error("images는 배열이어야 합니다.");
  }
}

//  각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인해 주세요.
async function main() {
  console.log(" Article 리스트 ");
  const articles = await getArticleList(1, 5, "");
  console.log(articles);

  if (articles.length > 0) {
    console.log("Article 상세");
    const firstId = articles[0].id;
    const article = await getArticle(firstId);
    console.log(article);
  }

  console.log("Article 생성");
  const created = await createArticle({
    title: "테스트 제목",
    content: "테스트 내용입니다",
    image: "https://example.com/test.png",
  });
  console.log(created);

console.log("Product 리스트");
const products = await getProductList({
  page: 1,
  pageSize: 5,
  keyword: "",
});
console.log(products);

// Product / ElectronicProduct 인스턴스 배열
const productInstances = products.map((p) => {
  const isElectronic = Array.isArray(p.tags) && p.tags.includes("전자제품");

  if (isElectronic) {
    // ElectronicProduct: Product를 상속 + manufacturer 추가
    return new ElectronicProduct(
      p.name,
      p.description,
      p.price,
      p.tags,
      p.images,
      
    );
  }

  // 일반 상품은 Product 인스턴스
  return new Product(p.name, p.description, p.price, p.tags, p.images);
});

console.log("인스턴스 배열");
console.log(productInstances.slice(0, 2));

  if (products.length > 0) {
    console.log("Product 상세");
    const firstProductId = products[0].id;
    const product = await getProduct(firstProductId);
    console.log(product);
  }
}