import React, { useContext, useEffect, useState } from "react";
import "./UserProfile.css";
import AuthContext from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import cameraImg from "../../assets/camera.svg";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
function UserProfile() {
  const [userData, setUserData] = useState([]);
  const Navigate = useNavigate();
  const [updatedFile, setUpdatedFile] = useState(null);
  const [newDOB, setNewDOB] = useState("");
  const [loading, setLoading] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [updatedImg, setUpdatedImg] = useState(null);
  let { authToken } = useContext(AuthContext);
  useEffect(() => {
    get_user_data();
  }, []);
  const userInfo = { newDOB, newBio };
  const get_user_data = async () => {
    setLoading(true);
    let response = await fetch("http://127.0.0.1:8000/get_user_profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.refresh}`,
      },
    });
    let data = await response.json();
    console.log(data);
    setUserData(data);
    setNewBio(data.bio);
    setNewDOB(data.dob);
    setLoading(false);
  };

  const handleImageUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setUpdatedFile(file);
    setUpdatedImg(URL.createObjectURL(file));
  };

  const handleDOBChange = (event) => {
    event.preventDefault();
    const newDOB = event.target.value;
    setNewDOB(newDOB);
  };

  const handleBioChange = (event) => {
    // event.preventDefault();
    const updatedBio = event.target.value;
    setNewBio(updatedBio);
  };

  const handleRecoveryEmail = (event) => {
    event.preventDefault();
    const recoveryEmail = event.target.value;
    setRecoveryEmail(recoveryEmail);
  };

  const handleEditProfile = async (event) => {
    event.preventDefault();
    let formdata = new FormData();
    if (updatedFile !== null) {
      formdata.append("image", updatedFile);
    }
    formdata.append("dob", userInfo.newDOB);
    formdata.append("bio", userInfo.newBio);

    for (let [key, value] of formdata.entries()) {
      console.log(value);
    }

    let response = await fetch("http://127.0.0.1:8000/edit_profile/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.refresh}`,
      },
      body: formdata,
    });

    Navigate("/MyProfile");
    toast.success("Profile updated successfully");
  };

  return (
    <div className="relative profileBox bg-[#0F2A36] pt-5">
      <div>
        <Toaster position="top-right" />
      </div>
      {loading ? (
        <div>
          <div className="flex justify-center items-center pt-32">
            <LoadingSpinner height="60px" width="60px" />
          </div>
          <div className="flex justify-center items-center">
            <p className="text-white my-4 text-xl">Loading your profile...</p>
          </div>
        </div>
      ) : (
        <>
        <div className="absolute top-5 left-5">
              <NavLink to="/" className="text-2xl no-underline w-full font-Inter text-white">
                <span className="text-green-400">Be</span>Community
              </NavLink>
          </div>
          <div className="w-2/3 border border-gray-500 shadow-xl rounded-lg py-3 mx-auto">
            <div className="px-4">
              <div className="w-full flex justify-center items-center">
                <div className="w-1/3">
              {updatedImg ? (
                <div className="mb-2 relative">
                  <img
                    className="relative user-profile-img border-2 border-gray-400 shadow-xl"
                    height="400px"
                    width="400px"
                    src={updatedImg}
                    alt=""
                  />

                  <Tooltip
                    className="transition delay-40 ease-in duration-400 bg-[#0e394b] text-white"
                    title="Choose image"
                    arrow
                  >
                    <div className="absolute left-44 bottom-5 camera-img">
                      <label htmlFor="file" className="cursor-pointer">
                        <img src={cameraImg} alt="" />
                        <input
                          type="file"
                          id="file"
                          name="image"
                          onChange={handleImageUpload}
                          accept="image/*"
                          hidden
                        />
                      </label>
                    </div>
                  </Tooltip>
                  <br />
                </div>
              ) : (
                <div className="mb-2 relative">
                  <img
                    className="relative user-profile-img border-2 border-black shadow-xl"
                    height="400px"
                    width="400px"
                    src={`data:image/jpeg;base64,${userData.image}`}
                    alt=""
                  />

                  <Tooltip
                    className="transition delay-40 ease-in duration-400 bg-[#0e394b] text-white"
                    title="Choose image"
                    arrow
                  >
                    <div className="absolute left-44 bottom-5 camera-img">
                      <label htmlFor="file" className="cursor-pointer">
                        <img src={cameraImg} alt="" />
                        <input
                          type="file"
                          id="file"
                          name="image"
                          onChange={handleImageUpload}
                          accept="image/*"
                          hidden
                        />
                      </label>
                    </div>
                  </Tooltip>
                  <br />
                </div>
              )}
              </div>
              <div className="w-2/3 flex-col">
                  <div className="text-white text-xl"> {userData.username} </div>
                  <div className="text-white text-xl"> {userData.bio} </div>
              </div>
              </div>
              <div className="mt-2 font-Inter">
                <form>
                  <label className="font-medium text-xl text-white" htmlFor="dob">
                    Birth Date
                  </label>
                  <br />
                  <input
                    className="mt-2 mb-3 p-2 rounded-lg bg-[#0e394b] text-white text-lg"
                    type="date"
                    value={newDOB ? newDOB : userData.dob}
                    onChange={handleDOBChange}
                  />
                  <br />
                  <label className="font-medium text-xl text-white" htmlFor="Bio">
                    Bio
                  </label>
                  <br />
                  <textarea
                    className="mt-2 mb-3 min-h-[60px] p-2 rounded-lg bg-[#0e394b] text-white text-lg"
                    type="text"
                    value={newBio !== "null" ? userData.bio : ""}
                    onChange={handleBioChange}
                  />

                  <br />
                  <div className="flex flex-start items-center">
                    <button
                      onClick={handleEditProfile}
                      className="my-2 rounded-[12px] bg-[#03C988] hover:bg-[#08a36f]"
                      type="submit"
                    >
                      <div className="px-4 py-2 text-black font-Inter font-semibold">
                        Save Changes
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserProfile;
