import useAxios from "./useAxios";

export default function useOrder(action) {
  const axios = useAxios();

  switch (action) {
    case "getHistory":
      return async (page) => getHistories(page, axios);
    case "getOrderById":
      return async (userId) => getHistories(axios, userId);
    case "getDetails":
      return async (orderId) => getDetails(axios, orderId);
    case "getcaLis":
      return async (orderId) => getcaLis(axios, orderId);
    case "cancel":
      return async (doubleId) => cancelOrder(axios, doubleId);
    case "getUser":
      return async () => getUser(axios);
    case "getCart":
      return async () => getCart(axios);
    case "add":
      return async (order) => addOrder(axios, order);
    case "completion":
      return async () => getCompletion(axios);

    default:
      return;
  }
}
async function getHistories(page, axios) {
  try {
    const res = await axios.get(`/order/history?page=${page}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

//注文詳細の取得
async function getcaLis(axios, orderId) {
  try {
    const res = await axios.get(`/order/caLis/${orderId}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

//注文詳細の取得
async function getDetails(axios, orderId) {
  try {
    const res = await axios.get(`/order/detail/${orderId}`);
    return res.data;
  } catch (error) {
    return error;
  }
}
//注文キャンセルの処理
async function cancelOrder(axios, doubleId) {
  //{...処理}
  try {
    const res = await axios.put("order/cancel", doubleId);
    return res.data;
  } catch (error) {
    return null;
  }
}

async function getUser(axios) {
  try {
    const res = await axios.get("order/user");
    return res.data;
  } catch (error) {
    return error;
  }
}

async function getCart(axios) {
  try {
    const res = await axios.get("order/confirm");
    return res.data;
  } catch (error) {
    return error;
  }
}

async function addOrder(axios, order) {
  try {
    const res = await axios.post("/order/add", order);
    return res.data;
  } catch (error) {
    return error;
  }
}

async function getCompletion(axios) {
  try {
    const res = await axios.get("/order/completion");
    return res.data;
  } catch (error) {
    return error;
  }
}
