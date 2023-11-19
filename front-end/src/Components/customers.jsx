import React, { useEffect, useState } from "react";
// import authService from "../Services/authService";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import userService from "../Services/customerService";
import ManageUser from "./manageUser";
import customerService from "../Services/customerService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [edit, setEdit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerChanged, setCustomerChanged] = useState(false);

  const deleteHandler = async (e) => {
    let confirmAction = window.confirm(
      `Are you sure to delete this User : ${e.name}?`
    );
    if (confirmAction) {
      let deletedCustomer = await customerService.deleteCustomer(e);
      if (deletedCustomer === 200) {
        let tCustomers = await customerService.getCustomers();
        if (tCustomers.status === 200) {
          setCustomers(tCustomers.data);
          toast.success(e.name + " deleted!");
        }
      } else toast.error("error");
    }
  };

  useEffect(async () => {
    let customers = await customerService.getCustomers();
    if (customers.status === 200) {
      setCustomers(customers.data);
    }
  }, [customerChanged]);

  const editHandler = (e) => {
    handleShow();
    setEdit(true);
    console.log(e);
    setSelectedCustomer(e);
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

  const getCustomers = async () => {
    let customers = await customerService.getCustomers();
    if (customers.status === 200) {
      setCustomers(customers.data);
    }
  };

  useEffect(() => {
    getCostumers();
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
                <th>Name</th>
                <th>Company</th>
                <th>Title</th>
                <th>e-mail</th>
                <th>Phone</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((e) => (
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
                    {e.name}
                  </td>
                  <td>{e.name}</td>
                  <td>{e.company}</td>
                  <td>{e.title}</td>
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
            selected={selectedCustomer}
            setSelectedUser={setSelectedCustomer}
            userChanged={customerChanged}
            setUserChanged={setCustomerChanged}
          />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Customers;
