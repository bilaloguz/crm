import axios from "axios";
import cors from "cors";
import constants from "./constants";

function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  return fetch(constants.API_URL + "login", requestOptions)
    .then((response) => response.json())
    .then((data) => localStorage.setItem("user", JSON.stringify(data)));
}

const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user;
};

const GetUsers = async () => {
  let res = await axios.get(constants.API_URL + "user");
  let promise = new Promise((resolve, reject) => {
    if (res) resolve(res.data);
  });
  return promise;
};

export default {
  login,
  getCurrentUser,
  GetUsers,
};
