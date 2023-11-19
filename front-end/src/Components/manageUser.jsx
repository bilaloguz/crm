import React, { useState, useEffect } from "react";
import userService from "../Services/userService";
import { toast } from "react-toastify";

const ManageUser = (props) => {
  const [newUser, setNewUser] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.edit) {
      newUser.id = props.selected.id;
      let updateUser = await userService.UpdateUser(newUser);
      if (updateUser === 200) {
        toast.success(props.selected.username + " updated");
        props.setUserChanged(!props.userChanged);
        props.handleClose();
      } else {
        toast.error("error");
      }
    } else {
      let addUser = await userService.AddUser(newUser);
      if (addUser === 200) {
        toast.success(newUser.username + " added!");
        props.setUserChanged(!props.userChanged);
        props.handleClose();
      } else toast.error("error");
    }
  };

  useEffect(() => {
    if (!props.edit) props.setSelectedUser({});
  }, []);

  // const handleAdd = () => {
  //   if (isSubmitted) {
  //     props.handleClose();
  //   } else {
  //     toast.error("please submit the required fields");
  //   }
  // };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 row">
        <label htmlFor="username" className="col-sm-4 col-form-label">
          username
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control form-control-sm"
            id="username"
            defaultValue={props.edit ? props.selected.username : ""}
            onChange={(e) => (newUser.username = e.target.value)}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label htmlFor="password" className="col-sm-4 col-form-label">
          Password
        </label>
        <div className="col-sm-8">
          <input
            type="password"
            className="form-control form-control-sm"
            id="password"
            onChange={(e) => (newUser.password = e.target.value)}
            defaultValue={props.edit ? props.selected.password : ""}
            // disabled={props.edit}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label htmlFor="email" className="col-sm-4 col-form-label">
          Email
        </label>
        <div className="col-sm-8">
          <input
            required
            type="email"
            className="form-control"
            id="email"
            onChange={(e) => (newUser.email = e.target.value)}
            defaultValue={props.edit ? props.selected.email : ""}
            // disabled={props.edit}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label htmlFor="mobile" className="col-sm-4 col-form-label">
          Phone
        </label>
        <div className="col-sm-8">
          <input
            type="number"
            className="form-control form-control-sm"
            id="mobile"
            onChange={(e) => (newUser.phone = e.target.value)}
            defaultValue={props.edit ? props.selected.phone : ""}
            // disabled={props.edit}
          />
        </div>
      </div>
      <div className="mb-3 buttons-container">
        <button
          type="reset"
          onClick={props.handleClose}
          className="btn btn-sm btn-warning  mx-4 px-3"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-success btn-sm   px-4">
          {props.edit ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
};

export default ManageUser;
