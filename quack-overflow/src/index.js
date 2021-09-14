import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./navigation/navbar";
import Sidebar from "./navigation/sidebar";
import App from "./app.js";

ReactDOM.render(<Router><Navbar/><Sidebar/><App/></Router>, document.getElementById('root'));