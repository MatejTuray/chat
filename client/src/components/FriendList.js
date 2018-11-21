import React from 'react'
import {connect} from "react-redux"
import {Link} from "react-router-dom"

const FriendList = (props) => {
  console.log(props)
  return (
      
    <div className="friendlist">
            <ul>
                    {props.friends.map((friend) =>
                        <li className="d-flex justify-content-start mb-2 friendlist_person" key={friend._id}><img src={friend.img} className="friendlist_img rounded-circle mr-2"></img><span>{friend.name}</span><span className="ml-2" style={{marginTop: 1}}>{friend.status ? <i className="fas fa-circle online"></i> : <i class="fas fa-circle offline"></i>}</span><span className="friendlist_icons">
                            
                            <button className="friendlist_button" onClick={() => props.handleRemoveFriend(props.auth._id, { name: friend.name })}><i className="fas fa-trash-alt"></i></button>                            
                            <button className="friendlist_button"onClick={(e) => props.handleCall(e)}><i className="fas fa-phone"/></button>                            
                            <Link push to={`${friend.name}`} onClick={() => { props.handleJoinRoom(props.peer.id, friend.name)}}><i className="fas fa-envelope"/></Link>
                            
                        </span>                  
                                                
                        </li>)}
                </ul>
    </div>
  )
}
const mapStateToProps = (state) => {
    return {
        auth: state.authReducer,
        rooms: state.roomReducer,          
        friends: state.friendsReducer,
        peer: state.peerReducer,
    }
}
export default connect(mapStateToProps)(FriendList)