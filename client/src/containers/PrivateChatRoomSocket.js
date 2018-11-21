import React from 'react'
import PrivateChatRoom from "../components/PrivateChatRoom"
import SocketContext from "../SocketContext"
import { connect } from "react-redux"
import {bindActionCreators} from "redux"
import {leaveChannel} from "../actions/channelActions"
import {getFriendMessages} from "../actions/friendsActions"
const PrivateChatRoomSocket = (props) => {
    return (
        <SocketContext.Consumer>
            {socket => <PrivateChatRoom {...props} socket={socket} />}
        </SocketContext.Consumer>
    )
}
const mapStateToProps = (state) => {
    return {
        room: state.currentRoomReducer,
        auth: state.authReducer,
        messages: state.messagesReducer,
        friends: state.friendsReducer,
        peer: state.peerReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({leaveChannel: leaveChannel, getFriendMessages: getFriendMessages}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PrivateChatRoomSocket)