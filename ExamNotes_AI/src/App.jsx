import React, { useEffect } from "react";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { Navigate, Route, Routes } from "react-router-dom";
import { getCurrentUser } from "./services/api";
import { useDispatch, useSelector } from "react-redux";
import History from "./pages/History";
import Notes from "./pages/Notes";
import Pricing from "./pages/Pricing";
export const serverUrl = "http://localhost:8000";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  const userData = useSelector((state) => state.user.userData);
  console.log(userData);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={userData ? <Navigate to={"/"} replace /> : <Auth />}
        />
        <Route
          path="/history"
          element={userData ? <History /> : <Navigate to="/auth" />}
        />
        <Route
          path="/notes"
          element={userData ? <Notes /> : <Navigate to="/auth" />}
        />
        <Route
          path="/pricing"
          element={userData ? <Pricing /> : <Navigate to="/auth" />}
        />
      </Routes>
    </>
  );
};

export default App;
