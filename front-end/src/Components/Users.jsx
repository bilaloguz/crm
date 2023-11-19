import React, { useEffect, useState } from "react";
// import authService from "../Services/authService";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import userService from "../Services/userService";
import ManageUser from "./manageUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [edit, setEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [userChanged, setUserChanged] = useState(false);

  const deleteHandler = async (e) => {
    let confirmAction = window.confirm(
      `Are you sure to delete this User : ${e.username}?`
    );
    if (confirmAction) {
      let deletedUser = await userService.DeleteUser(e);
      if (deletedUser === 200) {
        let tUsers = await userService.GetUsers();
        if (tUsers.status === 200) {
          setUsers(tUsers.data);
          toast.success(e.username + " deleted!");
        }
      } else toast.error("error");
    }
  };

  useEffect(async () => {
    let users = await userService.GetUsers();
    if (users.status === 200) {
      setUsers(users.data);
    }
  }, [userChanged]);

  const editHandler = (e) => {
    handleShow();
    setEdit(true);
    console.log(e);
    setSelectedUser(e);
    // directoryService.UpdateDirectory(e);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
    setEdit(false);
  };

  const GetUsers = async () => {
    let users = await userService.GetUsers();
    if (users.status === 200) {
      console.log(users);
      setUsers(users.data);
    }
  };
  useEffect(() => {
    GetUsers();
  }, []);
  return (
    <React.Fragment>
      <div className="card text-white bg-dark rounded-0 shadow mb-3">
        <div className="card-header">
          Users
          <button
            id="addDirectoryButton"
            className="btn btn-sm btn-outline-info rounded-0 float-end mt-3"
            onClick={handleShow}
          >
            Add User
          </button>
        </div>
        <div className="card-body">
          <table className="table table-sm table-dark table-hover table-striped">
            <thead>
              <tr>
                <th>Username</th>
                <th>e-mail</th>
                <th>Phone</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((e) => (
                <tr key={e.id}>
                  <td>
                    <i
                      style={
                        e.id === 1 ? { color: "green" } : { color: "gray" }
                      }
                      className={
                        e.id === 1
                          ? "bi bi-person-fill px-2"
                          : "bi bi-person px-2"
                      }
                    ></i>
                    {e.username}
                  </td>
                  <td>{e.email}</td>
                  <td>{e.phone}</td>
                  <td>
                    <button
                      className="btn btn-sm rounded-0 btn-warning"
                      onClick={() => editHandler(e)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm rounded-0 btn-danger"
                      onClick={() => deleteHandler(e)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal dialogClassName="modal-custom" show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title id="example-custom-modal-styling-title">
            Add User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ManageUser
            edit={edit}
            handleClose={handleClose}
            selected={selectedUser}
            setSelectedUser={setSelectedUser}
            userChanged={userChanged}
            setUserChanged={setUserChanged}
          />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Users;
