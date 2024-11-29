import {
  loginUserState,
  UserState,
  DateState,
  checkPage,
  pageNumState,
  subcatIdState,
  orderPageNumState,
} from "./../recoils/recoilState";
import useAxios from "./useAxios";
import { useSetRecoilState } from "recoil";
// ログアウト用フック
// ログイン中のユーザー情報を削除する関数

export default function useLogout() {
  // Recoilで管理しているログインユーザー情報を扱う関数を定義
  const setLoginUser = useSetRecoilState(loginUserState);
  const setUserState = useSetRecoilState(UserState);
  const setDateState = useSetRecoilState(DateState);
  const setCheckPage = useSetRecoilState(checkPage);
  const setPageNum = useSetRecoilState(pageNumState);
  const setSubCat = useSetRecoilState(subcatIdState);
  const setOrderPage = useSetRecoilState(orderPageNumState);

  // API通信を行うためのフック
  const axios = useAxios();
  // ログアウトするAPI
  const sendLogout = async () => {
    try {
      await axios.get("logout");
      // 処理の中でsetLoginUserを使用してRecoilの中身を空にする
      setLoginUser({});
      setUserState({});
      setDateState({});
      setCheckPage({});
      setPageNum({});
      setSubCat({});
      setOrderPage({});
      return "logout succeeded";
    } catch (error) {
      return error;
    }
  };

  return sendLogout;
}
