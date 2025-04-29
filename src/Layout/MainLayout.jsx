import Welcome from "../components/Welcome";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Welcome />
      <Outlet />
    </>
  );
}

export default MainLayout;
