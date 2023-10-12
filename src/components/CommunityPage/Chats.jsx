import React, { useContext, useState, useEffect } from "react";
import ChatContext from "../../context/ChatContext";
import AuthContext from "../../context/AuthContext";
function Chats() {
  const { room_name } = useContext(ChatContext);
  const { authToken } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  let [userMsg, setMessage] = useState("");
  let [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessage();
    const intervalId = setInterval(() => {
      getMessage();
    }, 3000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getMessage = async () => {
    let resposne = await fetch(
      `http://localhost:8000/getMessage/${room_name}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.refresh}`,
        },
      }
    );

    let data = await resposne.json();
    console.log(data);
    setMessages(data);
  };

  const handleMessageSend = async () => {
    let response = await fetch(
      `http://localhost:8000/newMessage/${room_name}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.refresh}`,
        },
        body: JSON.stringify({ message: userMsg }),
      }
    );
    setMessage("");
    let data = await response.json();
    console.log(data);
  };
  return (
    <div className="main-chat-box font-Inter">
      <div className="my-2 mx-4 flex flex-col h-screen bg-[#0B222C] rounded-[20px] px-6 py-2 text-white">
        <div className="overflow-y-auto flex-grow">
          {messages.map((messages, index) =>
            user.user_id == messages.user ? (
              <div className="flex justify-end">
                <span className="rounded-lg py-2 px-3 my-2 bg-[#0F2A36]">
                  {messages.message}, {messages.user}, {messages.community},{" "}
                  {messages.username}
                </span>
              </div>
            ) : (
              <div className="flex justify-start">
                <span className="rounded-lg py-2 px-3 my-2 bg-[#0F2A36]">
                  {messages.message}, {messages.user}, {messages.community},{" "}
                  {messages.username}
                </span>
              </div>
            )
          )}
        </div>
        {/* <div></div> */}
        <div className="msg-inputbox">
          <div className="flex justify-between items-center">
            <div className="w-full">
              <input
                type="text"
                className="text-white bg-[#0F2A36] h-[36px] w-full px-2 my-2 rounded-[8px] text-md message-input"
                placeholder="Message.."
                value={userMsg}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
            </div>
            <div>
              <button
                onClick={handleMessageSend}
                className="text-white bg-green-600 hover:bg-green-700 px-2 mx-2 h-[36px] rounded-[10px]"
              >
                send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;
