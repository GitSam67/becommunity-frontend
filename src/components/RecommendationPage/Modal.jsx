import { React, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Modal.css";
import { AiOutlineCheckCircle } from "react-icons/ai";
import testImg from "../../assets/maksim-istomin-BSx5n20J-qg-unsplash.jpg";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function Modal({ closeModal, interestvalues }) {
  const navigate = useNavigate();
  const [interestdata, setInterestData] = useState([]);
  const { csrftoken } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const [screenLoading, setScreenLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  let [c_id, setCId] = useState([]);
  let [d_id, setDId] = useState([]);

  const close = (e) => {
    e.preventDefault();
    closeModal(false);
  };

  // Function to handle checkbox changes
  const [communities, setCommunities] = useState([]);
  const [recentlyJoinedCommunities, setJoinedCommunities] = useState([]);
  const [checkStates, setCheckBoxState] = useState([]);
  // Separate function to handle checkbox change
  const handleCheckboxChange = (id) => (event) => {
    event.preventDefault();
    const isChecked = event.target.checked;
    if (isChecked) {
      setJoinedCommunities((prevCommunities) => [...prevCommunities, id]);
    } else {
      setJoinedCommunities((prevCommunities) =>
        prevCommunities.filter((communityId) => communityId !== id)
      );
    }
    console.log(id);
  };

  useEffect(() => {
    get_communities();
  }, [interestvalues]);

  const handleCheckBoxes = () => {
    const checkboxStates = Object.values(communities).flatMap((array) =>
      array.map((community) => ({
        id: community.id,
        isChecked: recentlyJoinedCommunities.includes(community.id),
      }))
    );
    console.log(checkboxStates);
    setCheckBoxState(checkboxStates);
  };

  useEffect(() => {
    handleCheckBoxes();
  }, [recentlyJoinedCommunities]);

  let get_communities = async () => {
    console.log(interestvalues);
    setScreenLoading(true);
    let response = await fetch("http://127.0.0.1:8000/get_community/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ data: interestvalues }),
    });
    let data = await response.json();
    console.log(data);
    setCommunities(data);
    setScreenLoading(false);
    console.log(communities);
  };

  // const join = async (id) => {
  //   setJoinLoading(true);
  //   setDId([...d_id, id]);
  //   let response = await fetch("http://127.0.0.1:8000/join/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${authToken.refresh}`,
  //       "X-CSRFToken": csrftoken,
  //     },
  //     body: JSON.stringify({
  //       id: id,
  //     }),
  //   });
  //   let data = await response.json();
  //   setJoinLoading(false);
  //   console.log(data);
  //   if (data.status === 201) {
  //     setCId([...c_id, id]);
  //   } else if (data.status === 403) {
  //     setCId([...c_id, id]);
  //   }
  // };

  const handleCommunityJoin = async () => {
    let response = await fetch("http://127.0.0.1:8000/join/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.refresh}`,
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ data: recentlyJoinedCommunities }),
    });

    let data = await response.json();
    console.log(data);
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="Modal bg-gray-700 bg-opacity-60 backdrop-filter backdrop-blur-sm z-30 w-full py-5 fixed flex justify-center h-screen items-center">
      <div className="ModalContainer h-screen relative md:w-1/2 w-full md:mx-0 mx-5 rounded-lg flex flex-col">
        <div className="flex flex-col items-center py-1 pl-1 rounded-lg">
          <div className="w-full relative font-semibold bold text-white text-2xl">
            <button
              id="close"
              onClick={close}
              className="px-3 pb-2 absolute rounded-lg right-2 top-1 hover:bg-[#1e414f]"
            >
              x
            </button>
          </div>

          <div className="bg-[#0F2A36] rounded-lg model-main-container">
            <div className="font-Inter text-white text-lg p-4 mt-4 ">
              We have selected these communities based on your interest
              available on our platform which you can join.
            </div>
            {screenLoading ? (
              <div className="flex justify-center mt-8 h-screen">
                <LoadingSpinner height="50px" width="50px" />
              </div>
            ) : (
              <div>
                {" "}
                {Object.entries(communities).map(
                  ([category, communityList]) => (
                    <div key={category}>
                      <div className="font-Inter text-white text-lg px-4 pb-3 font-semibold">
                        {category}
                      </div>
                      <div className="flex flex-wrap flex-row mx-4">
                        {communityList.map((community, index) => (
                          <div
                            className="flex flex-col mb-4 mx-2 w-[134px] h-fit bg-[#0A1C24] p-2 rounded-[12px]"
                            key={community.id}
                          >
                            <div className="h-fit">
                              <div className="flex justify-end items-center">
                                <form>
                                  <input
                                    type="checkbox"
                                    name="Community-1"
                                    className="h-5 w-5 cursor-pointer bg-[#0F2A36]"
                                    // checked={recentlyJoinedCommunities.includes(community.id)}
                                    checked={
                                      checkStates.find(
                                        (item) => item.id === community.id
                                      )?.isChecked
                                    }
                                    onChange={handleCheckboxChange(
                                      community.id
                                    )}
                                  />
                                </form>
                              </div>
                              <div className="flex justify-center items-center">
                                {community.image ? (
                                  <img
                                    className="h-[40px] w-[40px] rounded-full"
                                    src={`data:image/jpeg;base64,${community.image}`}
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    className="h-[40px] w-[40px] rounded-full"
                                    src={testImg}
                                    alt=""
                                  />
                                )}
                              </div>
                              <div className="flex justify-center items-center py-2">
                                <div>
                                  <p className="font-Inter text-white text-center font-medium">
                                    {community.name}
                                  </p>
                                </div>
                              </div>

                              {/* <div className="flex justify-center">
                              {community.image ? (
                                <img
                                  className="h-[74px] w-[74px] rounded-full"
                                  src={`http://127.0.0.1:8000${community.image}`}
                                  alt=""
                                />
                              ) : (
                                <img
                                  className="h-[74px] w-[74px] rounded-full"
                                  src={testImg}
                                  alt=""
                                />
                              )}
                            </div>
                            <div className="font-Inter text-white text-center pt-4 font-medium">
                              {community.name}
                            </div>
                            <div className="flex justify-center">
                              <button
                                className=" rounded-[8px] mt-4 mb-1 bg-[#00FF84] hover:bg-[#09ed7f] w-[90%]"
                                onClick={() => join(community.id)}
                              >
                                {c_id.includes(community.id) ? (
                                  <div className="py-[4px] font-Inter text-black flex items-center justify-center font-semibold">
                                    <div className="mr-2">Joined</div>
                                    <AiOutlineCheckCircle
                                      size={16}
                                      color="black"
                                      className="mr-1"
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    {joinLoading &&
                                    d_id.includes(community.id) ? (
                                      <div className="py-[2px] mb-2 mt-1 flex justify-center">
                                        <LoadingSpinner
                                          height="16px"
                                          width="16px"
                                        />
                                      </div>
                                    ) : (
                                      <div className="py-[4px] font-Inter font-semibold">
                                        Join
                                      </div>
                                    )}
                                  </div>
                                )}
                              </button>
                            </div> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}{" "}
                <div className="w-full bg-[#0F2A36] text-center sticky bottom-0">
                  <button
                    onClick={handleCommunityJoin}
                    id="goto-homepage-btn"
                    className="m-2 rounded-[12px] bg-[#03C988] hover:bg-[#08a36f]"
                    type="submit"
                  >
                    <div className="px-5 py-2 text-md text-black font-Inter font-semibold">
                      Next <i className="fa fa-arrow-right ml-1"></i>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
