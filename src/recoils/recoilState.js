import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// CustomButtonGenerator.jsxのステート管理をするアトム
// effects_UNSTABLE: [persistAtom]は、ローカルストレージに保存するということ。
// つまりタブを閉じても大丈夫。何もしなくてもユーザーごとに分離されているため、ユーザーIDなどで開発者が意図的に識別しなくても大丈夫
// 同じPCでもFirefoxやEdgeなどの異なるブラウザとは共有されない。ブラウザごとにローカルストレージがある
export const customButtonGeneratorRecoilState = atom({
  key: "customButtonGeneratorRecoilState",
  default: {
    buttonColor: "#0400ff",
    buttonText: "SampleButton",
    buttonTextColor: "#ffffff",
    clickEffect: "changeScale",
    hoverState: "Underline",
    kindsOfButton: "BUTTON",
    shadow: "70%",
    underlineColor: "#ff0000",
  },
  effects_UNSTABLE: [persistAtom],
});

//アトムはログイン状態を管理する
export const loginUserState = atom({
  key: "loginUserState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

//アトムはユーザーの登録状態を管理する
export const UserState = atom({
  key: "UserState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const checkPage = atom({
  key: "checkPage",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

//アトムは日時日付の登録状態を管理する
export const DateState = atom({
  key: "DateState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// カテゴリ一覧のページ数を管理する
export const pageNumState = atom({
  key: "pageNumState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// サブカテゴリIDを管理する
export const subcatIdState = atom({
  key: "subcatIdState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// 注文履歴のページ数を管理する
export const orderPageNumState = atom({
  key: "orderPageNumState",
  default: 1,
  effects_UNSTABLE: [persistAtom],
});
