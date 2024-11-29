import useAxios from "./useAxios";
import Products from "./../pages/Products";
import { useSetRecoilState } from "recoil";
import { loginUserState } from "../recoils/recoilState";

export default function useUser(action) {
  // API通信を行うためのフック
  //const setLoginUser = useSetRecoilState(loginUserState);
  const axios = useAxios();

  switch (action) {
    case "add":
      return async (CompanyData) => addUser(axios, CompanyData);
    case "Done":
      return async () => addUserDone(axios);
    case "checkDuplicate":
      return async (email, phoneNum) => checkDuplicate(axios, email, phoneNum);
    case "checkDuplicateUpdate":
      return async (email, phoneNum) =>
        checkDuplicateUpdate(axios, email, phoneNum);
    case "getById":
      return async () => getUserById(axios);
    case "update":
      return async (data) => updateUser(axios, data);
    default:
      return;
  }
}

//ユーザーの追加を行う処理
async function addUser(axios, CompanyData) {
  try {
    const res = await axios.post("/users/add", CompanyData);
    return res.data;
  } catch (error) {
    return error;
  }
}

//ユーザーのIDの表示
async function addUserDone(axios) {
  try {
    const res = await axios.get("/users/addDone");
    return res.data;
  } catch (error) {
    return error;
  }
}
//ユーザーの情報を取得する処理
async function getUserById(axios) {
  try {
    const res = await axios.get(`/users`);
    return res.data;
  } catch (error) {
    return error;
  }
}

//電話番号とメールアドレスの重複確認
async function checkDuplicate(axios, email, phoneNum) {
  try {
    const res = await axios.post("/users/checkDuplicate", { email, phoneNum });
    return res.data;
  } catch (error) {
    return error;
  }
}

//電話番号とメールアドレスの重複確認
async function checkDuplicateUpdate(axios, email, phoneNum) {
  try {
    const res = await axios.post("/users/checkDuplicateUpdate", {
      email,
      phoneNum,
    });
    return res.data;
  } catch (error) {
    return error;
  }
}
//ユーザーの情報を更新する処理
async function updateUser(axios, data) {
  try {
    const res = await axios.put(`/users/edit`, data);
    return res.data;
  } catch (error) {
    return error;
  }
}
