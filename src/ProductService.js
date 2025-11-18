import axios from "axios";
// import { Product } from "./main.js";

const Product_URL = "https://panda-market-api-crud.vercel.app/products";

/**
 * Product 리스트 조회
 * @param {Object} params - 쿼리 파라미터 { page, pageSize, keyword }
 * @returns {Promise<Object>} Product 리스트 데이터
 */

//   getProductList() : GET 메소드를 사용해 주세요.
//      page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
export async function getProductList(params = {}) {
  try {
    validateGetProductListParams(params);

    const response = await axios.get(`${BASE_URL}/products`, { params });

    console.log("Product 리스트 조회 성공:");
    console.log(`- 총 ${response.data.list.length}개의 상품을 가져왔습니다.`);

    return response.data.list.map(productFromInfo);
  } catch (error) {
    // 요청 설정 중에 오류가 발생한 경우
    console.error("❌ Product 리스트 조회 실패:", error.message);
    throw error;
  }
}

//  getProduct() : GET 메소드를 사용해 주세요.
/**
 * 특정 Product 조회
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Product 데이터
 */
export async function getProduct(productId) {
  try {
    const response = await axios.get(`${BASE_URL}/products/${productId}`);

    console.log("Product 조회 성공:");
    console.log(`- ID: ${response.data.id}, 상품명: ${response.data.name}`);

    return productFromInfo(response.data);
  } catch (error) {
    console.error(`❌ Product 조회 실패 (ID: ${productId}):`, error.message);
    throw error;
  }
}
// getProductList()를 통해서 받아온 상품 리스트를 각각 인스턴스로 만들어 products 배열에 저장해 주세요.
//  해시태그에 "전자제품"이 포함되어 있는 상품들은 Product 클래스 대신 ElectronicProduct 클래스를 사용해 인스턴스를 생성해 주세요.
//  나머지 상품들은 모두 Product 클래스를 사용해 인스턴스를 생성해 주세요.


//  createProduct() : POST 메소드를 사용해 주세요.
//      request body에 name, description, price, tags, images 를 포함해 주세요.
/**
 * Product 생성
 * @param {Product} product
 * @returns {Promise<Object>} 생성된 Product 데이터
 */
export async function createProduct(product) {
  try {
    const { name, description, price, tags, images } = product;

    const response = await axios.post(`${BASE_URL}/products`, {
      name,
      description,
      price,
      tags,
      images,
    });

    console.log("Product 생성 성공:");
    console.log(`- ID: ${response.data.id}, 상품명: ${response.data.name}`);

    return response.data;
  } catch (error) {
    console.error("❌ Product 생성 실패:", error.message);
    throw error;
  }
}

//  patchProduct() : PATCH 메소드를 사용해 주세요.
/**
 * Product 수정
 * @param {number} productId - Product ID
 * @param {Object} updateData - 수정할 데이터 (name, description, price, tags, images 중 일부 또는 전부)
 * @returns {Promise<Object>} 수정된 Product 데이터
 */
export async function patchProduct(productId, updateData) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/products/${productId}`,
      updateData
    );

    console.log("Product 수정 성공:");
    console.log(`- ID: ${response.data.id}, 상품명: ${response.data.name}`);

    return response.data;
  } catch (error) {
    console.error(`❌ Product 수정 실패 (ID: ${productId}):`, error.message);
    throw error;
  }
}


//  deleteProduct() : DELETE 메소드를 사용해 주세요.
/**
 * Product 삭제
 * @param {number} productId - Product ID
 * @returns {Promise<void>}
 */
export async function deleteProduct(productId) {
  try {
    await axios.delete(`${BASE_URL}/products/${productId}`);

    console.log("Product 삭제 성공:");
    console.log(`- ID: ${productId} 상품이 삭제되었습니다.`);

    return null;
  } catch (error) {
    console.error(`❌ Product 삭제 실패 (ID: ${productId}):`, error.message);
    throw error;
  }
}


function validatedPropertyName(availableNames, targetObject) {
  const available = new Set(availableNames);
  const propertyNames = Object.keys(targetObject);
  if (!propertyNames.every((key) => available.has(key))) {
    throw new Error(`${propertyNames} are not in ${availableNames}`);
  }
}

/**
 * GetProductsParams 데이터 검증
 * @param {Object} params - 검증할 GetProductsParams 데이터
 * @throws {Error} 검증 실패 시 에러 발생
 */
function validateGetProductListParams(params) {
  const availableParameters = ["page", "pageSize", "orderBy", "keyword"];
  validatedPropertyName(availableParameters, params);

  // 데이터 타입 검증
  if (typeof keyword !== "string") {
    throw new Error("keyword 문자열이어야 합니다.");
  }
  if (typeof page !== "number" || page < 0) {
    throw new Error("page 0 이상의 숫자여야 합니다.");
  }
  if (typeof pagesize !== "number" || pagesize < 0) {
    throw new Error("pagesize는 0 이상의 숫자여야 합니다.");
  }
}

const productFromInfo = ({ name, description, price, tags, images }) =>
  new Product(name, description, price, tags, images);




// async/await 을 이용하여 비동기 처리를 해주세요.
// try/catch 를 이용하여 오류 처리를 해주세요.

// 구현한 함수들을 아래와 같이 파일을 분리해 주세요.
//  export를 활용해 주세요.
//  ProductService.js 파일 Product API 관련 함수들을 작성해 주세요.
//  ArticleService.js 파일에 Article API 관련 함수들을 작성해 주세요.
// 이외의 코드들은 모두 main.js 파일에 작성해 주세요.
//  import를 활용해 주세요.
//  각 함수를 실행하는 코드를 작성하고, 제대로 동작하는지 확인해 주세요.