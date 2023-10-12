import React, { useContext, useEffect, useState, useRef } from "react";
import { Routes, useNavigate, useParams } from "react-router-dom";
import "../HomePageScreen/HomePageScreen.css";
import "./CommunityPage.css";
import Tooltip from "@mui/material/Tooltip";
import AuthContext from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CreateCommunityPostModal from "../CreatePost/CreateCommunityPostModal";
import HomepageNavbar from "../HomePageScreen/HomepageNavbar";
import HomepageSidebar from "../HomePageScreen/HomepageSidebar";
import communityTestImg from "../../../public/infoImage3.jpg";
import CommunityRightSideBar from "./CommunityRightSideBar";
import { NavLink, Route } from "react-router-dom";
import Posts from "./Posts";
import Chats from "./Chats";
import ChatContext from "../../context/ChatContext";
function CommunityPage() {
  const {getRoom} = useContext(ChatContext)
  const [open, setOpen] = useState(false);
  const [postBtn, setPostBtn] = useState(false);
  // const [communityName, setCommunityName] = useState("");
  const [communityInfo, setCommunityInfo] = useState([]);
  const { authToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [communityId, setCommunityId] = useState("");
  const [joinedCommunityList, setJoinedCommunityList] = useState([]);
  const [joined, setJoined] = useState(false);
  const [communityJoinLoading, setCommunityJoinLoading] = useState(false);
  const { csrftoken } = useContext(AuthContext);
  const [recentlyJoined, setRecentlyJoined] = useState(false);
  useEffect(() => {
    const storedId = localStorage.getItem("communityId");
    if (storedId) {
      setCommunityId(storedId);
    }
  });
  const get_community_info = async () => {
    setLoading(true);
    let response = await fetch(
      `http://localhost:8000/get_one_community_info/${communityId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken.refresh}`,
        },
      }
    );
    let data = await response.json();
    console.log(data);
    setCommunityInfo(data.community);

    setLoading(false);
  };

  const get_joined_communityList = async () => {
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
    setJoinedCommunityList(data);
  };

  useEffect(() => {
    get_joined_communityList();
  }, []);

  useEffect(() => {
    get_community_info();
  }, [communityId]);

  useEffect(() => {
    const isCommunityJoined = joinedCommunityList.some(
      (community) => community.id == communityId
    );
    if (isCommunityJoined) {
      setJoined(true);
    } else {
      setJoined(false);
    }
  }, [joinedCommunityList, communityId]);
  

  const [activeLink, setActiveLink] = useState("posts");
  const handleNavLinkClick = (link) => {
    setActiveLink(link);
    getRoom(communityInfo.id)
    console.log(communityInfo.name);
  };

  const createPost = (e) => {
    e.preventDefault();
    setPostBtn(true);
  };

  const handleModalClose = () => {
    setPostBtn(false);
    get_post();
  };

  const handleCommunityJoin = async () => {
    setCommunityJoinLoading(true);
    const commid = parseInt(communityId, 10);
    let response = await fetch("http://127.0.0.1:8000/join/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.refresh}`,
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ data: [commid] }),
    });

    let data = await response.json();
    if (data.status === 201) {
      setRecentlyJoined(true);
    }
    setCommunityJoinLoading(false);
    window.location.reload();
  };
  

  return (
    <>
      {postBtn && <CreateCommunityPostModal closeModal={handleModalClose} />}

      <div className="bg-[#0F2A36]">
        <HomepageNavbar open={open} setOpen={setOpen} />

        <div
          style={{ justifyContent: open ? "space-between" : "space-around" }}
          className="w-full flex bg-[#0F2A36]"
        >
          <div>
            <HomepageSidebar open={!open} />
          </div>

          <div className={`w-[75%] z-10 bg-[#0F2A36] rounded-lg `}>
            {loading ? (
              <div class="shadow rounded-md p-2 mx-2 my-1 w-1/5 ">
                <div class="animate-pulse flex space-x-2">
                  <div class="rounded-full bg-slate-200 h-10 w-10"></div>
                  <div class="flex-1 space-y-2 py-2">
                    <div class="h-2 bg-slate-200 rounded"></div>
                    <div class="space-y-2">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between border-[#304953] border-b-2">
                <div className=" font-Inter text-white flex flex-row">
                  <div className="mt-2 mb-2 mx-3">
                    <img
                      src={`data:image/jpeg;base64,${communityInfo.image}`}
                      className="community-header-image"
                      alt=""
                    />
                  </div>
                  <div className="my-[15px] text-lg font-semibold">
                    {communityInfo.name}
                  </div>
                </div>
                {!joined ? (
                  <button
                    onClick={handleCommunityJoin}
                    className="text-white flex justify-center items-center font-Inter font-medium  mx-6"
                  >
                    {!recentlyJoined ? (
                      <div className="px-4 py-[4px] rounded-[18px] bg-green-600 hover:bg-green-700">
                        {communityJoinLoading ? (
                          <div>
                            {" "}
                            <LoadingSpinner height="14px" width="14px" />
                          </div>
                        ) : (
                          <div>Join</div>
                        )}
                      </div>
                    ) : (
                      <div className="px-4 py-[4px] rounded-[18px] border border-white">
                        <div>Joined</div>
                      </div>
                    )}
                  </button>
                ) : null}
              </div>
            )}

            <div className="flex justify-around w-full font-Inter font-medium text-white mt-[8px] text-md mx-3">
              <div className="flex justify-center items-center w-1/2">
                <div
                  style={{
                    borderBottom:
                      activeLink === "posts" ? "2px #03C988 solid" : null,
                    width: "70%",
                    textAlign: "center",
                    paddingBottom: "5px",
                  }}
                >
                  <NavLink
                    className="community-nav-links"
                    style={{
                      color: activeLink === "posts" ? "#03C988" : "#fff",
                    }}
                    isActive={() => activeLink === "posts"}
                    onClick={() => handleNavLinkClick("posts")}
                  >
                    Posts
                  </NavLink>
                </div>
              </div>
              <div className="flex justify-center items-center w-1/2">
                <div
                  style={{
                    borderBottom:
                      activeLink === "chat" ? "2px #03C988 solid" : null,
                    width: "70%",
                    textAlign: "center",
                    paddingBottom: "5px",
                  }}
                >
                  <NavLink
                    className="community-nav-links"
                    style={{
                      color: activeLink === "chat" ? "#03C988" : "#fff",
                    }}
                    isActive={() => activeLink === "chat"}
                    onClick={() => handleNavLinkClick("chat")}
                  >
                    Chats
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end items-center">
              {joined && activeLink === "posts" ? (
                <div className="font-Inter z-30 fixed bottom-7 rounded-full shadow-xl bg-green-600 py-2 mr-4">
                  <button
                    onClick={createPost}
                    className="flex flex-row items-center text-md font-black text-white font-bold text-center p-2"
                  >
                    <i class="fa-regular fa-pen-to-square fa-fade fa-lg text-white m-1"></i>
                    <span className="mx-1">Create Post</span>
                  </button>
                </div>
              ) : null}
            </div>

            {/* <div className="w-full z-20 fixed bottom-0 h-9 bg-[#0F2A36]"></div> */}
            
            <div className="mt-3">
              {activeLink === "posts" ? <Posts open={open} /> : <Chats />}
            </div>
          </div>
          <CommunityRightSideBar />
        </div>
      </div>
    </>
  );
}

export default CommunityPage;
