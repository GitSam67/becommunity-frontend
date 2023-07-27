import React, { useContext, useEffect, useState } from "react";
import "./UserProfile.css";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import cameraImg from "../../assets/camera.svg";
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
    let data = await response.json();
    console.log(data);
    Navigate("/MyProfile");
  };

  return (
    <div className="bg-[#0F2A36]">
      {loading ? (
        <div className="flex justify-center items-center pt-8">
          <LoadingSpinner height="60px" width="60px" />
        </div>
      ) : (
        <>
          <div className="font-Inter text-white p-4 text-3xl font-semibold">
            Edit your Profile
          </div>
          <div className="px-4">
            {updatedImg ? (
              <div className="mb-2">
                <img
                  className="user-profile-img"
                  height="400px"
                  width="400px"
                  src={updatedImg}
                  alt=""
                />
                <input type="file" onChange={handleImageUpload} />
                <div className="camera-img">
                  <img src={cameraImg} alt="" />
                </div>

                <br />
              </div>
            ) : (
              <div className="mb-2">
                <img
                  className="user-profile-img"
                  height="400px"
                  width="400px"
                  src={`data:image/jpeg;base64,${userData.image}`}
                  alt=""
                />
                <input type="file" onChange={handleImageUpload} />
                <div className="camera-img">
                  <img src={cameraImg} alt="" />
                </div>
                <br />
              </div>
            )}
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
                  value={newBio}
                  onChange={handleBioChange}
                />
                <br />
                <button
                  onClick={handleEditProfile}
                  className="my-2 rounded-[12px] bg-[#03C988] hover:bg-[#08a36f]"
                  type="submit"
                >
                  <div className="px-4 py-2 text-black font-Inter font-semibold">
                    Save Changes
                  </div>
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserProfile;
