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
    let response = await fetch(
      `http://localhost:8000/getMessage/${room_name}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.refresh}`,
        },
      }
    );

    let data = await response.json();
    // Sort the messages by date in ascending order (oldest to newest)
    // data.sort((a, b) => new Date(a.date) - new Date(b.date));
    // If you want them in descending order (newest to oldest), you can use:
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

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
      <div className="my-2 mx-4 flex flex-col h-[420px] bg-[#0B222C] rounded-[20px] px-6 py-2 text-white">
        <div className="overflow-y-auto flex-grow flex flex-col-reverse">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mx-2 ${
                user.user_id === message.user ? "justify-end" : "justify-start"
              }`}
            >
              <div className="w-[280px] flex flex-col rounded-lg py-2 px-3 my-2 bg-[#0F2A36]">
                <div className="text-[#ACACAC] text-sm">
                  <span className="border-b border-[#ACACAC]">{message.username}</span>
                </div>

                <div className="my-2 text-md">{message.message}</div>
              </div>
            </div>
          ))}
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
                className="text-white px-2 mx-2 h-[36px] rounded-[10px]"
                disabled={userMsg === ""}
                style={{
                  backgroundColor: userMsg !== "" ? "#03C988" : "#08a36f",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;
