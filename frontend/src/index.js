import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import CatalogueView from "./views/CatalogueView";
import ErrorView from "./views/ErrorView";
import LoginView from "./views/LoginView";
import OptionsView from "./views/OptionsView";
import SearchView from "./views/SearchView";
import ReaderView, { pdfUrlLoader } from "./views/ReaderView";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./index.scss";

function PrivateRoute({ children }) {
  const {currentUser} = useAuth();
  return currentUser ? children : <Navigate to='/login' />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute><CatalogueView /></PrivateRoute>,
    errorElement: <ErrorView />
  },
  {
    path: '/login',
    element: <LoginView />
  },
  {
    path: '/catalogue',
    element: <PrivateRoute><CatalogueView /></PrivateRoute>
  },
  {
    path: '/search',
    element: <PrivateRoute><SearchView /></PrivateRoute>
  },
  {
    path: '/options',
    element: <PrivateRoute><OptionsView /></PrivateRoute>
  },
  {
    path: '/reader/:pdfUrl',
    element: <PrivateRoute><ReaderView /></PrivateRoute>,
    loader: pdfUrlLoader
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={ router } />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
