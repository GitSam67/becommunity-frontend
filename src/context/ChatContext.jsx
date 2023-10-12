import { createContext, useContext, useState } from "react";

const ChatContext = createContext()

export const ChatProvider = ({children}) => {
    let [room, setRoom] = useState('')
    const getRoom = (value) => {
        setRoom(value)
    }
    let contextData = {
        getRoom:getRoom,
        room_name : room
    }
    return(
        <ChatContext.Provider value={contextData}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContext