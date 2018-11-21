import React from 'react'
import ChatRoom from "../components/ChatRoom"
import SocketContext from "../SocketContext"
import { connect } from "react-redux"
const ChatRoomSocket = (props) => {
    return (
        <SocketContext.Consumer>
            {socket => <ChatRoom {...props} socket={socket} />}
        </SocketContext.Consumer>
    )
}
const mapStateToProps = (state) => {
    return {
        room: state.currentRoomReducer,
        auth: state.authReducer,
    }
}
export default connect(mapStateToProps)(ChatRoomSocket)