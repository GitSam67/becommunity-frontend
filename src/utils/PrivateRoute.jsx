import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Welcomepage from "../pages/WelcomePage/Welcomepage";
import ChooseInterestScreen from "../components/ChooseInterestScreen/ChooseInterestScreen";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  let [isOnBoard, setIsOnBoard] = useState(null);

  useEffect(() => {
    getIsOnBoard();
  }, []);

  const getIsOnBoard = async () => {
    setLoading(true);
    let response = await fetch("http://localhost:8000/getIsOnboard/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.refresh}`,
      },
    });

    let data = await response.json();
    setIsOnBoard(data);
    setLoading(false);
  };

  // return user ? (
  //   isOnBoard ? (
  //     <Outlet />
  //   ) : (
  //     <ChooseInterestScreen />
  //   )
  // ) : (
  //   <Welcomepage />
  // );

//   return user ? (
//     isOnBoard ? (
//       <Outlet />
//     ) : (
//       <ChooseInterestScreen />
//     )
//   ) : (
//     <Welcomepage />
//   );
// };

  return user ? (
    loading ? (
      <div className="flex justify-center h-screen bg-[#0F2A36]">
        <div style={{marginTop:"140px"}}>
          <LoadingSpinner height="50px" width="50px" />
        </div>
      </div>
    ) : isOnBoard ? (
      <Outlet />
    ) : (
      <ChooseInterestScreen />
    )
  ) : (
    <Welcomepage />
  );
};
