import constants from "./constants";
import axios from "axios";

async function getCustomers() {
  let res = await axios.get(constants.API_URL + "customer");
  let promise = new Promise((resolve, reject) => {
    resolve(res.data.customersList);
  });
  return promise;
}

async function getCustomer(id) {
  let customer = {};
  try {
    customer = axios.get(constants + "customer/" + id);
  } catch (error) {
    console.log(error);
  }
  return customer;
}

async function createCustomer(customer) {
  try {
    let createdCustomer = await axios.post(constants.API_URL + "customer", customer);
    return createdCustomer.status;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function updateCustomer(customer) {
  try {
    let updateCustomer = await axios.put(
      constants.API_URL + "customer/" + customer.id,
      customer
    );
    return updateCustomer.status;
  } catch (error) {
    return error;
  }
}

async function deleteCustomer(customer) {
  try {
    let deleteCustomer = await axios.delete(
      constants.API_URL + "customer/" + customer.id
    );
    return deleteCustomer.status;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export default {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
