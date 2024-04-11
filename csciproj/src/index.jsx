import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:80";
axios.defaults.withCredentials = true;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);