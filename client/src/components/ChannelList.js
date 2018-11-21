import React from 'react'
import {connect} from "react-redux"
const ChannelList = (props) => {
  return (
    <div className="friendlist">
      <ul>
      {props.rooms.map(channel => <li className="d-flex justify-content-start mb-2 friendlist_person" key={channel._id}>{channel.name} <span><button className="friendlist_button" onClick={() => props.handleTabCreate(channel._id, channel.name)}><i className="fas fa-plus-circle"></i></button></span></li> )}
      </ul>
    </div>
  )
}
const mapStateToProps = (state) => {
    return {
        auth: state.authReducer,
        rooms: state.roomReducer,          
        friends: state.friendsReducer,
    }
}
export default connect(mapStateToProps)(ChannelList)