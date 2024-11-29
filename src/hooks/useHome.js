import useAxios from "./useAxios";
export default function useCartApi(action) {
  const axios = useAxios();

  switch (action) {
    case "getRecProducts":
      return async () => getRecProducts(axios);
    case "serverStatus":
      return async () => getServerStatus(axios);
    case "sessionStatus":
      return async () => getSessionStatus(axios);
    default:
      return;
  }
}
export async function getRecProducts(axios) {
  try {
    const res = await axios.get("/home");
    return res.data;
  } catch (error) {
    return error;
  }
}

//サーバステータスを確認
async function getServerStatus(axios) {
  try {
    const res = await axios.get("/server-check");
    return res.data;
  } catch (error) {
    return error;
  }
}

//セッションステータスを確認
async function getSessionStatus(axios) {
  try {
    const res = await axios.get("/session-check");
    return res.data;
  } catch (error) {
    return error;
  }
}
