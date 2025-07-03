import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput";
import useWindowSize from "../../utils/useWindowSize";
import apiRequest from "../../utils/request";
import LOGOIMG from "../../assets/logo.png";
import "./styles.scss";

const Login = () => {
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: "password" | "username"
  ) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;
    if (!username || !password) {
      setError("Invalid username or password");
      return;
    }
    setIsLoading(true);
    setError("");
    apiRequest({
      action: "/login",
      data: {
        username: formData.username,
        password: formData.password,
      },
      method: "POST",
    })
      .then((res) => {
        if (res?.ret_code !== 0) {
          setError(res?.error as string);
          return;
        }
        navigate("/games");
        localStorage.setItem("user", JSON.stringify(res?.user));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={`login-container ${isMobile ? "mobile" : ""}`}>
      <div className="logo">
        <img src={LOGOIMG} />
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error">{error}</div>}
        <TextInput
          label="Login"
          type="text"
          value={formData.username}
          onChange={(e) => handleChange(e, "username")}
          hasValue={!!formData.username}
        />
        <TextInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange(e, "password")}
          hasValue={!!formData.password}
        />
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? (
            <div className="loading-icon">
              <i className="iconfont icon-loading " />
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
