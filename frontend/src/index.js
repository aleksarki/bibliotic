import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import CatalogueView from "./views/CatalogueView";
import ErrorView from "./views/ErrorView";
import OptionsView from "./views/OptionsView";
import SearchView from "./views/SearchView";

import reportWebVitals from "./reportWebVitals";

import "./index.css";

const router = createBrowserRouter([
  {
    path: '/',
    element: <CatalogueView />,
    errorElement: <ErrorView />
  },
  {
    path: '/catalogue',
    element: <CatalogueView />
  },
  {
    path: '/search',
    element: <SearchView />
  },
  {
    path: '/options',
    element: <OptionsView />
  }
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={ router } />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
