import React from "react";
import { NavLink } from "react-router-dom";
const SideMenu = () => {
  return (
    <div className="sidebar py-3">
      <ul className="side-nav">
        <li className="side-nav-item">
          <NavLink to="/settings/dashboard" className="side-nav-link">
            Dashboard
          </NavLink>
        </li>
        <li className="side-nav-item">
          <NavLink to="/settings/users" className="side-nav-link">
            Users
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
