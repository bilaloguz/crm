import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SideMenu from "../Components/SideMenu";
import Users from "../Components/Users";
import Dashboard from "../Components/Dashboard";

const Settings = () => {
  return (
    <div className="d-flex align-items-stretch">
      <BrowserRouter>
        <SideMenu />
        <div className="content-page">
          <div className="container-fluid px-lg-4 px-xl-5">
            <Switch>
              <Route path="/settings/dashboard" component={Dashboard} />
              <Route path="/settings/users" component={Users} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};
export default Settings;
