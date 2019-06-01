import React from "react";
import { Router } from "@reach/router";
import Loadable from "react-loadable";
//import styles from "../../styles.css";

const Loading = ({ error, pastDelay }) => {
  if (error) {
    return <div>Error!</div>;
  } else if (pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
};

const Dashboard = Loadable({
  loader: () => import(/* webpackChunkName: "dashboard" */ "../Dashboard"),
  loading: Loading,
  delay: 300
});

const Home = Loadable({
  loader: () => import(/* webpackChunkName: "home" */ "../Home"),
  loading: Loading,
  delay: 300
});

export default () => (
  <Router>
    <Home path="/" />
    <Dashboard path="/dashboard" />
  </Router>
);
