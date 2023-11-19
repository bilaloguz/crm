import React, { useState } from "react";
import AuthService from "./Services/authService";



function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    AuthService.login(username, password).then(
      () => {
        console.log(props);
        // props.history.push("/profile");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        setMessage(resMessage);
        document.getElementById("message").innerHTML="Wrong Password or username";
      }
    );

  };

  return (
    <div className="login-container">
      <div className="form-signin shadow bg-light">
        <h1 style={{ fontWeight: "lighter" }}>Please Log In</h1>
        <p className="fw-lighter login-message" id="message"></p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label form-label-sm">Username</label>
            <input
              type="text"
              className="form-control form-control-sm rounded-0"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label form-label-sm">Password</label>
            <input
              type="password"
              className="form-control form-control-sm rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary btn-sm rounded-0 float-end"
            >
              Submit
            </button>
            <div className="clearfix"></div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
