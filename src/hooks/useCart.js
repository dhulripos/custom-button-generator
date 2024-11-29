import useAxios from "./useAxios";

export default function useCartApi(action) {
  const axios = useAxios();
  switch (action) {
    case "count":
      return async (cart) => countCart(axios, cart);
    case "add":
      return async (data) => addItem(axios, data);
    case "allDelete":
      return async (userId) => deleteCart(axios, userId);
    case "cartList":
      return async () => getCartList(axios);
    case "updateAmount":
      return async (cart) => updateCartAmount(axios, cart);
    case "delete":
      return async (itemId) => deleteProduct(axios, itemId);

    default:
      return;
  }
}

async function countCart(axios) {
  try {
    const res = await axios.get("/cart/count");
    return res.data;
  } catch (error) {
    return error;
  }
}

async function getCartList(axios) {
  try {
    const res = await axios.get("/cart");
    return res.data;
  } catch (error) {
    return error;
  }
}

async function updateCartAmount(axios, cart) {
  try {
    const res = await axios.put("/cart/update/amount", cart);
    return res.data;
  } catch (error) {
    return error;
  }
}

//カート内の情報消去単体
async function deleteProduct(axios, ItemId) {
  try {
    const res = await axios.delete(`/cart/delete/${ItemId}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

//カート内に商品追加
async function addItem(axios, data) {
  try {
    const res = await axios.post("/cart/add", data);
    return res.data;
  } catch (error) {
    return error;
  }
}

//カート内の情報消去(購入時)
async function deleteCart(axios, userId) {
  try {
    const res = await axios.delete(`/cart/${userId}`);
    return res.data;
  } catch (error) {
    return error;
  }
}

//カート内の情報消去(購入時)
async function getServerStatus(axios) {
  try {
    const res = await axios.get("/server-status");
    return res.data;
  } catch (error) {
    return error;
  }
}
