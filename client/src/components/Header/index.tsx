import { useNavigate } from "react-router-dom";
import apiRequest from "../../utils/request";
import useGameStore from "../../store/gameStore";
import LOGOIMG from "../../assets/logo.png";
import "./styles.scss";

const Header = () => {
  const navigate = useNavigate();

  const { actions } = useGameStore();

  const handleLogout = async () => {
    const res = await apiRequest({ action: "/logout", method: "GET" });
    if (res?.ret_code !== 0) {
      alert(res?.error);
      return;
    }
    actions.resetStore();
    navigate("/login");
    localStorage.clear();
  };
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : "";
  return (
    <header className="header-container">
      <div className="logo">
        <img src={LOGOIMG} alt="Logo" />
      </div>
      <div className="user-info">
        <span>{user.username}</span>
        <button onClick={handleLogout} className="logout">
          <i className="iconfont icon-user" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
