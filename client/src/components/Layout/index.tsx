import { Outlet } from "react-router-dom";
import Header from "../Header";
import "./styles.scss";

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
