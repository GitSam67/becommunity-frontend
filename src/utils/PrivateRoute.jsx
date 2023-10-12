import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Welcomepage from "../pages/WelcomePage/Welcomepage";
import ChooseInterestScreen from "../components/ChooseInterestScreen/ChooseInterestScreen";
import { useState } from "react";

export const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  // useEffect(() => {
  //   getIsOnBoard();
  // }, []);

  const getIsOnBoard = async () => {
    let response = await fetch("http://localhost:8000/getIsOnboard/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.refresh}`,
      },
    });

    let data = await response.json();
    console.log(data)
    return data;
  };
  return user ? (
    getIsOnBoard() ? (
      <Outlet />
    ) : (
      <ChooseInterestScreen />
    )
  ) : (
    <Welcomepage />
  );
};
