import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./styles.css";
const Login = () => {
  const [username, usernameupdate] = useState("");
  const [password, passwordupdate] = useState("");
  const usenavigate = useNavigate();
  const handleShowPassword = () => {
    const showHiddenPass = (loginPass, loginEye) => {
      const input = document.getElementById(loginPass),
        iconEye = document.getElementById(loginEye);
      iconEye.addEventListener("click", () => {
        if (input.type === "password") {
          input.type = "text";
          iconEye.classList.add("ri-eye-line");
          iconEye.classList.remove("ri-eye-off-line");
        } else {
          input.type = "password";
          iconEye.classList.remove("ri-eye-line");
          iconEye.classList.add("ri-eye-off-line");
        }
      });
    };
    showHiddenPass("login-pass", "login-eye");
  };
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const ProceedLogin = (e) => {
    e.preventDefault();
    if (validate()) {
      fetch("http://localhost:8000/user/" + username)
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          if (Object.keys(resp).length === 0) {
            toast.error("Please Enter valid username");
          } else {
            if (resp.password === password) {
              toast.success("Success");
              sessionStorage.setItem("username", username);
              sessionStorage.setItem("userrole", resp.role);
              let navigatePath = "/books";
              if (resp.role === "admin") {
                navigatePath = "/admin";
              }
              usenavigate(navigatePath);
            } else {
              toast.error("Please Enter valid credentials");
            }
          }
        })
        .catch((err) => {
          toast.error("Login Failed due to :" + err.message);
        });
    }
  };

  const ProceedLoginusingAPI = (e) => {
    e.preventDefault();
    if (validate()) {
      let inputobj = { username: username, password: password };
      fetch("https://localhost:44308/User/Authenticate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(inputobj),
      })
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          console.log(resp);
          if (Object.keys(resp).length === 0) {
            toast.error("Login failed, invalid credentials");
          } else {
            toast.success("Success");
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("jwttoken", resp.jwtToken);
            usenavigate("/");
          }
        })
        .catch((err) => {
          toast.error("Login Failed due to :" + err.message);
        });
    }
  };
  const validate = () => {
    let result = true;
    if (username === "" || username === null) {
      result = false;
      toast.warning("Please Enter Username");
    }
    if (password === "" || password === null) {
      result = false;
      toast.warning("Please Enter Password");
    }
    return result;
  };
  return (
    <div className="login">
      <form onSubmit={ProceedLogin} className="login__form">
        <h1 className="login__title">Login</h1>
        <div className="login__content">
          <div className="login__box">
            <i className="ri-user-3-line login__icon"></i>
            <div className="login__box-input">
              <input
                value={username}
                onChange={(e) => usernameupdate(e.target.value)}
                className="login__input"
                required
                placeholder=""
              ></input>
              <label htmlFor="" className="login__label">
                User Name
              </label>
            </div>
          </div>
          <div className="login__box">
            <i className="ri-lock-2-line login__icon"></i>
            <div className="login__box-input">
              <input
                type="password"
                value={password}
                onChange={(e) => passwordupdate(e.target.value)}
                className="login__input"
                id="login-pass"
                required
                placeholder=""
              ></input>
              <label htmlFor="" className="login__label">
                Password
              </label>

              <i
                className="ri-eye-off-line login__eye"
                id="login-eye"
                onClick={handleShowPassword}
              ></i>
            </div>
          </div>
        </div>
        <button type="submit" className="login__button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
