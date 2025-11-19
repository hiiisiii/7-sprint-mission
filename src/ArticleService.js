//  ArticleService.js 파일에 Article API 관련 함수들을 작성해 주세요.
import axios from "axios";
// fetch 혹은 axios를 이용해 주세요.

// https://panda-market-api-crud.vercel.app/docs 의 Article API를 이용하여 아래 함수들을 구현해 주세요.
const Article_URL = "https://panda-market-api-crud.vercel.app/articles";

//  응답의 상태 코드가 2XX가 아닐 경우, 에러 메시지를 콘솔에 출력해 주세요.
const logAndThrow = (error) => {
  console.error("Error fetching article list:", error);
  throw error;
};

//  getArticleList() : GET 메소드를 사용해 주세요.
//      page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
export function getArticleList(page = 1, pageSize = 10, keyword = "") {
  return axios
    .get("https://panda-market-api-crud.vercel.app/articles", { params: { page, pageSize, keyword } })
    .then((response) => response.data.list.map(articleFromInfo))
    .catch(logAndThrow);
}

//  getArticle() : GET 메소드를 사용해 주세요.
export function getArticle(articleId) {
  return axios
    .get(`https://panda-market-api-crud.vercel.app/articles/${articleId}`)
    .then((response) => articleFromInfo(response.data))
    .catch(logAndThrow);
}

const articleFromInfo = ({ id, title, content, image, createdAt }) => ({
  id,
  title,
  content,
  image,
  createdAt,
});

//  createArticle() : POST 메소드를 사용해 주세요.
//    request body에 title, content, image 를 포함해 주세요.
export function createArticle(article) {
  return axios
    .post("https://panda-market-api-crud.vercel.app/articles", article)
    .then((response) => response.data)
    .catch(logAndThrow);
}

//  patchArticle() : PATCH 메소드를 사용해 주세요.
export function patchArticle(articleId, patch) {
  return axios
    .patch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`, patch)
    .catch(logAndThrow);
}

//  deleteArticle() : DELETE 메소드를 사용해 주세요.
export function deleteArticle(articleId) {
  return axios
    .delete(`https://panda-market-api-crud.vercel.app/articles/${articleId}`)
    .then(({ id }) => id)
    .catch(logAndThrow);
}

// .then() 메소드를 이용하여 비동기 처리를 해주세요.
// .catch() 를 이용하여 오류 처리를 해주세요.