import React, { useState } from "react";

export default function FileUpload({ imageSrc, setImageSrc }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // 許可されるMIMEタイプのリスト
    const allowedTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/svg+xml",
      "image/webp",
      "image/vnd.microsoft.icon", // ico の MIMEタイプ
    ];

    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert(
        "許可されている画像形式（png, jpg, jpeg, svg, webp, ico）のファイルをアップロードしてください"
      );
    }
  };

  return (
    <div id="image-file">
      <input id="image" type="file" onChange={handleFileChange} />
      {/* {imageSrc && (
            <img
              src={imageSrc}
              alt="アップロードしたファイル"
              style={{ maxWidth: "100%" }}
            />
          )} */}
    </div>
  );
}
