import React from "react";
import { Router } from "@reach/router";
import Dashboard from "../Dashboard";
import Home from "../Home";

export default () => (
  <Router>
    <Home path="/" />
    <Dashboard path="/dashboard" />
  </Router>
);
