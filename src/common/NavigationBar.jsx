/* eslint-disable jsx-a11y/anchor-is-valid */
import LoadingMotion from "../utils/LoadingMotion";
import { useNavigate, Link } from "react-router-dom";
import "./Images/style.css";
import { isAxiosError } from "axios";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
} from "mdb-react-ui-kit";

export default function NavigationBar() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/works");
  };

  return (
    <div className="sticky-top">
      <MDBNavbar expand="lg" light bgColor="light">
        <MDBContainer fluid>
          <MDBNavbarBrand onClick={goHome}>
            <span
              alt="Logo"
              height="50"
              style={{
                width: "80px",
                cursor: "pointer",
                fontSize: "25px",
                fontFamily: "cursive",
                fontWeight: "bold",
                userSelect: "none",
              }}
            >
              dhulripos Portfolio
            </span>
          </MDBNavbarBrand>

          <MDBCollapse navbar className="ms-5">
            <MDBNavbarNav
              className="ml-auto d-flex align-items-center"
              style={{ marginLeft: "80px" }}
            >
              <MDBNavbarBrand className="m-auto align-items-center">
                <Link
                  to="https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8"
                  target="blank"
                  className="text-black"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "cursive",
                      fontSize: "20px",
                      fontWeight: "bold",
                      userSelect: "none",
                      cursor: "pointer",
                      position: "relative",
                      display: "inline-block",
                    }}
                    className="nav-hover-bg"
                  >
                    About me
                  </span>
                </Link>
              </MDBNavbarBrand>

              <MDBNavbarBrand className="m-auto align-items-center">
                <Link
                  to="https://www.yahoo.co.jp/"
                  target="blank"
                  className="text-black"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "cursive",
                      fontSize: "20px",
                      fontWeight: "bold",
                      userSelect: "none",
                      cursor: "pointer",
                      position: "relative",
                      display: "inline-block",
                    }}
                    className="nav-hover-bg"
                  >
                    Contact
                  </span>
                </Link>
              </MDBNavbarBrand>

              <MDBNavbarBrand className="m-auto align-items-center">
                <Link
                  to="https://qiita.com/dhulripos"
                  target="blank"
                  className="text-black"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "cursive",
                      fontSize: "20px",
                      fontWeight: "bold",
                      userSelect: "none",
                      cursor: "pointer",
                      position: "relative", // 擬似要素に位置付けを使う
                      display: "inline-block",
                    }}
                    className="nav-hover-bg"
                  >
                    Blog(Qiita)
                  </span>
                </Link>
              </MDBNavbarBrand>

              {/* <MDBNavbarItem
                className="ms-auto "
                style={{ position: "relative" }}
              >
                <MDBDropdown style={{ zIndex: 2000 }}>
                  <MDBDropdownToggle
                    style={{ fontSize: "16px", textTransform: "none" }}
                    className="bg bg-dark"
                  >
                    ユーザー名(仮)
                  </MDBDropdownToggle>
                  <MDBDropdownMenu dark>
                    <MDBDropdownItem
                      link
                      href="/userEdit"
                      onClick={handleUserEdit}
                    >
                      ユーザー情報変更
                    </MDBDropdownItem>
                    <MDBDropdownItem
                      link
                      href="/order"
                      onClick={goOrderHistory}
                    >
                      注文履歴
                    </MDBDropdownItem>
                    <MDBDropdownItem
                      link
                      // onClick={invalidateUserState}
                      href="/logout"
                    >
                      ログアウト
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem> */}

              <MDBNavbarItem className="ms-5" style={{ marginRight: "15px" }}>
                <a href="/cartList">
                  <img
                    // src={emptyCart}
                    alt=""
                    height="40"
                    // onClick={() => setOrderPage(1)}
                  />
                  <span
                    className="badge rounded-pill badge-notification bg-danger"
                    style={{ fontSize: "12px" }}
                  ></span>
                </a>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
      <style>
        {`
          .nav-hover-bg::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 3px;
            background: #3498db;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
          }
          .nav-hover-bg:hover::after {
            transform: scaleX(1);
            transform-origin: left;
          }
        `}
      </style>
    </div>
  );
}
