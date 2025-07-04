// Works.jsxに載せる小作品
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import FileUpload from "../utils/FileUpload";
import { useRecoilState } from "recoil";
import { customButtonGeneratorRecoilState } from "../recoils/recoilState";
import { CopyToClipboard } from "react-copy-to-clipboard";

// ユーザーがカスタムでボタンを作成するためのコンポーネント
export default function CustomButtonGenerate() {
  // CustomButtonGenerator.jsxのステート管理をするアトム
  const [customButtonGeneratorRecoil, setCustomButtonGeneratorRecoilState] =
    useRecoilState(customButtonGeneratorRecoilState);
  const buttonArr = ["BUTTON", "ICON"]; // テキストボタン、アイコンを選択
  const [kindsOfButton, setKindsOfButton] = useState(
    customButtonGeneratorRecoil.kindsOfButton !==
      ((undefined || null || "") && "ICON")
      ? customButtonGeneratorRecoil.kindsOfButton
      : "ICON"
  ); // ボタンの種類をセットする
  const hoverArr = ["None", "Color Inversion", "Underline"];
  const [hoverState, setHoverState] = useState(
    customButtonGeneratorRecoil.hoverState !== (undefined || null || "")
      ? customButtonGeneratorRecoil.hoverState
      : hoverArr[0]
  );
  const [underlineColor, setUnderlineColor] = useState(
    customButtonGeneratorRecoil.hoverState !== (undefined || null || "")
      ? customButtonGeneratorRecoil.underlineColor
      : "#ffffff"
  );
  // ホバーエフェクトの内容をセットする。どれか1つだけ選択可能
  const clickArr = ["None", "ripple", "changeScale"]; // クリック時のエフェクトの種類。どれか1つだけ選択可能
  const [clickEffect, setClickEffect] = useState(
    customButtonGeneratorRecoil.clickEffect !== (undefined || null || "")
      ? customButtonGeneratorRecoil.clickEffect
      : clickArr[0]
  );
  const [buttonText, setButtonText] = useState(
    customButtonGeneratorRecoil.buttonText !== (undefined || null || "")
      ? customButtonGeneratorRecoil.buttonText
      : "ボタン名"
  );
  const [urlText, setURLText] = useState(
    customButtonGeneratorRecoil.urlText !== (undefined || null || "")
      ? customButtonGeneratorRecoil.urlText
      : undefined
  ); // 遷移先URLを保持するステート(URLは未入力でもOK)
  const [buttonColor, setButtonColor] = useState(
    customButtonGeneratorRecoil.buttonColor !== (undefined || null || "")
      ? customButtonGeneratorRecoil.buttonColor
      : "#ffd480"
  ); // ボタンの背景色
  const [buttonTextColor, setButtonTextColor] = useState(
    customButtonGeneratorRecoil.buttonTextColor !== (undefined || null || "")
      ? customButtonGeneratorRecoil.buttonTextColor
      : "#000000"
  ); // ボタンの文字の色
  const shadowArr = [
    "100%",
    "90%",
    "80%",
    "70%",
    "60%",
    "50%",
    "40%",
    "30%",
    "20%",
    "10%",
  ];
  const [shadow, setShadow] = useState(
    customButtonGeneratorRecoil.shadow !== (undefined || null || "")
      ? customButtonGeneratorRecoil.shadow
      : shadowArr[0]
  );
  const [imageSrc, setImageSrc] = useState(null); // アイコンの画像の受け渡しをする用
  const [HTMLCode, setHTMLCode] = useState("");
  const [CSSCode, setCSSCode] = useState("");
  const [JSCode, setJSCode] = useState("");
  const [isHovered, setIsHovered] = useState(false); // 画面に表示するボタンのホバー時エフェクトがUnderlineのみのときに使用してる制御用変数
  const [message, setMessage] = useState(""); // メッセージ用のステート
  const [isJapanese, setIsJapanese] = useState(
    customButtonGeneratorRecoil.isJapanese !== (undefined || null || "")
      ? customButtonGeneratorRecoil.isJapanese
      : true
  ); // 言語切り替えのステート管理（true:日本語,false:英語）

  // メッセージを表示する関数
  const showCopyMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2000); // 2秒後に非表示
  };
  // まとめてコピーする値を格納する変数。即時関数で値を入れるようにした。
  const copiedIntegratedCode = (() => {
    let result = "";
    if (HTMLCode !== "None" && CSSCode !== "None" && JSCode !== "None") {
      result += HTMLCode + CSSCode + JSCode;
      return result;
    } else if (HTMLCode !== "None" && CSSCode === "None" && JSCode === "None") {
      result += HTMLCode;
      return result;
    } else if (HTMLCode !== "None" && CSSCode !== "None" && JSCode === "None") {
      result += HTMLCode + CSSCode;
      return result;
    }
  })();

  // 日本語と英語の表示をを切り替えるハンドラー
  const handleChangeLanguage = () => {
    setIsJapanese((prev) => !prev);

    // Recoilの更新(ローカルストレージの更新)
    // useStateのset関数は非同期なので、Recoilの値も明示的にboolを反転させるように記述する必要がある
    const newState = { ...CustomButtonGenerate, isJapanese: !isJapanese };
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));

    return;
  };

  const handleSetKindsOfButton = (e, element, index) => {
    // ICONが選択された場合は、BUTTONの情報を残したいため、Recoilは更新しないようにif文の中でreturnする
    // BUTTONは入力項目が多いので、最初から入力するような事態にしたくない
    if (element === "ICON") {
      setKindsOfButton(element);

      setHTMLCode("None");
      setCSSCode("None");
      setJSCode("None");

      return;
    }

    setKindsOfButton(element);

    // Recoilの更新(ローカルストレージの更新)
    const newState = { ...CustomButtonGenerate, kindsOfButton: element };
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));
  };

  const handleSetHover = (e, element, index) => {
    setHoverState(element);

    // Recoilの更新(ローカルストレージの更新)
    const newState = { ...CustomButtonGenerate, hoverState: element };
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));
  };

  const handleSetClick = (e, element, index) => {
    setClickEffect(element);

    // Recoilの更新(ローカルストレージの更新)
    const newState = { ...CustomButtonGenerate, clickEffect: element };
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));
  };

  const handleSetButtonText = (e) => {
    setButtonText(e.target.value);

    // Recoilの更新(ローカルストレージの更新)
    const newState = { ...CustomButtonGenerate, buttonText: e.target.value };
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));
  };

  const handleSetColor = (e) => {
    setButtonColor(e.target.value);

    // Recoilの更新(ローカルストレージの更新)
    const newState = { ...CustomButtonGenerate, buttonColor: e.target.value };
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));
  };

  const handleSetButtonTextColor = (e) => {
    setButtonTextColor(e.target.value);

    // Recoilの更新(ローカルストレージの更新)
    const newState = {
      ...CustomButtonGenerate,
      buttonTextColor: e.target.value,
    };
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));
  };

  const handleSetShadow = (e, element, index) => {
    setShadow(element);

    // Recoilの更新(ローカルストレージの更新)
    const newState = { ...CustomButtonGenerate, shadow: element };
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));
  };

  const handleSetURLText = (e) => {
    console.log("URL:", e.target.value);
    if (e.target.value === ("" || undefined)) {
      setURLText(undefined);
    }
    setURLText(e.target.value);

    // Recoilの更新(ローカルストレージの更新)
    const newState = { ...CustomButtonGenerate, urlText: e.target.value };
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));
  };

  const handleSetUnderlineColor = (e) => {
    setUnderlineColor(e.target.value);

    // Recoilの更新(ローカルストレージの更新)
    const newState = {
      ...CustomButtonGenerate,
      underlineColor: e.target.value,
    };
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));
  };

  // CustomButtonGenerator.jsxのステート管理をするアトム
  const handleSetRecoilState = () => {
    // オブジェクトにまとめて状態を管理
    const newState = {
      clickEffect,
      hoverState,
      buttonColor,
      buttonText,
      buttonTextColor,
      shadow,
      urlText,
      kindsOfButton,
      underlineColor,
      isJapanese,
    };

    // Recoilの状態を更新
    setCustomButtonGeneratorRecoilState((prev) => ({
      ...prev,
      ...newState, // まとめて更新
    }));

    return;
  };

  // rippleとUnderlineのcombinationで使用している
  const [ripples, setRipples] = useState([]);
  const handleRippleAndUnderline = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: Date.now(), // ユニークID
      style: {
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
        width: "100px",
        height: "100px",
        background: "rgba(255, 255, 255, 0.5)", // 色と透明度
        borderRadius: "50%",
        transform: "scale(0)",
        animation: "ripple 0.6s linear",
        pointerEvents: "none",
      },
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600); // アニメーション時間に合わせる
  };

  // クリック時のエフェクトが「Ripple」の場合
  const [rippleStyle, setRippleStyle] = useState(null);
  const handleRippleEffect = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRippleStyle({ top: y + "px", left: x + "px" });

    setTimeout(() => setRippleStyle(null), 600); // Ripple effect duration
  };
  // (画面表示用)ホバー時の条件はない、シンプルにrippleだけのボタン
  const ripple = (
    <button
      onClick={handleRippleEffect}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "10px 20px",
        fontSize: "45px",
        border: "none",
        borderRadius: "8px",
        background: buttonColor,
        color: buttonTextColor,
        cursor: "pointer",
        opacity: shadow,
      }}
    >
      {buttonText}
      {rippleStyle && (
        <span
          style={{
            zIndex: 10, // 高い値を設定して前面に表示
            position: "absolute",
            borderRadius: "50%",
            transform: "scale(0)",
            animation: "ripple 0.6s linear",
            background: "rgba(255, 255, 255, 0.5)",
            width: "100px",
            height: "100px",
            ...rippleStyle,
          }}
        ></span>
      )}
      <style>
        {`
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}
      </style>
    </button>
  );

  // (画面表示用)クリック時のエフェクトがchangeScaleの場合
  const changeScale = (
    <button class="scale-button">
      {buttonText}
      <style>
        {`
          .scale-button {
            padding: 10px 20px;
            background-color: ${buttonColor};
            color: ${buttonTextColor};
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.1s ease;
            font-size: 45px;
          }

          .scale-button:active {
            transform: scale(0.95); /* 縮小 */
          }
        `}
      </style>
    </button>
  );

  // (画面表示用)ホバー時にColor Inversion、クリック時のエフェクトはなし
  const changeColorInHovering = (
    <button
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "10px 20px",
        fontSize: "45px",
        border: "none",
        borderRadius: "8px",
        background: isHovered ? buttonTextColor : buttonColor,
        color: isHovered ? buttonColor : buttonTextColor,
        cursor: "pointer",
        opacity: shadow,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {buttonText}
    </button>
  );

  // (画面表示用)ホバーエフェクトがUnderlineで、クリックエフェクトはない場合
  const onlyUnderLine = (
    <button
      style={{
        overflow: "hidden",
        padding: "10px 20px",
        fontSize: "45px",
        border: "none",
        borderRadius: "8px",
        background: buttonColor,
        color: buttonTextColor,
        cursor: "pointer",
        opacity: shadow,
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "cursive",
          userSelect: "none",
          display: "inline-block",
        }}
      >
        {buttonText}
        <span
          style={{
            content: "",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "3px",
            background: underlineColor,
            transform: isHovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: isHovered ? "left" : "right",
            transition: "transform 0.3s ease",
          }}
        ></span>
      </span>
    </button>
  );

  // (画面表示用)クリックエフェクトがrippleで、ホバーエフェクトがUnderlineの場合
  const rippleAndUnderline = (
    <button
      onClick={handleRippleAndUnderline} // ripple
      style={{
        overflow: "hidden",
        padding: "10px 20px",
        fontSize: "45px",
        border: "none",
        borderRadius: "8px",
        background: buttonColor,
        color: buttonTextColor,
        cursor: "pointer",
        position: "relative",
        opacity: shadow,
      }}
    >
      <span
        style={{
          zIndex: "1",
          fontFamily: "cursive",
          //   fontWeight: "bold",
          userSelect: "none",
          position: "relative", // 擬似要素に位置付けを使う
          display: "inline-block",
        }}
        className="hover-bg"
      >
        {buttonText}
      </span>
      {ripples.map((ripple) => (
        <span key={ripple.id} style={ripple.style}></span>
      ))}
      <style>
        {`
          .hover-bg::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 3px;
            background: ${underlineColor};
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
          }
          .hover-bg:hover::after {
            transform: scaleX(1);
            transform-origin: left;
          }
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}
      </style>
    </button>
  );

  // (画面表示用)Color Inversionとripple
  const colorInversionAndRipple = (
    <>
      <button
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "10px 20px",
          fontSize: "45px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: buttonColor,
          color: buttonTextColor,
          cursor: "pointer",
          transition: "background-color 0.3s, color 0.3s",
          userSelect: "none",
          opacity: shadow,
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = buttonTextColor;
          e.target.style.color = buttonColor;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = buttonColor;
          e.target.style.color = buttonTextColor;
        }}
        onClick={(e) => {
          const rect = e.target.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const ripple = document.createElement("span");
          ripple.style.position = "absolute";
          ripple.style.width = "100px";
          ripple.style.height = "100px";
          ripple.style.background = "rgba(255, 255, 255, 0.5)";
          ripple.style.borderRadius = "50%";
          ripple.style.pointerEvents = "none";
          ripple.style.transform = "translate(-50%, -50%)";
          ripple.style.top = `${y}px`;
          ripple.style.left = `${x}px`;
          ripple.style.animation = "ripple-animation 0.6s ease-out";

          e.target.appendChild(ripple);

          setTimeout(
            () => {
              ripple.remove();
              if (urlText) {
                window.location.href = urlText;
              }
            },
            urlText ? 50 : 600
          );
        }}
      >
        {buttonText}
      </button>
      <style>
        {`
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `}
      </style>
    </>
  );

  // (画面表示用)Color InversionとchangeScale
  const colorInversionAndChangeScale = (
    <>
      <button
        className="scale-button"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "10px 20px",
          fontSize: "45px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: buttonColor,
          color: buttonTextColor,
          opacity: shadow,
          cursor: "pointer",
          transition: "background-color 0.3s, color 0.3s",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = buttonTextColor;
          e.target.style.color = buttonColor;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = buttonColor;
          e.target.style.color = buttonTextColor;
        }}
        onClick={() => {
          if (urlText) {
            window.location.href = urlText;
          }
        }}
      >
        {buttonText}
      </button>

      <style>
        {`
        .scale-button:active {
          transform: scale(0.95);
        }
      `}
      </style>
    </>
  );

  const underLineAndChangeScale = (
    <>
      <button
        className="button-css scale-button"
        onClick={() => {
          if (urlText) {
            window.location.href = urlText;
          }
        }}
      >
        <span
          className="button-span-css hover-bg"
          style={{ userSelect: "none" }}
        >
          {buttonText}
        </span>
      </button>

      <style>
        {`
          .button-css{
            overflow: hidden;
            padding: 10px 20px;
            font-size: 45px;
            border: medium;
            border-radius: 8px;
            background: ${buttonColor};
            color: ${buttonTextColor};
            cursor: pointer;
            opacity: ${shadow};
            padding: 0.5em;
          }
          .button-span-css {
            position: relative;
            z-index: 1;
            font-family: cursive;
            user-select: "none";
            position: relative;
            display: inline-block;
          }
          .hover-bg::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 3px;
            background: ${underlineColor};
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
          }
          .hover-bg:hover::after {
            transform: scaleX(1);
            transform-origin: left;
          }
          .scale-button {
            padding: 10px 20px;
            background-color: ${buttonColor};
            color: ${buttonTextColor};
            opacity: ${shadow};
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.1s ease;
            font-size: 45px;
          }
          .scale-button:active {
            transform: scale(0.95);
          }
        `}
      </style>
    </>
  );

  // (コピーさせる用)画面に埋め込む用のHTML,CSS,JSを生成するuseEffect
  useEffect(() => {
    // ボタンの種類がBUTTONの場合とICONの場合で制御したいので、boolの変数を作る
    const isButton = kindsOfButton === "BUTTON"; // BUTTONならtrue,ICONならfalse

    // UnderlineとchangeScaleのとき
    if (
      isButton &&
      hoverState === "Underline" &&
      clickEffect === "changeScale"
    ) {
      setHTMLCode(` 
        <button class="button-css scale-button" onclick="handleUnderlineAndChangeScale(event)">
          <span class="button-span-css hover-bg">${buttonText}</span>
        </button>`);
      setCSSCode(`
          <style>
          .button-css{
            overflow: hidden;
            padding: 10px 20px;
            font-size: 16px;
            border: medium;
            border-radius: 8px;
            background: ${buttonColor};
            color: ${buttonTextColor};
            cursor: pointer;
            opacity: ${shadow};
            padding: 0.5em;
          }
          .button-span-css {
            position: relative;
            z-index: 1;
            font-family: cursive;
            user-select: "none";
            position: relative;
            display: inline-block;
          }
          .hover-bg::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 3px;
            background: ${underlineColor};
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
          }
          .hover-bg:hover::after {
            transform: scaleX(1);
            transform-origin: left;
          }
          .scale-button {
              padding: 10px 20px;
              background-color: ${buttonColor};
              color: ${buttonTextColor};
              opacity: ${shadow};
              border: none;
              border-radius: 8px;
              cursor: pointer;
              transition: transform 0.1s ease;
              font-size: 16px;
            }
            .scale-button:active {
              transform: scale(0.95);
            }
          </style>`);

      // changeScaleはJSなしのため、Underlineのみ
      setJSCode(`
      <script>
          function handleUnderlineAndChangeScale(event) {
            const strUrlText = "${urlText}";
            let judge = strUrlText !== "" ? strUrlText : undefined;

            if (judge !== undefined) {
              window.location.href = judge;
              return;
            } else {
              return;
            }
          }
      </script>`);

      // Recoilにステートを格納する処理...
      handleSetRecoilState();
      return;
    }

    // Color InversionとchangeScaleのとき
    if (
      isButton &&
      hoverState === "Color Inversion" &&
      clickEffect === "changeScale"
    ) {
      setHTMLCode(
        `<button id="hoverButton" class="scale-button" onclick="handleChangeScale()">${buttonText}</button>`
      );
      setCSSCode(`
        <style>
          #hoverButton {
            position: relative;
            overflow: hidden;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 8px;
            background-color: ${buttonColor};
            color: ${buttonTextColor};
            opacity: ${shadow};
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
          }
          .scale-button {
            padding: 10px 20px;
            background-color: ${buttonColor};
            color: ${buttonTextColor};
            opacity: ${shadow};
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.1s ease;
            font-size: 16px;
          }
          .scale-button:active {
            transform: scale(0.95);
          }
        </style>`);

      // changeScaleはJSなしなので、Color InversionのJSのみでOK
      setJSCode(`
        <script>
          const button = document.getElementById("hoverButton");

          const buttonColor = "${buttonColor}";
          const buttonTextColor = "${buttonTextColor}";
          const hoverButtonColor = "${buttonTextColor}";
          const hoverTextColor = "${buttonColor}";

          button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = hoverButtonColor;
            button.style.color = hoverTextColor;
          });

          button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = buttonColor;
            button.style.color = buttonTextColor;
          });

          function handleChangeScale(event) {
            const strUrlText = "${urlText}";
            let judge = strUrlText !== "" ? strUrlText : undefined;

            if (judge !== undefined) {
              window.location.href = judge;
              return;
            } else {
              return;
            }
          }
        </script>`);

      // Recoilにステートを格納する処理...
      handleSetRecoilState();
      return;
    }

    // Color Inversionとrippleのとき
    if (
      isButton &&
      hoverState === "Color Inversion" &&
      clickEffect === "ripple"
    ) {
      setHTMLCode(
        `<button id="hoverButton" onclick="handleColorInversionAndRipple(event)">${buttonText}</button>`
      );
      setCSSCode(`
        <style>
          #hoverButton {
            position: relative;
            overflow: hidden;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 8px;
            background-color: ${buttonColor};
            color: ${buttonTextColor};
            opacity: ${shadow};
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
          }
          @keyframes ripple-animation {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(4);
              opacity: 0;
            }
          }
        </style>`);
      // URLが設定されていたら設定する
      setJSCode(`
        <script>
          const button = document.getElementById("hoverButton");

          const buttonColor = "${buttonColor}";
          const buttonTextColor = "${buttonTextColor}";
          const hoverButtonColor = "${buttonTextColor}";
          const hoverTextColor = "${buttonColor}";

          button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = hoverButtonColor;
            button.style.color = hoverTextColor;
          });

          button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = buttonColor;
            button.style.color = buttonTextColor;
          });

          function handleColorInversionAndRipple(event) {
            const target = event.target;
            const rect = target.getBoundingClientRect();
            const x = event.clientX - rect.left; 
            const y = event.clientY - rect.top;
            const ripple = document.createElement("span");
            ripple.style.position = "absolute";
            ripple.style.width = "100px";
            ripple.style.height = "100px";
            ripple.style.background = "rgba(255, 255, 255, 0.5)";
            ripple.style.borderRadius = "50%";
            ripple.style.pointerEvents = "none";
            ripple.style.transform = "translate(-50%, -50%)";
            ripple.style.top = y + "px";
            ripple.style.left = x + "px";
            ripple.style.animation = "ripple-animation 0.6s ease-out";
  
            target.appendChild(ripple);
  
            setTimeout(() => {
              ripple.remove();
              const strUrlText = "${urlText}";
              let judge = strUrlText !== "" ? strUrlText : undefined;

              if (judge !== undefined) {
                window.location.href = judge;
                return;
              } else {
                return;
              }
            }, ${urlText === undefined ? 600 : 50});
          }
        </script>`);

      // Recoilにステートを格納する処理...
      handleSetRecoilState();
      return;
    }

    // Underlineとrippleのとき
    if (isButton && hoverState === "Underline" && clickEffect === "ripple") {
      setHTMLCode(` 
        <button class="button-css" onclick="handleRippleAndUnderline(event)">
          <span class="button-span-css hover-bg">${buttonText}</span>
        </button>`);
      setCSSCode(`
        <style>
        .button-css{
          overflow: hidden;
          padding: 10px 20px;
          font-size: 16px;
          border: medium;
          border-radius: 8px;
          background: ${buttonColor};
          color: ${buttonTextColor};
          cursor: pointer;
          opacity: ${shadow};
          padding: 0.5em;
        }
        .button-span-css {
          position: relative;
          z-index: 1;
          font-family: cursive;
          user-select: "none";
          position: relative;
          display: inline-block;
        }
        .hover-bg::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          background: ${underlineColor};
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }
        .hover-bg:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
        </style>`);
      // URLが設定されていたら設定する
      setJSCode(`
        <script>
          function handleRippleAndUnderline(event) {
            const target = event.target;
            const rect = target.getBoundingClientRect();
            const x = event.clientX - rect.left; 
            const y = event.clientY - rect.top;
            const ripple = document.createElement("span");
            ripple.style.position = "absolute";
            ripple.style.width = "100px";
            ripple.style.height = "100px";
            ripple.style.background = "rgba(255, 255, 255, 0.5)";
            ripple.style.borderRadius = "50%";
            ripple.style.pointerEvents = "none";
            ripple.style.transform = "translate(-50%, -50%)";
            ripple.style.top = y + "px";
            ripple.style.left = x + "px";
            ripple.style.animation = "ripple-animation 0.6s ease-out";
  
            target.appendChild(ripple);
  
            setTimeout(() => {
              ripple.remove();
              const strUrlText = "${urlText}";
              let judge = strUrlText !== "" ? strUrlText : undefined;

              if (judge !== undefined) {
                window.location.href = judge;
                return;
              } else {
                return;
              }
            }, ${`${urlText}` === "" ? 600 : 50});
  
          }
          </script>`);

      // Recoilにステートを格納する処理...
      handleSetRecoilState();
      return;
    }

    // ホバー時のエフェクトがColor Inversionのとき
    if (isButton && hoverState === "Color Inversion") {
      setHTMLCode(
        `<button id="hoverButton" onclick="handleClick()">${buttonText}</button>`
      );
      setCSSCode(`
        <style>
          #hoverButton {
            position: relative;
            overflow: hidden;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 8px;
            background-color: ${buttonColor};
            color: ${buttonTextColor};
            opacity: ${shadow};
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
          }
        </style>`);
      // URLが設定されていたら設定する
      setJSCode(`
        <script>
          const button = document.getElementById("hoverButton");

          const buttonColor = "${buttonColor}";
          const buttonTextColor = "${buttonTextColor}";
          const hoverButtonColor = "${buttonTextColor}";
          const hoverTextColor = "${buttonColor}";

          button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = hoverButtonColor;
            button.style.color = hoverTextColor;
          });

          button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = buttonColor;
            button.style.color = buttonTextColor;
          });

          function handleClick(event) {
            const strUrlText = "${urlText}";
            let judge = strUrlText !== "" ? strUrlText : undefined;

            if (judge !== undefined) {
              window.location.href = judge;
              return;
            } else {
              return;
            }
          }
        </script>`);

      // Recoilにステートを格納する処理...
      handleSetRecoilState();
      return;
    }

    // Underlineだけの場合
    if (isButton && hoverState === "Underline") {
      setHTMLCode(` 
        <button class="button-css" onclick="handleRippleAndUnderline(event)">
          <span class="button-span-css hover-bg">${buttonText}</span>
        </button>`);
      setCSSCode(`
        <style>
        .button-css{
          overflow: hidden;
          padding: 10px 20px;
          font-size: 16px;
          border: medium;
          border-radius: 8px;
          background: ${buttonColor};
          color: ${buttonTextColor};
          cursor: pointer;
          opacity: ${shadow};
          padding: 0.5em;
        }
        .button-span-css {
          position: relative;
          z-index: 1;
          font-family: cursive;
          user-select: "none";
          position: relative;
          display: inline-block;
        }
        .hover-bg::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          background: ${underlineColor};
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }
        .hover-bg:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        </style>`);
      // URLが設定されていたら設定する
      setJSCode(`
        <script>
          function handleRippleAndUnderline(event) {
            setTimeout(() => {
              const strUrlText = "${urlText}";
            let judge = strUrlText !== "" ? strUrlText : undefined;

            if (judge !== undefined) {
              window.location.href = judge;
              return;
            } else {
              return;
            }
            }, ${urlText === undefined ? 600 : 50});
  
          }
          </script>`);

      // Recoilにステートを格納する処理...
      handleSetRecoilState();
      return;
    }

    // rippleだけのとき
    if (isButton && clickEffect === "ripple") {
      setHTMLCode(
        ` <button class="button-css" onclick="handleClickEffect(event)">
            <span class="button-span-css">${buttonText}</span>
          </button>`
      );
      setCSSCode(`
        <style>
        .button-css{
          overflow: hidden;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          background: ${buttonColor};
          color: ${buttonTextColor};
          cursor: pointer;
          position: relative;
          opacity: ${shadow};
          padding: 0.5em;
        }
        .button-span-css{
          font-family: cursive;
          user-select: none;
          position: relative;
          display: inline-block;
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
        </style>`);
      // URLが設定されていたら設定する
      setJSCode(`
      <script>
        function handleClickEffect(event) {
          const target = event.target;
          const rect = target.getBoundingClientRect();
          const x = event.clientX - rect.left; 
          const y = event.clientY - rect.top;
          const ripple = document.createElement("span");
          ripple.style.position = "absolute";
          ripple.style.width = "100px";
          ripple.style.height = "100px";
          ripple.style.background = "rgba(255, 255, 255, 0.5)";
          ripple.style.borderRadius = "50%";
          ripple.style.pointerEvents = "none";
          ripple.style.transform = "translate(-50%, -50%)";
          ripple.style.top = y + "px";
          ripple.style.left = x + "px";
          ripple.style.animation = "ripple-animation 0.6s ease-out";

          target.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
            const strUrlText = "${urlText}";
            let judge = strUrlText !== "" ? strUrlText : undefined;

            if (judge !== undefined) {
              window.location.href = judge;
              return;
            } else {
              return;
            }
          }, ${urlText === "" ? 600 : 50});

        }
        </script>`);

      // Recoilにステートを格納する処理...
      handleSetRecoilState();
      return;
    }

    // changeScaleだけの場合
    if (isButton && clickEffect === "changeScale") {
      if (urlText) {
        setHTMLCode(` 
          <button class="scale-button" onclick="handleButtonClick()">${buttonText}</button>`);
        setJSCode(`
            <script>
                function handleButtonClick(event) {
                  const strUrlText = "${urlText}";
                  let judge = strUrlText !== "" ? strUrlText : undefined;
      
                  if (judge !== undefined) {
                    window.location.href = judge;
                    return;
                  } else {
                    return;
                  }
                }
            </script>`);
      } else {
        setHTMLCode(` 
          <button class="scale-button">${buttonText}</button>`);
        // JSCodeは何もなし。CSSだけで実装してる
        setJSCode(`None`);
      }
      setCSSCode(`
        <style>
          .scale-button {
            padding: 10px 20px;
            background-color: ${buttonColor};
            color: ${buttonTextColor};
            opacity: ${shadow};
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.1s ease;
            font-size: 16px;
          }
          .scale-button:active {
            transform: scale(0.95);
          }
        </style>`);

      // Recoilにステートを格納する処理...
      handleSetRecoilState();
      return;
    }

    // ICONの場合
    // Recoilの更新はあえてやっていない
    if (kindsOfButton === "ICON") {
      setHTMLCode(`
        <button
          style="
            background-color: white;
            border: none;">
          <img
            src="${imageSrc}"
            width="50"
            height="50"
            style="opacity: ${shadow};"
          />
        </button>
        `);
      setCSSCode(`None`);

      // URLが設定されている場合とそうでない場合で返すものを変える
      if (urlText) {
        setHTMLCode(`
          <button
            onclick="handleButtonClick()"
            style="
              background-color: white;
              border: none;">
            <img
              src="${imageSrc}"
              width="50"
              height="50"
              style="opacity: ${shadow};"
            />
          </button>
          `);
        setJSCode(`
          <script>
          function handleButtonClick() {
            const strUrlText = "${urlText}";
            let judge = strUrlText !== "" ? strUrlText : undefined;

            if (judge !== undefined) {
              window.location.href = judge;
              return;
            } else {
              return;
            }
          }
          
          </script>`);
      } else {
        setHTMLCode(`
          <button
            style="
              background-color: white;
              border: none;">
            <img
              src="${imageSrc}"
              width="50"
              height="50"
              style="opacity: ${shadow};"
            />
          </button>
          `);
        setJSCode(`None`);
      }

      return;
    }

    // ホバーエフェクト、クリックエフェクトともにNoneの場合
    if (isButton && hoverState === "None" && clickEffect === "None") {
      // URLが設定されている場合とそうでない場合で返すものを変える
      if (urlText) {
        setHTMLCode(` 
          <button class="button-css" onclick="handleButtonClick()">${buttonText}</button>`);
        setJSCode(`
            <script>
            function handleButtonClick() {
              const strUrlText = "${urlText}";
              let judge = strUrlText !== "" ? strUrlText : undefined;

              if (judge !== undefined) {
                window.location.href = judge;
                return;
              } else {
                return;
              }
            }
            
            </script>`);
      } else {
        setHTMLCode(` 
          <button class="button-css">${buttonText}</button>`);
        setJSCode(`None`);
      }

      setCSSCode(`
          <style>
            .button-css {
              padding: 10px 20px;
              background-color: ${buttonColor};
              color: ${buttonTextColor};
              opacity: ${shadow};
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              user-select: "none";
            }

          </style>`);

      // Recoilにステートを格納する処理...
      handleSetRecoilState();
      return;
    }
  }, [
    clickEffect,
    hoverState,
    buttonColor,
    buttonText,
    buttonTextColor,
    shadow,
    urlText,
    underlineColor,
    kindsOfButton,
    imageSrc,
  ]);

  return (
    <MDBContainer className="mt-4">
      <MDBRow>
        <MDBCol>
          <MDBRow>
            <div
              className="position-relative mb-3"
              style={{ fontFamily: "cursive" }}
            >
              <h1 className="position-absolute top-0 start-50 translate-middle-x">
                {isJapanese
                  ? "カスタムボタンジェネレーター"
                  : "Custom Button Generator"}
              </h1>
              <button
                type="button"
                className="position-absolute top-0 end-0 btn btn-info text-white me-3"
                onClick={handleChangeLanguage}
              >
                {isJapanese ? "Switch to English" : "日本語に切り替え"}
              </button>
            </div>
          </MDBRow>

          <div className="mb-1 mt-5" style={{ fontFamily: "cursive" }}>
            <hr />
            <MDBRow>
              <MDBCol>
                <div className="d-flex justify-content-center align-items-center">
                  <ul>
                    <li
                      style={{
                        listStyle: "none",
                        marginBottom: "20px",
                      }}
                    >
                      <h3 style={{ fontSize: "30px" }}>
                        {isJapanese ? "使い方" : "How to use"}
                      </h3>
                    </li>
                    <li>
                      <span>
                        {isJapanese
                          ? "ボタン名を入力（※必須項目）"
                          : "Enter the button name (※Required)"}
                      </span>
                    </li>
                    <li>
                      <span>
                        {isJapanese
                          ? "遷移先URLを入力（※入力必須ではありません）"
                          : "Enter the destination URL (※Not required)"}
                      </span>
                    </li>
                    <li>
                      <span>
                        {isJapanese
                          ? "ボタンの色を選択"
                          : "Select button color"}
                      </span>
                    </li>
                    <li>
                      <span>
                        {isJapanese
                          ? "ボタンの文字の色を選択"
                          : "Select the button text color"}
                      </span>
                    </li>
                    <li>
                      <span>
                        {isJapanese
                          ? "下線の色を選択"
                          : "Select the underline color"}
                      </span>
                    </li>
                    <li>
                      <span>
                        {isJapanese
                          ? "作成したいボタンの種類を選択"
                          : "Select the type of button you want to create"}
                      </span>
                    </li>
                    <li style={{ listStylePosition: "outside" }}>
                      <span
                        style={
                          !isJapanese
                            ? {
                                display: "block",
                                maxWidth: "400px",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                              }
                            : undefined // isJapanese が true の場合、スタイルを適用しない
                        }
                      >
                        {isJapanese
                          ? "ホバーエフェクトの有無、クリックエフェクトの有無を選択"
                          : "Choose whether to hover or not, and whether to use effects when clicked, and what type of effects they will have."}
                      </span>
                    </li>
                    <li>
                      <span>
                        {isJapanese ? "影効果を選択" : "Select Shadow Effect"}
                      </span>
                    </li>
                  </ul>
                </div>
              </MDBCol>
            </MDBRow>
          </div>

          <hr />

          <MDBRow>
            {/* 入力1行目start */}
            <MDBCol>
              <div className="d-flex justify-content-around">
                {/* ボタン名を入力させる */}
                {kindsOfButton === "BUTTON" ? (
                  // ボタンの種類が「BUTTON」の場合、入力状態とする
                  <colgroup className="d-inline-flex">
                    <strong
                      className="me-2 pt-2 text-nowrap"
                      style={{ maxWidth: "auto" }}
                    >
                      {isJapanese ? "ボタン名:" : "Button name:"}
                    </strong>
                    <MDBInput
                      onChange={(e) => handleSetButtonText(e)}
                      value={buttonText}
                      min={1}
                      max={15}
                      style={{ width: "20em" }}
                    />
                  </colgroup>
                ) : (
                  // ボタンの種類が「ICON」の場合、非活性
                  <colgroup
                    className="d-inline-flex"
                    style={{ opacity: "20%" }}
                  >
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "ボタン名:" : "Button name:"}
                    </strong>
                    <MDBInput
                      value={buttonText}
                      style={{ width: "20em" }}
                      disabled
                    />
                  </colgroup>
                )}

                {/* 背景色を選択させる */}
                {kindsOfButton === "BUTTON" ? (
                  // ボタンの種類が「BUTTON」の場合、入力状態とする
                  <colgroup className="d-inline-flex">
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "ボタンの色:" : "Button Color:"}
                    </strong>
                    <input
                      type="color"
                      id="colorPicker"
                      name="color"
                      className="mt-1"
                      value={buttonColor}
                      onChange={(e) => handleSetColor(e)}
                    ></input>
                  </colgroup>
                ) : (
                  // ボタンの種類が「ICON」の場合、非活性
                  <colgroup
                    className="d-inline-flex"
                    style={{ opacity: "20%" }}
                  >
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "ボタンの色:" : "Button Color:"}
                    </strong>
                    <input
                      type="color"
                      id="colorPicker"
                      name="color"
                      className="mt-1"
                      value={buttonColor}
                      disabled
                    ></input>
                  </colgroup>
                )}

                {/*ボタンの色を選択させる */}
                {kindsOfButton === "BUTTON" ? (
                  // ボタンの種類が「BUTTON」の場合、入力状態とする
                  <colgroup className="d-inline-flex">
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "ボタンの文字の色:" : "Button Text Color:"}
                    </strong>
                    <input
                      type="color"
                      id="colorPicker"
                      name="color"
                      className="mt-1"
                      value={buttonTextColor}
                      onChange={(e) => handleSetButtonTextColor(e)}
                    ></input>
                  </colgroup>
                ) : (
                  // ボタンの種類が「ICON」の場合、非活性
                  <colgroup
                    className="d-inline-flex"
                    style={{ opacity: "20%" }}
                  >
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "ボタンの文字の色:" : "Button Text Color:"}
                    </strong>
                    <input
                      type="color"
                      id="colorPicker"
                      name="color"
                      className="mt-1"
                      value={buttonTextColor}
                      disabled
                    ></input>
                  </colgroup>
                )}

                {/* 背景色を選択させる */}
                {kindsOfButton === "BUTTON" && hoverState === "Underline" ? (
                  // ボタンの種類が「BUTTON」の場合、入力状態とする
                  <colgroup className="d-inline-flex">
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "下線の色:" : "Underline Color:"}
                    </strong>
                    <input
                      type="color"
                      id="colorPicker"
                      name="color"
                      className="mt-1"
                      value={underlineColor}
                      onChange={(e) => handleSetUnderlineColor(e)}
                    ></input>
                  </colgroup>
                ) : (
                  // ボタンじゃないし、下線じゃない
                  <colgroup
                    className="d-inline-flex"
                    style={{ opacity: "20%" }}
                  >
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "下線の色:" : "Underline Color:"}
                    </strong>
                    <input
                      type="color"
                      id="colorPicker"
                      name="color"
                      className="mt-1"
                      value={underlineColor}
                      disabled
                    ></input>
                  </colgroup>
                )}

                {/* ボタンの形式を選択 */}
                <colgroup className="d-inline-flex">
                  <strong className="me-2 pt-2 text-nowrap">
                    {isJapanese ? "ボタンの種類:" : "Button Type:"}
                  </strong>
                  <MDBDropdown>
                    <MDBDropdownToggle className="btn btn-outline-dark text-dark">
                      {kindsOfButton}
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      {buttonArr.map((element, index) => (
                        <MDBDropdownItem
                          onClick={(e) =>
                            handleSetKindsOfButton(e, element, index)
                          }
                          link
                          childTag="button"
                          key={index}
                        >
                          {element}
                        </MDBDropdownItem>
                      ))}
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </colgroup>
              </div>
            </MDBCol>
          </MDBRow>
          {/* 入力1行目end */}

          {/* 入力2行目start */}
          <MDBRow>
            <MDBCol>
              <div className="d-flex justify-content-around my-3">
                {/* URLを設定できる(未入力でもOK) */}
                <colgroup className="d-inline-flex">
                  <strong
                    className="me-2 pt-2 text-nowrap"
                    style={{ maxWidth: "20em" }}
                  >
                    {isJapanese ? "遷移先URLの設定:" : "URL:"}
                  </strong>
                  <MDBInput
                    onChange={(e) => handleSetURLText(e)}
                    value={urlText}
                    style={{ width: "20em" }}
                  />
                </colgroup>

                {/* jsのホバー時のエフェクトの有無 */}
                {kindsOfButton === "BUTTON" ? (
                  // BUTTONの場合
                  <colgroup className="d-inline-flex">
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "ホバーエフェクト:" : "Hover Effects:"}
                    </strong>
                    <MDBDropdown>
                      <MDBDropdownToggle className="btn btn-outline-dark text-dark">
                        {hoverState}
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        {hoverArr.map((element, index) => (
                          <MDBDropdownItem
                            onClick={(e) => handleSetHover(e, element, index)}
                            link
                            childTag="button"
                            key={index}
                          >
                            {element}
                          </MDBDropdownItem>
                        ))}
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </colgroup>
                ) : (
                  // ICONの時は非活性
                  <colgroup
                    className="d-inline-flex"
                    style={{ opacity: "20%" }}
                  >
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "ホバーエフェクト:" : "Hover Effects:"}
                    </strong>
                    <MDBDropdown disabled>
                      <MDBDropdownToggle
                        className="btn btn-outline-dark text-dark"
                        disabled
                      >
                        {hoverState}
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        {hoverArr.map((element, index) => (
                          <MDBDropdownItem link childTag="button" key={index}>
                            {element}
                          </MDBDropdownItem>
                        ))}
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </colgroup>
                )}

                {/* クリック時のエフェクトを選択させる */}
                {kindsOfButton === "BUTTON" ? (
                  // BUTTONの場合
                  <colgroup className="d-inline-flex">
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "クリックエフェクト:" : "Click Effects:"}
                    </strong>
                    <MDBDropdown>
                      <MDBDropdownToggle className="btn btn-outline-dark text-dark">
                        {clickEffect}
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        {clickArr.map((element, index) => (
                          <MDBDropdownItem
                            onClick={(e) => handleSetClick(e, element, index)}
                            link
                            childTag="button"
                            key={index}
                          >
                            {element}
                          </MDBDropdownItem>
                        ))}
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </colgroup>
                ) : (
                  // ICONの場合
                  <colgroup
                    className="d-inline-flex"
                    style={{ opacity: "20%" }}
                  >
                    <strong className="me-2 pt-2 text-nowrap">
                      {isJapanese ? "クリックエフェクト:" : "Click Effects:"}
                    </strong>
                    <MDBDropdown>
                      <MDBDropdownToggle
                        className="btn btn-outline-dark text-dark"
                        disabled
                      >
                        {clickEffect}
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        {clickArr.map((element, index) => (
                          <MDBDropdownItem link childTag="button" key={index}>
                            {element}
                          </MDBDropdownItem>
                        ))}
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </colgroup>
                )}

                {/* 影効果を選択させる */}
                <colgroup className="d-inline-flex">
                  <strong className="me-2 pt-2 text-nowrap">
                    {isJapanese ? "影効果:" : "Shadow Effect:"}
                  </strong>
                  <MDBDropdown>
                    <MDBDropdownToggle className="btn btn-outline-dark text-dark">
                      {shadow}
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      {shadowArr.map((element, index) => (
                        <MDBDropdownItem
                          onClick={(e) => handleSetShadow(e, element, index)}
                          link
                          childTag="button"
                          key={index}
                        >
                          {element}
                        </MDBDropdownItem>
                      ))}
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </colgroup>
              </div>
            </MDBCol>
          </MDBRow>
          {/* 入力2行目end */}
        </MDBCol>
      </MDBRow>

      {/* 指定された内容をもとにボタンを生成 */}
      <section className="h-100 h-custom">
        <MDBContainer className="h-100">
          <MDBRow className="d-flex">
            {/* ボタンのお絵描きする方 */}
            <MDBCol>
              <section className="h-100 h-custom">
                <MDBContainer className="py-5 h-100">
                  <MDBCol
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "450px" }}
                  >
                    {kindsOfButton === "BUTTON" ? (
                      // BUTTONの方をお絵描き
                      (() => {
                        if (
                          clickEffect === "ripple" &&
                          hoverState === "Underline"
                        ) {
                          return rippleAndUnderline;
                        } else if (
                          hoverState === "Color Inversion" &&
                          clickEffect === "ripple"
                        ) {
                          return colorInversionAndRipple;
                        } else if (
                          hoverState === "Color Inversion" &&
                          clickEffect === "changeScale"
                        ) {
                          return colorInversionAndChangeScale;
                        } else if (
                          hoverState === "Underline" &&
                          clickEffect === "changeScale"
                        ) {
                          return underLineAndChangeScale;
                        } else if (clickEffect === "ripple") {
                          return ripple;
                        } else if (hoverState === "Underline") {
                          return onlyUnderLine;
                        } else if (hoverState === "Color Inversion") {
                          return changeColorInHovering;
                        } else if (clickEffect === "changeScale") {
                          return changeScale;
                        } else {
                          return (
                            <button
                              style={{
                                color: buttonTextColor,
                                backgroundColor: buttonColor,
                                fontSize: "45px",
                                borderRadius: "8px",
                                position: "relative",
                                overflow: "hidden",
                                padding: "10px 20px",
                                border: "none",
                                opacity: shadow,
                                userSelect: "none",
                              }}
                              onClick={() =>
                                urlText && (window.location.href = urlText)
                              }
                            >
                              {buttonText}
                            </button>
                          );
                        }
                      })()
                    ) : (
                      // ICONの方をお絵描き
                      <>
                        {imageSrc !== null && imageSrc !== "" ? (
                          // 画像がアップロードされている場合の描画
                          <>
                            {/* 画像ファイルをアップロードさせて、それをアイコンにしたボタンを作成する */}
                            <button
                              style={{
                                backgroundColor: "white",
                                border: "none",
                              }}
                              onClick={() =>
                                urlText && (window.location.href = urlText)
                              }
                            >
                              <img
                                src={imageSrc}
                                width={100}
                                height={100}
                                style={{ opacity: shadow }}
                              />
                            </button>
                          </>
                        ) : (
                          // 画像がアップロードされていない場合の描画
                          <>
                            {/* 画像ファイルをアップロードさせて、それをアイコンにしたボタンを作成する */}
                            <FileUpload
                              imageSrc={imageSrc}
                              setImageSrc={setImageSrc}
                            />
                            <button
                              style={{
                                backgroundColor: "white",
                                border: "none",
                              }}
                            >
                              <img
                                src={imageSrc}
                                width={100}
                                height={100}
                                style={{ opacity: shadow }}
                              />
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </MDBCol>
                </MDBContainer>
              </section>
            </MDBCol>

            {/* ボタンに対応するHTML,CSS,JSコードを生成する方 */}
            <MDBCol style={{ maxWidth: 1100 }}>
              <section className="h-100 h-custom">
                <div style={{ position: "relative" }}>
                  <div className="my-3 d-flex">
                    {HTMLCode && CSSCode && JSCode && (
                      <CopyToClipboard
                        text={HTMLCode}
                        onCopy={() =>
                          showCopyMessage(
                            isJapanese ? "HTMLをコピーしました" : "HTML copied"
                          )
                        }
                      >
                        <button
                          style={{
                            marginRight: "5px",
                            backgroundColor: "#ffccff",
                            border: "none",
                            borderRadius: 10,
                          }}
                        >
                          Copy HTML
                        </button>
                      </CopyToClipboard>
                    )}

                    {HTMLCode && CSSCode && JSCode && (
                      <CopyToClipboard
                        text={CSSCode}
                        onCopy={() =>
                          showCopyMessage(
                            isJapanese ? "CSSをコピーしました" : "CSS copied"
                          )
                        }
                      >
                        <button
                          style={{
                            marginRight: "5px",
                            backgroundColor: "#ffff99",
                            border: "none",
                            borderRadius: 10,
                          }}
                        >
                          Copy CSS
                        </button>
                      </CopyToClipboard>
                    )}

                    {HTMLCode && CSSCode && JSCode && (
                      <CopyToClipboard
                        text={JSCode}
                        onCopy={() =>
                          showCopyMessage(
                            isJapanese ? "JSをコピーしました" : "JS copied"
                          )
                        }
                      >
                        <button
                          style={{
                            marginRight: "5px",
                            backgroundColor: "#66e0ff",
                            border: "none",
                            borderRadius: 10,
                          }}
                          className=""
                        >
                          Copy JS
                        </button>
                      </CopyToClipboard>
                    )}

                    {HTMLCode && CSSCode && JSCode && (
                      <CopyToClipboard
                        text={copiedIntegratedCode}
                        onCopy={() =>
                          showCopyMessage(
                            isJapanese
                              ? "まとめてコピーしました"
                              : "Copied all together"
                          )
                        }
                      >
                        <button
                          style={{
                            color: "white",
                            marginRight: "5px",
                            backgroundColor: "#1a53ff",
                            border: "none",
                            borderRadius: 10,
                          }}
                        >
                          {isJapanese ? "まとめてコピー" : "Copy all"}
                        </button>
                      </CopyToClipboard>
                    )}

                    {/* コピー時のメッセージ表示 */}
                    {message && (
                      <div
                        style={{
                          marginRight: "5px",
                          backgroundColor: "#4caf50",
                          color: "white",
                          borderRadius: "5px",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                          zIndex: 10,
                        }}
                        className="px-1"
                      >
                        {message}
                      </div>
                    )}
                  </div>

                  <div>
                    <div
                      className="my-3 border p-3"
                      style={{ backgroundColor: "#ffccff", borderRadius: 10 }}
                    >
                      <h3>HTML</h3>
                      <code>{HTMLCode}</code>
                    </div>

                    <div
                      className="my-3 border p-3"
                      style={{ backgroundColor: "#ffff99", borderRadius: 10 }}
                    >
                      <h3>CSS</h3>
                      <code>{CSSCode}</code>
                    </div>
                    <div
                      className="my-3 border p-3"
                      style={{ backgroundColor: "#66e0ff", borderRadius: 10 }}
                    >
                      <h3>JavaScript</h3>
                      <code>{JSCode}</code>
                    </div>
                  </div>
                </div>
              </section>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </MDBContainer>
  );
}
