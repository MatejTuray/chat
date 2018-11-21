import React from 'react'
import VideoCall from "./VideoCall"
import SocketContext from "../SocketContext"



const VideoCallSocket = (props) => {
    return (
        <SocketContext.Consumer>
            {socket => <VideoCall {...props} socket={socket} />}
        </SocketContext.Consumer>
    )
}
export default VideoCallSocket