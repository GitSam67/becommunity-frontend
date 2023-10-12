import React, { useContext, useState, useEffect, useDebugValue } from "react";
import "./HomepageScreen.css";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./HomePageScreen.css";
function HomepageRightSidebar() {
  const [userData, setUserData] = useState([]);
  const { get_user } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const { csrftoken } = useContext(AuthContext);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [createdCommunityCount, setCreatedCommunityCount] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [notJoinedCommunities, setNotJoinedCommunities] = useState([]);
  const [recentlyJoinedCommunities, setRecentlyJoinedCommunities] = useState(
    []
  );
  const getCurrentUser = async () => {
    let data = await get_user();
    console.log(data);
    setUserData(data);
  };

  const handleCommunityJoin = async (communityId) => {
    let response = await fetch("http://127.0.0.1:8000/join/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.refresh}`,
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ data: [communityId] }),
    });
    let data = await response.json();
    if (data.status === 201) {
      console.log(recentlyJoinedCommunities);
      setRecentlyJoinedCommunities((prevCommunities) => [
        ...prevCommunities,
        communityId,
      ]);
    }
  };

  const getCreatedCommunities = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/get_user_joined_community/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.refresh}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setJoinedCommunities(data);

        // Once the data is fetched, call takeCreatedCommunities
      } else {
        // Handle error
        console.error("Failed to fetch joined communities");
      }
    } catch (error) {
      console.error("Error fetching joined communities:", error);
    }
  };

  const takeCreatedCommunities = (communities) => {
    const createdCommunitiesList = communities.filter(
      (community) => community.creator === userData.username
    );

    setCreatedCommunityCount(createdCommunitiesList);
  };
  const filterNotJoinedCommunities = (allCommunities, joinedCommunities) => {
    const notJoinedCommunities = allCommunities.filter((community) => {
      return !joinedCommunities.some(
        (joinedCommunity) => joinedCommunity.id === community.id
      );
    });
    setNotJoinedCommunities(notJoinedCommunities);
  };

  const getAllCommunities = async () => {
    let response = await fetch("http://127.0.0.1:8000/get_all_community/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await response.json();
    setAllCommunities(data);
  };

  useEffect(() => {
    getCurrentUser();
    getCreatedCommunities();
    getAllCommunities();
  }, []);

  useEffect(() => {
    takeCreatedCommunities(joinedCommunities);
  }, [joinedCommunities]);

  useEffect(() => {
    filterNotJoinedCommunities(allCommunities, joinedCommunities);
  }, [allCommunities, joinedCommunities]);
  return (
    <>
      <div className="w-1/4 flex flex-col sidebar-divs">
        <div className="font-Inter flex flex-col shadow-xl z-10 p-2 bg-[#0B222C] rounded-lg sticky overflow-y-auto right-0 top-10 my-4 mx-2">
          <div className="text-white font-semibold px-2 py-1 text-xl">
            {" "}
            {userData.username}{" "} 
          </div>
          {userData.bio ?(<div className="text-[#bbbbbb] p-2 text-lg"> {userData.bio} </div>):null}
          

          <div className="text-[#ACACAC] text-lg px-2">
            {" "}
            <span className="font-medium text-white">
              {" "}
              {createdCommunityCount.length}{" "}
            </span>{" "}
            communities{" "}
          </div>
        </div>
        <div className="font-Inter flex flex-col shadow-xl z-10 p-2 bg-[#0B222C] rounded-lg sticky overflow-y-auto right-0 top-10 m-2 sidebar-divs">
          <div className="text-[#ACACAC] p-2">Communities to Join</div>
          <div className="communitiesData flex flex-col">
            {notJoinedCommunities.length > 0 &&
              notJoinedCommunities.map((community) => (
                <div
                  key={community.id}
                  className="flex justify-between my-1 p-2 rounded-lg items-center hover:bg-[#0F2A36]"
                >
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/community/${community.id}/`}
                  >
                    <div className="flex items-center">
                      <div className="mx-2">
                        <img
                          src={`data:image/jpeg;base64,${community.image}`}
                          className="community-image"
                          alt=""
                        />
                      </div>
                      <div className="text-white">
                        {community.name.length > 18
                          ? community.name.substring(0, 18) + "..."
                          : community.name}
                      </div>
                    </div>
                  </Link>
                  <div>
                    {!recentlyJoinedCommunities.includes(community.id) ? (
                      <button
                        onClick={() => handleCommunityJoin(community.id)}
                        className="text-white flex justify-center items-center font-Inter font-medium "
                      >
                        <div className="px-3 py-[3px] rounded-[18px] bg-green-600 hover:bg-green-700">
                          Join
                        </div>
                      </button>
                    ) : (
                      <div className="text-white px-3 py-[3px] rounded-[18px] border border-white">
                        <div>Joined</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomepageRightSidebar;
