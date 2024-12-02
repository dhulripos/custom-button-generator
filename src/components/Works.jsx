import React from "react";
import {
  MDBBtn,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBCardImage,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBCarousel,
  MDBCarouselItem,
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardOverlay,
} from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import useCartApi from "../hooks/useCart";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import garbage from "../common/Images/garbage.png";
import warning from "../common/Images/warning.png";
import { UserState, checkPage, DateState } from "../recoils/recoilState";
import LoadingMotion from "./../utils/LoadingMotion";
import ImageOfCustomButtonGenerator from "../common/Images/ImageOfCustomButtonGenerator.webp";

// 小作品一覧を表示するコンポーネント
export default function Works() {
  const [inputValue, setInputValue] = useState();
  const list = [];
  const initialShowStates = list.map(() => false);
  const setUserState = useSetRecoilState(UserState);
  const setDateState = useSetRecoilState(DateState);
  const setCheckPage = useSetRecoilState(checkPage);

  const [showNoInputList, setShowNoInputList] = useState(initialShowStates);
  const [showNoInputListBelow, setShowNoInputListBelow] = useState(false);

  // Recoilにあるユーザーのidが欲しい。
  const deleteProduct = useCartApi("delete");
  const updateCartAmount = useCartApi("updateAmount");
  const navigate = useNavigate();
  const getCartList = useCartApi("cartList");
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart", {}],
    queryFn: () => getCartList(),
  });

  // listBookとlistStationeryをuseMemoでラップして初期化
  const listBook = useMemo(() => cart?.books || [], [cart?.books]);

  const listStationery = useMemo(
    () => cart?.stationery || [],
    [cart?.stationery]
  );
  const mergedList = useMemo(
    () => [...listBook, ...listStationery],
    [listBook, listStationery]
  );

  const [inputValues, setInputValues] = useState([]);

  useEffect(() => {
    setInputValues(
      mergedList?.map((item) => {
        if (item?.amount > item?.inStock - item?.allocated) {
          return "";
        } else {
          return item?.amount;
        }
      })
    );
  }, [mergedList]);

  // 削除の関数
  // userId,itemIdをもとに削除する
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (itemId) => deleteProduct(itemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cart", {}],
      });

      const { data: updatedCartItemCount } = await queryClient.fetchQuery([
        "cartItemCount",
      ]);
      queryClient.setQueryData("cartItemCount", updatedCartItemCount);
    },
  });

  // amountの更新用関数
  const updateMutation = useMutation({
    mutationFn: (cart) => updateCartAmount(cart),
  });

  // フォーム送信のイベントハンドラ
  // 上下のカチカチするやつのイベントハンドラ
  const handleUpdateAmount = (e, index, cartId) => {
    e.preventDefault();
    UpdateAmount(cartId, inputValues[index]);
  };

  const hasOutOfStockItem = mergedList?.some(
    (item) => item?.inStock - item?.allocated <= 0
  );

  // amountの数を変更するやつ
  // 上下カチカチして数量変更するやつ
  const handleInputChange = (e, index) => {
    let newValue = parseInt(e.target.value);

    if (newValue < 1) {
      newValue = 1;
    }
    if (isNaN(newValue) || !newValue) {
      setShowNoInputList((prevStates) => {
        const newState = [...prevStates];
        newState[index] = true;
        return newState;
      });
    } else {
      const item = mergedList[index]; // mergedListの該当アイテムを取得
      const inStock = item?.inStock - item?.allocated || 0; // 在庫数を取得

      if (newValue > inStock) {
        newValue = inStock;
      }
      setShowNoInputList((prevStates) => {
        const newState = [...prevStates];
        newState[index] = false;
        return newState;
      });
    }

    setInputValues((prevInputValues) => {
      const newInputValues = [...prevInputValues];
      newInputValues[index] = newValue === null ? null : newValue;
      return newInputValues;
    });
  };

  useEffect(() => {
    const anyInputValueIsNull = inputValues.some((value) => !value);
    if (!anyInputValueIsNull) {
      setShowNoInputListBelow(false);
    }
  }, [inputValues]);

  // 左にあるマイナスのマーク押すやつ
  const handleMinusChange = (e, index, cartId) => {
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      const newValue = parseInt(newValues[index]) - 1;
      newValues[index] = newValue < 1 ? 1 : newValue;
      UpdateAmount(cartId, newValues[index]);
      return newValues;
    });
  };

  // イベントハンドラを書籍と文具で分ける必要がある?
  const handlePlusChange = (e, index, cartId) => {
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      const currentValue = newValues[index];
      const parsedValue = parseInt(currentValue);
      const newValue = isNaN(parsedValue) ? 1 : parsedValue + 1;
      setShowNoInputList((prevStates) => {
        const newState = [...prevStates];
        newState[index] = false;
        return newState;
      });
      newValues[index] =
        newValue > mergedList[index].inStock - mergedList[index].allocated
          ? mergedList[index].inStock - mergedList[index].allocated
          : newValue;
      UpdateAmount(cartId, newValues[index]);
      return newValues;
    });
  };

  function UpdateAmount(cartId, newAmount) {
    const carts = { id: cartId, amount: newAmount };
    updateMutation.mutate(carts);
  }

  if (isLoading) {
    return <LoadingMotion />;
  }

  if (cart.code === "ERR_BAD_RESPONSE") {
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("selectedSubcategory");
    setUserState({});
    setDateState({});
    setCheckPage({});

    navigate("/login?param=sessionError");
    window.location.reload();
  }

  let subTotal = 0;

  for (let i = 0; i < mergedList.length; i++) {
    subTotal +=
      (mergedList[i].books?.price ?? mergedList[i].stationery?.price) *
      (inputValues[i] ? inputValues[i] : 0);
  }

  let consumption = Math.ceil(subTotal * 0.1);

  let Total = subTotal + consumption;

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && inputValues[index] < 1) {
      setInputValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[index] = "";
        return newValues;
      });
    }

    if (e.key === "-" || e.key === "+" || e.key === "." || e.key === "e") {
      e.preventDefault();
    }
  };

  const handleSubmit = () => {
    const anyInputValueIsNull = inputValues.some((value) => !value);
    if (hasOutOfStockItem) {
      return;
    }

    if (anyInputValueIsNull) {
      setShowNoInputListBelow(true);
      return;
    }

    navigate("/checkout");
  };

  // 削除のイベントハンドラ（1つ消すやつ）
  // itemIdをとってきたい
  const handleDelete = async (e) => {
    e.preventDefault();
    const itemId = e.target.dataset.itemId;
    deleteMutation.mutate(itemId);
  };

  const handleWorkById = (e) => {
    e.preventDefault();
    navigate("/works/custom-button-generator");
  };

  return (
    <section className="h-100 h-custom">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol>
            <h3
              className="text-center mb-4 fw-bold"
              style={{ fontFamily: "cursive", fontSize: "45px" }}
            >
              〜 My Collection of works 〜
            </h3>
            <h4
              className="text-center"
              style={{ fontFamily: "cursive", fontSize: "30px" }}
            >
              Recommended works
            </h4>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol>
            <MDBCarousel showControls showIndicators interval={3500}>
              {/* MDBCarouselItemにstyle={{minHeight:"400px"}}をつけないと要素が小さすぎで表示されない */}
              {/* Recommended worksのアルゴリズムをバックエンドで考える必要あり！ */}
              <MDBCarouselItem itemId={1} style={{ minHeight: "400px" }}>
                <img
                  src="https://mdbootstrap.com/img/new/slides/041.jpg"
                  className="d-block w-100"
                  alt="..."
                />
              </MDBCarouselItem>
              <MDBCarouselItem itemId={2} style={{ minHeight: "400px" }}>
                <img
                  src="https://mdbootstrap.com/img/new/slides/042.jpg"
                  className="d-block w-100"
                  alt="..."
                />
              </MDBCarouselItem>
              <MDBCarouselItem itemId={3} style={{ minHeight: "400px" }}>
                <img
                  src="https://mdbootstrap.com/img/new/slides/043.jpg"
                  className="d-block w-100"
                  alt="..."
                />
              </MDBCarouselItem>
            </MDBCarousel>
          </MDBCol>
        </MDBRow>

        <MDBRow className="my-5">
          <MDBCol>
            <h3
              className="text-center border-bottom border-4 mb-3"
              style={{
                fontSize: "45px",
                fontFamily: "cursive",
              }}
            >
              Backend works
            </h3>
            <MDBCard background="dark" className="text-white my-3">
              <MDBCardImage
                overlay
                src="https://mdbootstrap.com/img/new/slides/017.webp"
                alt="..."
              />
              <MDBCardOverlay>
                <MDBCardTitle>Card title</MDBCardTitle>
                <MDBCardText>
                  This is a wider card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </MDBCardText>
                <MDBCardText>Last updated 3 mins ago</MDBCardText>
              </MDBCardOverlay>
            </MDBCard>
            <MDBCard background="dark" className="text-white my-3">
              <MDBCardImage
                overlay
                src="https://mdbootstrap.com/img/new/slides/017.webp"
                alt="..."
              />
              <MDBCardOverlay>
                <MDBCardTitle>Card title</MDBCardTitle>
                <MDBCardText>
                  This is a wider card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </MDBCardText>
                <MDBCardText>Last updated 3 mins ago</MDBCardText>
              </MDBCardOverlay>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        <h3
          className="text-center border-bottom border-4 mb-3"
          style={{
            fontSize: "45px",
            fontFamily: "cursive",
          }}
        >
          Frontend works
        </h3>

        <MDBRow className="row-cols-1 row-cols-md-2 g-4 mb-5">
          <MDBCol>
            <MDBCard onClick={handleWorkById} style={{ cursor: "pointer" }}>
              <MDBCardImage
                src={ImageOfCustomButtonGenerator}
                alt="ImageOfCustomButtonGenerator"
                height={425}
                position="top"
              />
              <MDBCardBody>
                <MDBCardTitle>Custom Button Generator</MDBCardTitle>
                <MDBCardText>
                  You can create your own custom buttons and use them on your
                  website!
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol>
            <MDBCard>
              <MDBCardImage
                src="https://mdbootstrap.com/img/new/standard/city/042.webp"
                alt="..."
                position="top"
              />
              <MDBCardBody>
                <MDBCardTitle>Card title</MDBCardTitle>
                <MDBCardText>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol>
            <MDBCard>
              <MDBCardImage
                src="https://mdbootstrap.com/img/new/standard/city/043.webp"
                alt="..."
                position="top"
              />
              <MDBCardBody>
                <MDBCardTitle>Card title</MDBCardTitle>
                <MDBCardText>shortest</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol>
            <MDBCard>
              <MDBCardImage
                src="https://mdbootstrap.com/img/new/standard/city/044.webp"
                alt="..."
                position="top"
              />
              <MDBCardBody>
                <MDBCardTitle>Card title</MDBCardTitle>
                <MDBCardText>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol>
            <MDBCard>
              <MDBCardImage
                src="https://mdbootstrap.com/img/new/standard/city/044.webp"
                alt="..."
                position="top"
              />
              <MDBCardBody>
                <MDBCardTitle>Card title</MDBCardTitle>
                <MDBCardText>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
