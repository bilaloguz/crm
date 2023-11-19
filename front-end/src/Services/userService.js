import constants from "./constants";
import axios from "axios";

const GetUsers = async () => {
  try {
    let users = await axios.get(constants.API_URL + "user");
    return users;
  } catch (e) {
    console.log(e);
    return e;
  }
};

async function DeleteUser(user) {
  try {
    let deleteUser = await axios.delete(constants.API_URL + "user/" + user.id);
    return deleteUser.status;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function AddUser(user) {
  try {
    let addUser = await axios.post(constants.API_URL + "user", user);
    return addUser.status;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function UpdateUser(user) {
  try {
    let updateUser = await axios.put(
      constants.API_URL + "user/" + user.id,
      {
        "username": user.username,
        "password": user.password,
        "email": user.email,
        "phone": user.phone
      },
      {
        headers:  {'Content-Type': 'application/json'}
      } 
      );
    return updateUser.status;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export default {
  DeleteUser,
  AddUser,
  UpdateUser,
  GetUsers,
};
