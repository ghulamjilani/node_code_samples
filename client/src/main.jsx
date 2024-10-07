import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline } from "@mui/material";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssBaseline />

    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
