import useAxios from "./useAxios";

export default function useUser(action) {
  // API通信を行うためのフック
  const axios = useAxios();

  switch (action) {
    case "prefectureAll":
      return async () => getPrefecture(axios);
    default:
      return;
  }
}

//ユーザーの情報を取得する処理
async function getPrefecture(axios) {
  try {
    const res = await axios.get(`/prefecture`);
    return res.data;
  } catch (error) {
    return error;
  }
}
