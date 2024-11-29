import NavigationBar from "../common/NavigationBar";
import { Outlet } from "react-router-dom";
//common
import ScrollToTop from "../common/ScrollTop";

export default function Home() {
  return (
    <>
      <ScrollToTop />
      <NavigationBar />
      <Outlet />
    </>
  );
}
