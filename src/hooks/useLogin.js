import useAxios from "../hooks/useAxios";
import { useSetRecoilState } from "recoil";
import {
  loginUserState,
  pageNumState,
  subcatIdState,
  orderPageNumState,
} from "../recoils/recoilState";

export default function useLogin() {
  const setPageNum = useSetRecoilState(pageNumState);
  const setSubCat = useSetRecoilState(subcatIdState);
  const setOrderPage = useSetRecoilState(orderPageNumState);

  const setLoginUser = useSetRecoilState(loginUserState);
  const axios = useAxios();

  const sendCredentials = async (id, pass) => {
    try {
      //ログイン用エンドポイント
      //   const apiUrl = ax + "/login";
      //ログイン情報送信
      const res = await axios.post("/login", { id, pass });

      setPageNum(1);
      setSubCat("101");
      setOrderPage(1);

      //ユーザーデータの保存
      setLoginUser(res.data);
      return "login succeeded";
    } catch (error) {
      return error;
    }
  };
  return sendCredentials;
}
