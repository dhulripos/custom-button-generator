import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // ページ遷移時にスクロール位置をトップにリセット
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
