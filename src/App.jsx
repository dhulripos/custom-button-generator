//pages
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";

//components
import Works from "./components/Works";
import CustomButtonGenerate from "./components/CustomButtonGenerate";

export default function App() {
  return (
    <Routes>
      {/* ホーム画面へリダイレクト */}
      <Route path="/" element={<Navigate to="/works" replace />} />

      {/* ホーム画面(小作品一覧掲載画面) */}
      <Route path="/works" element={<Home />}>
        <Route path="/works" element={<Works />} />
        {/* 以下、各作品に飛ぶコード例 作品を追加するときは、ここに追加していくイメージ */}
        {/* <Route path="/work/:id" element={<WorksAbout />} /> */}
        <Route
          path="/works/custom-button-generator"
          element={<CustomButtonGenerate />}
        />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
