import React, { useState, useEffect, useContext } from "react";
import Tooltip from "@mui/material/Tooltip";
import AuthContext from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import "./CreateCommunity.css";
import { useNavigate } from "react-router-dom";
import CreatableSelect from 'react-select/creatable';
function CreateCommunity() {
  const [file, setFile] = useState("");
  const [fileBtn, setFileBtn] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);

  const get_categories = async () => {
    let response = await fetch("http://127.0.0.1:8000/get-categories/", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    setCategories(data);
  };
  useEffect(() => {
    get_categories();
  }, []);

  function handleSelectCategories(selectedOptions) {
    const categoryValues = selectedOptions.map((option) => option.value);
    setSelectedCategories(categoryValues);
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleCreateCommunity = async (data) => {
    let formdata = new FormData();
    formdata.append("name", data["community-name"]);
    formdata.append("description", data["community-description"]);
    formdata.append("community-category", JSON.stringify(selectedCategories));
    formdata.append("image-url", data["community-image"][0]);
    for (let [key, value] of formdata.entries()) {
      console.log(value);
    }
    let response = await fetch("http://127.0.0.1:8000/create-community/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.refresh}`,
      },
      body: formdata,
    });
    navigate("/");
  };

  const fileUpload = (e) => {
    e.preventDefault();

    console.log(e.target.files[0]);

    setFile(e.target.files[0]);
    setFileBtn(true);
  }

  return (
    <div className="relative create-community bg-[#0F2A36] pt-5">
      <div className="absolute top-4 left-4 text-2xl font-bold text-white"><span className="text-green-400">Be</span>Community</div>
      <div className="font-Inter text-white border-2 flex-col items-center justify-center w-2/3 py-2 pb-5 rounded-lg border-gray-500 mx-auto">
        <div className="text-center pt-4 pb-3 text-3xl font-semibold">Create <span className="text-green-400">a</span> Community</div>
        <hr className="mt-1 p-0 text-gray-100"/>
        <form onSubmit={handleSubmit(handleCreateCommunity)} className="w-5/6 flex-col justify-center items-center mx-auto">
          <div className="name">
            <input
              className="name-input border-l border-b shadow-2xl border-gray-500"
              placeholder="Community name"
              type="text"
              {...register("community-name", { required: true })}
            />
          </div>
          <div className="description">
            <textarea
              className="description-input border-l border-b shadow-2xl border-gray-500"
              placeholder="Descrbe your community"
              type="text"
              {...register("community-description", { required: true })}
            />
          </div>
          <div className="community-category">
            <CreatableSelect
              className="select-categories"
              options={categories.map((category) => ({
                value: category.name,
                label: category.name,
              }))}
              placeholder="Select Community Category"
              value={selectedCategories.map((category) => ({
                value: category,
                label: category,
              }))}
              onChange={handleSelectCategories}
              isSearchable={true}
              isMulti
            />
          </div>
          {/* <div className="community-image">
            <input
              className="community-image-input ml-3 mt-2"
              type="file"
              {...register("community-image", { required: true })}
            />
          </div> */}
          <div className="bg-[#0B222C] community-image my-4 ml-2">
              <label htmlFor="file" className="bg-[#0B222C] cursor-pointer rounded-lg hover:border-2 border-white">
                <div className="w-52 flex pt-2 px-2">
                  <i className="fa fa-link text-lg" /><p className="text-gray-200 text-lg mx-2">{fileBtn == true ? file.name : "Select a logo"}</p>
                </div>
                <input className="community-image-input" type="file" id="file" name="file" onChangeCapture={fileUpload} {...register("community-image", { required: true })} accept="image/*" hidden />
              </label>
          </div>

          <div className="ml-3 mt-5 text-center">
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
  );
}

export default CreateCommunity;
