// Файл index.js — точка входа JavaScript. Внутри этого файла подключают корневой компонент App.

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

// render - функция обрабатывает JSX и отрисовывает результат в DOM -  в root
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
