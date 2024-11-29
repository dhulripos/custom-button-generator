import useAxios from "./useAxios";
export default function useProducts(action) {
  const axios = useAxios();
  switch (action) {
    case "getProductById":
      return async (id) => getProductById(axios, id);
    case "getAllStationery":
      return async (id, page) => getAllStationery(id, page, axios);
    case "getAllBooks":
      return async (id, page) => getAllBooks(id, page, axios);
    case "getDetailStationery":
      return async (id) => getDetailStationery(id, axios);
    case "getDetailBooks":
      return async (id) => getDetailBooks(id, axios);
    default:
      return;
  }

  async function getProductById(axios, id) {
    try {
      const res = await axios.get(`/product/details/${id}`);
      return res.data;
    } catch (error) {
      return error;
    }
  }

  async function getAllStationery(id, page, axios) {
    try {
      const res = await axios.get(`products/stationery/${id}?page=${page}`);
      // レスポンスデータの処理
      return res.data;
    } catch (error) {
      // エラーハンドリング
      console.error(error);
      return error;
    }
  }

  async function getAllBooks(id, page, axios) {
    try {
      const res = await axios.get(`products/books/${id}?page=${page}`);
      // レスポンスデータの処理
      return res.data;
    } catch (error) {
      // エラーハンドリング
      console.error(error);
      return error;
    }
  }

  async function getDetailStationery(axios, id) {}

  async function getDetailBooks(axios, id) {}
}
