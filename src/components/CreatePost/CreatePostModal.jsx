import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import "./CreatePost.css";
import "./CreatePostModal.css";
import Tooltip from "@mui/material/Tooltip";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function CreatePostModal({ closeModal }) {
  const [file, setFile] = useState("");
  const [fileBtn, setFileBtn] = useState(false);
  const [communities, setCommunities] = useState([]);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const close = (e) => {
    e.preventDefault();
    closeModal(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    get_joined_communities();
  }, []);

  const get_joined_communities = async () => {
    let response = await fetch(
      "http://127.0.0.1:8000/get_user_joined_community/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.refresh}`,
        },
      }
    );
    let data = await response.json();
    console.log("communities joined", data);
    setCommunities(data);
  };

  const handleCreatePost = async (data) => {
    let formdata = new FormData();
    formdata.append("title", data["post-title"]);
    formdata.append("description", data["post-description"]);
    formdata.append("community", data["post-community"]);
    if (data["post-image"][0] !== undefined) {
      formdata.append("image-url", data["post-image"][0]);
    }
    for (let [key, value] of formdata.entries()) {
      console.log(value);
    }
    let response = await fetch("http://127.0.0.1:8000/create-post/", {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken.refresh}`,
      },
      body: formdata,
    });
    let responseData = await response.json();
    console.log(responseData);
    closeModal();
    window.location.reload();
  };

  const fileUpload = (e) => {
    e.preventDefault();
    
    console.log(e.target.files[0]);

    setFile(e.target.files[0]);
    setFileBtn(true);
}

  return (
    <div className="Modal bg-gray-700 bg-opacity-60 backdrop-filter backdrop-blur-sm z-30 w-full py-5 fixed flex justify-center h-screen items-center">
      <div className="ModalContainer h-screen relative md:w-1/2 w-full md:mx-0 mx-5 rounded-lg flex flex-col">
        <div className="flex flex-col items-center py-1 pl-1 rounded-lg">
          <div className="w-full relative font-semibold bold text-white text-2xl">
            <button
              id="close"
              onClick={close}
              className="px-3 pb-2 absolute rounded-lg right-3 top-2 hover:bg-[#1e414f]"
            >
              x
            </button>
          </div>

          <div className="bg-[#0F2A36] rounded-lg w-full model-main-container pb-3 px-3 border-2 border-gray-300">
            <div className="font-Inter text-white">
              <div className="pl-[16px] pt-4 pb-2 text-2xl w-fit px-10 mb-3">
                Create <span className="text-green-400">a</span> Post
              </div>
              <hr className="m-0 p-0 text-gray-100"/>
              <form onSubmit={handleSubmit(handleCreatePost)}>
                <div className="title">
                  <input
                    className="title-input border-l border-b border-gray-500 shadow-xl focus:border-l-0 focus:border-t-0"
                    placeholder="Title"
                    type="text"
                    {...register("post-title", { required: true })}
                  />
                </div>
                <div className="description">
                  <textarea
                    className="description-input border-l border-b border-gray-500 shadow-xl focus:border-l-0 focus:border-t-0"
                    placeholder="Description"
                    type="text"
                    {...register("post-description", { required: true })}
                  />
                </div>
                <div className="community">
                  <select
                    id="dropdown"
                    className="community-dropdown-menu shadow-xl"
                    {...register("post-community", { required: true })}
                  >
                    <option value="">-- Select --</option>
                    {communities.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="post-image ml-3 mt-3">
                  <Tooltip className="transition delay-40 ease-in duration-400 bg-[#0B222C] text-gray-200" title="Attach file" arrow>
                      <label htmlFor="file" className="cursor-pointer rounded-lg border-l border-b border-gray-500 shadow-xl">
                        <div className="flex pt-2 px-2">
                          <i className="fa fa-link text-lg" /><p className="text-gray-200 text-md mx-2">{fileBtn == true ? file.name : "Attach file"}</p>
                        </div>
                        <input className="post-image-input" type="file" id="file" name="file" onChangeCapture={fileUpload} {...register("post-image")} accept="image/*" hidden />
                      </label>
                  </Tooltip>
                </div>
                <div className="ml-3 mt-4 text-center">
                  <button
                    className="bg-[#fff] p-2 px-4 rounded-lg text-black hover:bg-green-400"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModal;
