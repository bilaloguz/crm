import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import AuthService from "../Services/authService";

function Navbar() {
  const [user, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [showAdmin, setAdmin] = useState(user.role == "user");

  function logout() {
    localStorage.clear();
    window.location.reload(false);
  }
  return (
    <nav className="navbar-dark bg-dark-custom d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start shadow">
      <a href="/" className="navbar-brand col-md-3 col-lg-2 me-0 px-3">
        Aviteng CRM <span>v 0.0.1 Beta</span>
      </a>

      <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 text-white">
        <li>
          <NavLink exact to="/" className="nav-link px-2 link-secondary">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings/dashboard"
            className="nav-link px-2 link-secondary"
          >
            Settings
          </NavLink>
        </li>
      </ul>

      <div className="dropdown navbar-user col-md-1">
        <a
          href="#"
          className="d-block link-secondary text-decoration-none p-1 pe-3 text-white"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-person-circle"></i>{" "}
          <span className="text-white">{user.username}</span>
        </a>
        <ul
          className="dropdown-menu text-small rounded-0 bg-dark-custom-2 mt-1 border-top-0 "
          aria-labelledby="dropdownUser1"
        >
          <li>
            <a className="dropdown-item link-secondary text-white" href="#">
              Profile
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button
              className="dropdown-item link-secondary text-white"
              to="/login"
              onClick={logout}
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
