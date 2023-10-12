import React, { useContext, useEffect, useState } from "react";
import "./Notify.css";
import AuthContext from "../../context/AuthContext";

function NotifyModal() {
  const [userData, setUserData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const { authToken } = useContext(AuthContext);
  const { get_user } = useContext(AuthContext);

  const getCurrentUser = async () => {
    let data = await get_user();
    console.log(data);
    setUserData(data);
  };

  const get_post = async () => {
    let response = await fetch("http://127.0.0.1:8000/get-post/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.refresh}`,
      },
    });
    let data = await response.json();
    setPostsData(data);
  };

  useEffect(() => {
    get_post();
    getCurrentUser();
  }, []);

  const filterPosts = (posts) => {
    const currentDateTime = new Date();
    const last48Hours = new Date(currentDateTime - 480 * 60 * 60 * 1000); // 48 hours in milliseconds

    return posts.filter((post) => new Date(post.date) > last48Hours);
  };

  // Filter posts and map them
  const latestPosts = filterPosts(postsData);
  return (
    <>
      <div className="notify z-50 absolute w-96 h-96 px-3 pb-3 bg-[#0B222C] flex-col justify-center rounded-lg overflow-y-auto text-left text-white font-Inter">
        <div className="py-2 border-b-2 border-gray-100 text-gray-100 text-left px-1 text-xl mb-4 mt-2 font-semibold">
          Notifications
        </div>
        {latestPosts
          .filter(
            (notification) => notification.post_creator !== userData.username
          )
          .map((notification, index) => (
            <div className="mb-2 text-[#ACACAC]">
              {index !== 0 && <hr className="text-white" />}
              <span className="font-bold text-white">
                {notification.post_creator} has recently posted :{" "}
              </span>{" "}
              {notification.description.length > 100
                ? notification.description.substring(0, 100) + "..."
                : notification.description}
            </div>
          ))}

        {/* <div className='mb-5'>
        <span className='font-bold'>New Community Initiative: </span> 
          Introducing "Neighbors Helping Neighbors" program! If you need assistance with grocery shopping, errands, or any other tasks.
        </div>
        
        <div className='mb-2'>
        <span className='font-bold'>Youth Talent Show Auditions: </span> Calling all talented youngsters! Showcase your skills and join our upcoming youth talent show. 
        </div> */}
      </div>
    </>
  );
}

export default NotifyModal;
