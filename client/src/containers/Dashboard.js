import React, { Component } from 'react'
import { connect } from "react-redux"
import { bindActionCreators } from 'redux';
import logoutUser from "../actions/logoutUser"
import { Redirect, Link, Route, withRouter } from "react-router-dom"
import joinRoom from '../actions/joinRoom';
import { peerUpdate, peerCall, } from '../actions/peerActions';
import { checkStatus, AddGetFriend, RemoveGetFriend, GetAndCheck } from '../actions/friendsActions';
import { createChannel, getAllChannels, leaveChannel } from '../actions/channelActions';
import ChatRoomSocket from './ChatRoomSocket';
import { Navbar, NavbarBrand,NavbarToggler, Collapse, Input } from 'mdbreact';
import { slide as Menu } from 'react-burger-menu'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem,  NavbarNav, Button } from 'mdbreact'
import ChannelList from '../components/ChannelList';
import FriendList from '../components/FriendList';
import { ToastContainer, toast } from 'mdbreact';
import {Modal, ModalBody, ModalHeader, ModalFooter, HamburgerToggler} from 'mdbreact';
import PrivateToastMessage from "../components/PrivateToastMessage"
import PrivateChatRoomSocket from "./PrivateChatRoomSocket";
import axios from "axios"
import Select from 'react-select';
import Animated from 'react-select/lib/animated';
import VideoCallSocket from "./VideoCallSocket"

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.handleJoinRoom = this.handleJoinRoom.bind(this)
        this.handleCreateChannel = this.handleCreateChannel.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handlePrivateMessage = this.handlePrivateMessage.bind(this)
        this.handleCall = this.handleCall.bind(this)
        this.handleAddFriend = this.handleAddFriend.bind(this)
        this.handleRemoveFriend = this.handleRemoveFriend.bind(this)
        this.handleFriendRequest = this.handleFriendRequest.bind(this)
        this.handleRemoved = this.handleRemoved.bind(this)
        this.handleTabCreate = this.handleTabCreate.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this) 
        this.handleRemoveTab = this.handleRemoveTab.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.handleAcceptFriendRequest = this.handleAcceptFriendRequest.bind(this)
        this.handleLeavePrivateConv = this.handleLeavePrivateConv.bind(this)
        this.handleUserChange = this.handleUserChange.bind(this)
        this.handleChannelChange = this.handleChannelChange.bind(this)
        this.state = {
            room: "",
            redirect: false,
            users: [],
            videoCall: false,
            tabs: [],
            friendTabs: [] ,           
            menuOpen: false,
            channelsOpen: false,
            friendsOpen: false, 
            dropdownRender: false,
            unmountRoom: false,
            channelSuccess: false,
            channelError: false,
            sentRequest: false,
            openCreateChannel: false,
            friendModal : false,
            friendName: "",
            friendImg: "",
            requestAccepted: false, 
            allUsers: [],
            autoCompleteData: [], 
            selectValue: ""        


        }
    }
    componentDidMount() {
        this.props.socket.open()
        if (this.props.auth.name) {
            let data = {
                img: this.props.auth.img,
                name: this.props.auth.name,
            }
            this.props.socket.emit("set_name", data)
        }
        this.props.socket.on("fetch_user", (name) => {
            this.props.peerUpdate(name)
        })
        this.setState({
            redirect: false
        })
        this.props.socket.on("get_users", (data) => {
            this.setState({
                users: data
            })
            this.props.GetAndCheck(this.props.auth._id, data)
        })
        this.props.socket.on("call", (user) => {
            this.props.socket.emit("recieving", { rec: this.props.auth.name})
            this.setState({
                videoCall: true
            })
        })

        this.props.socket.on("private_message_recieved", (data) => {
         
            toast.info(<PrivateToastMessage msgImg={data.img} msgText={data.text} msgFrom={data.from} msgCreatedAt={data.createdAt}/>, {
                autoClose: 5000,
                position: "bottom-right",
                style: {
                    "opacity": 0.5,
                    

                },
                draggable: true,
               
              
            })
            let msg = data
            msg.userId = this.props.auth._id
            console.log(msg)
            this.props.socket.emit("private_message_recieved", msg)
        })
        this.props.socket.on("user_disconnect", (data) => {
            this.setState({
                users: data
            })
            this.props.GetAndCheck(this.props.auth._id, data)
        })


        this.props.socket.on("friend_request", (data) => {
            this.setState({
                friendModal : true,
                friendName: data.name,
                friendImg: data.img,
               })                         
       
        })

        this.props.socket.on("deleted_from_friends", (name) => {
            let data = {
                name: name
            }
            this.handleRemoved(this.props.auth._id, data)
        })
        this.props.socket.on("channel_created", () => {
            this.props.getAllChannels()
        })
        
        axios.get("/api/users/").then((res) => { this.setState({
            allUsers: res.data
        })})       
        if(this.props.auth.pending.length !== 0){
            //toast.info(`You have ${this.props.auth.pending.length} pending friend requests`)
            //this.props.AddGetFriend(this.props.auth._id, {name: this.props.auth.pending[0].name, img:this.props.auth.pending[0].img}, this.state.users)

        }
    }
  
    componentWillUnmount(){
        this.props.socket.disconnect()
    }
    toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      }
    
    handleCreateChannel(e) {
    
        e.preventDefault()
        this.props.createChannel({ name: e.target[1].value, creator: this.props.auth._id }).then((res) => {this.props.socket.emit("channel_created");})
        toast.success('\u{02714} Channel created', {
            autoClose: 3000,
            position: "bottom-center",
          });
          e.target[1].value = ""
        }        

    
    handleJoinRoom(id, name, img) {
        this.props.joinRoom(name, id, img)
        this.props.socket.emit("join_room", name)
        


    }
   
    handlePrivateMessage(e, friendName) {
        e.preventDefault()
        let rec = friendName   
     
        let id = 0
        let name
        let img 
        let found
        this.state.users.find((user) => {
            if (user.name === rec) {

                name = user.name
                id = user.id
                img = user.img             
                console.log(name,id, "found")
            }   
            else if (user.name !== rec){
                this.props.friends.find((user) => {
                    if (user.name === rec) {
                        name = user.name                  
                        img = user.img  
                        console.log(name,id, "found in friends")                  
                    }
                }) 
            }   
        })
              
        
        
        
        this.props.socket.emit("private_message", id, {
            from: this.props.auth.name,
            text: e.target[0].value,
            img: this.props.auth.img
        }, this.props.auth._id, name)
       



    }
    handleCall(e) {
       
        let name = this.props.auth.name
        let id = this.props.peer.id
        let targetName = e.target.parentElement.parentElement.parentElement.children[1].textContent

        let targetCall = this.state.users.find(user => {if (user.name === targetName){
            return user
        }})
        console.log(targetCall.id)
        this.props.peerCall({ calling: true, name: name, callerID: targetCall.id })        
        if(targetCall.id){
        this.setState({
            videoCall: true
        })    
    }
    }
    handleLogout() {
        this.props.logoutUser()
        this.props.socket.emit("disconnect", (this.props.socket))
        this.props.socket.disconnect()
        
    }
    handleFriendRequest(id, data) {
        this.props.AddGetFriend(id, data, this.state.users)
        
     
        
    }
    handleRemoved(id, name) {
         this.props.RemoveGetFriend(id, name, this.state.users)
    }
    handleAddFriend(id, data, friends) {
        this.setState({
            sentRequest: false
        })
        let idSocket = this.state.users.find((user) => user.name === data.name)
        let senderName = this.props.auth.name
        let senderImg = this.props.auth.img
        let sendData = {
            senderImg: senderImg,
            sender: senderName,
            id: idSocket.id
        }
        this.props.socket.emit("add_friend", sendData)
        
        toast.info('\u{027A5} Friend request sent', {
            position: "bottom-center",
            autoClose: 3000
          });
          this.props.socket.on("accepted", () => {
              console.log(id,data,friends)
            this.props.AddGetFriend(id, data, friends)    
          
        })

    }
    handleTabCreate(id, name){        
        this.setState({           
            tabs: this.state.tabs.concat({name: name, id: id}),
            dropdownRender: true,
        })
    }
    handleRemoveFriend(id, name) {
        try {
            let idSocket = this.state.users.find((user) => user.name === name.name)
            let senderName = this.props.auth.name
            let data = {
                sender: senderName,
                id: idSocket.id
            }

            this.props.socket.emit("remove_friend", data)
        }
        catch (e) {
            console.log(e)
        }

        this.props.RemoveGetFriend(id, name, this.state.users)
    

    }
    toggleMenu () {
        
        this.setState({menuOpen: !this.state.menuOpen})
            if(this.state.menuOpen === false){
                this.setState({channelsOpen: false});
                this.setState({friendsOpen:false})
            }
      }
    toggleChannels(){
        this.setState({channelsOpen: !this.state.channelsOpen})
    }
    toggleFriends(){
        this.setState({friendsOpen: !this.state.friendsOpen})
    }
    handleRemoveTab(name){    
        this.props.socket.emit("disconnect_room", this.props.room.name)
        this.setState({
            tabs: this.state.tabs.filter(tab => tab.name !== name)
            
        })
        this.props.leaveChannel()  
        
        
    }
    handleLeavePrivateConv(name){
        this.props.socket.emit("disconnect_room", this.props.room.name)      
        this.props.leaveChannel()          
    }
  
    toggleModal(){
        this.setState({
            friendModal: !this.state.friendModal
        })
    }
    handleAcceptFriendRequest(){
        if(this.state.friendName){
        let idSocket = this.state.users.find((user) => user.name === this.state.friendName)
        let senderName = this.props.auth.name
        let senderImg = this.props.auth.img
        let data = {
            senderImg: senderImg,
            sender: senderName,
            id: idSocket.id
        }
        this.props.socket.emit("accepted", data)
       
    }
    }
    handleUserChange(item){     
        
         if(item.value !== undefined){
        this.state.allUsers.find((user) => {if(user.name === item.value && user.img === item.img){
            
           try{ this.handleAddFriend(this.props.auth._id, { name: user.name, img: user.img }, this.state.users)}
           catch(e){
                if(e){
                    alert("Offline friend requests are WIP")
                    // axios.post(`http://localhost:5000/api/users/${user.name}`, {img:user.img}).then((res) => {
                    //     let _id = res.data._id
                    //     if(_id){
                    //         axios.patch(`http://localhost:5000/api/users/${_id}/pending`, {name: this.props.auth.name, img: this.props.auth.img}).then((res) => {
                    //             console.log(res.data);
                    //             toast.info("Friend request sent")
                    //         }).catch((e) => console.log(e))
                    //     }
                    // })
                }      }             
           
        }
           
        })
    }
    }
  
    handleChannelChange(item){
        if(item.value !== undefined){
            toast.success("Joining room")
        this.props.rooms.find((room) => {if(room.name === item.value && room._id === item._id){
            this.handleTabCreate(room._id, room.name)
            this.props.history.push(`${this.props.match.url}/chatroom/${room._id}`)
            this.handleJoinRoom(room._id, room.name)
        }})
    }
    }
    


    render() {   
      
        let page = () => {
            if (this.props.room.name) {
                return this.props.room.name
             }
             else if (this.props.history.location.pathname === "/dashboard/friendlist"){
                 return "Friends"
             }
             else if (this.props.history.location.pathname === "/dashboard/channellist"){
                 return "Channels"
             }
             else {
                 return "Dashboard"
             }
        }        
   
        let optionsRooms = []
        let optionsUsers = []
        for (let el of this.props.rooms.map(room => {return{name:room.name, _id: room._id}})){           
           
                optionsRooms.push({value:el.name, label:<span className="mt-2 d-flex justify-content-between"> <i className="fas fa-hashtag"/><p>{el.name}</p></span>, _id: el._id})
            
        }
        for (let el of this.state.allUsers.map((user) => {return {name: user.name, img: user.img}})){           
           
            optionsUsers.push({value:el.name, label:<span className="mt-2 d-flex justify-content-between"> <img className="friendlist_img rounded-circle" src={el.img}/><p>{el.name}</p>               
            </span>, img: el.img})
        
    }
        

    
             
        
        return (
            <div>
            <div className="container-fluid" id="main">
                <Navbar dark className="fixed-top ">
                <HamburgerToggler onClick={() => this.toggleMenu()} />
            <NavbarBrand>
                {this.props.room.img ? <img className="rounded-circle navbar_img " src={this.props.room.img}/> : undefined}   {page()}
              {this.props.room.name ? <button className="end_conv"><Link onClick={() => {this.handleLeavePrivateConv(this.props.room.name); this.handleRemoveTab(this.props.room.name) }}push to="/dashboard"><i id="end_conv_icon" className="fas fa-times"></i></Link></button> : undefined}
            </NavbarBrand>
            <NavbarNav className="float-right" right>
          <Dropdown >
      <DropdownToggle className="dropdownButton" color="primary">
        <i className="fas fa-comments"></i> {this.state.tabs.length}
      </DropdownToggle>
        <DropdownMenu>
          {this.state.tabs.map((tab) => <DropdownItem className="d-flex justify-content-start mb-2 friendlist_person" key={tab.id}><span>{tab.name}</span><span className="friendlist_icons">
          <Link className="friendlist_button" push to={`${this.props.match.url}/chatroom/${tab.id}`} onClick={() => { this.handleJoinRoom(tab.id, tab.name)}}><i className="fas fa-envelope"/></Link>
                           </span></DropdownItem>)}  
        </DropdownMenu>
      </Dropdown>
      </NavbarNav>
      
      <Dropdown>
      <DropdownToggle className="dropdownButton" color="primary">
        <i className="fas fa-user-friends"></i> {this.props.friends.map(friend => friend.status === true).length}
      </DropdownToggle>
        <DropdownMenu>
          {this.props.friends.map((friend) =>
                        <DropdownItem className="d-flex justify-content-start mb-2 friendlist_person" key={friend._id}><img src={friend.img} className="friendlist_img rounded-circle mr-2"></img><span>{friend.name}</span><span className="ml-2" style={{marginTop: 1}}>{friend.status ? <i className="fas fa-circle online"></i> : <i class="fas fa-circle offline"></i>}</span><span className="friendlist_icons">
                            
                        <button className="drop friendlist_button" onClick={() => this.handleRemoveFriend(this.props.auth._id, { name: friend.name })}><i className="fas fa-trash-alt"></i></button>                            
                        <button className="d-none drop friendlist_button"onClick={(e) => this.handleCall(e)}><i className="fas fa-phone"/></button>                            
                        <Link className="friendlist_button" push to={`${this.props.match.url}/${friend.name}`} onClick={() => { this.handleJoinRoom(this.props.peer.id, friend.name, friend.img); console.log(friend.img)}}><i className="fas fa-envelope"/></Link>
                        
                    </span>                  
                                            </DropdownItem>)}
        </DropdownMenu>
      </Dropdown>
      
        </Navbar>
        <Menu isOpen={this.state.menuOpen} noOverlay>
        <div id="profile" className="d-flex justify-content-between">
        <img  className="entry_img rounded-circle" src={this.props.auth.img}/>
        <p className="user_name text-center">{this.props.auth.name}</p>
        </div>
           
        
        <div>
            <div>
               
            <Select options={optionsUsers} label="Search users" onChange={this.handleUserChange} placeholder="Search for new friends"/>
            
            </div>
        

        
        <a id="channels" className="menu-item text-right d-flex justify-content-between p-3" onClick={() => this.toggleChannels()} ><i className=" fas fa-hashtag"/><span className="menu_item_text">Channels</span></a>
        <Collapse isOpen={this.state.channelsOpen}>
        <a  className="menu-item text-right d-flex justify-content-between p-3" onClick={() => this.setState({openCreateChannel: !this.state.openCreateChannel})} ><i className="ml-2 fas fa-hashtag"/><span className="menu_item_text">New</span></a>
                    <Collapse isOpen={this.state.openCreateChannel}>
                    <div className="ml-5">
                    <form className="form-inline ml-2" onSubmit={(e) => {this.handleCreateChannel(e); this.setState({openCreateChannel: false})}}>
                    <button className="mr-1 create_channel_button"><i className="create_channel_icon fas fa-check-circle"></i></button>
                    <Input className="create_channel w-100"type="text" label="Channel name?"  />
                    
                   
                </form>   
                </div>     
                    </Collapse>
                    <a  className="menu-item text-right d-flex justify-content-between p-3"  ><i className="ml-2 fas fa-search"/><span className="menu_item_text">Search</span></a>
                    <Select options={optionsRooms} onChange={this.handleChannelChange}/>
        <Link className="link menu-item text-right d-flex justify-content-between p-3" push to={`${this.props.match.url}/channellist`} onClick={() => this.setState({menuOpen:false})} ><i className="ml-2 fas fa-hashtag"/><span className="menu_item_text">List</span></Link>       
        </Collapse>
        </div>
        <div>
        <a id="friends" className="menu-item text-right d-flex justify-content-between p-3" onClick={()=> this.toggleFriends()} ><i className=" fas fa-user-friends"/><span className="menu_item_text">Friends</span></a>
        <Collapse isOpen={this.state.friendsOpen}>        <a  className="menu-item text-right d-flex justify-content-between p-3"  ><i className="ml-2 fas fa-user-friends"/><span className="menu_item_text">New</span></a>
        <Link className="link menu-item text-right d-flex justify-content-between p-3" push to={`${this.props.match.url}/friendlist`} onClick={() => this.setState({menuOpen:false})}><i className="ml-2 fas fa-user-friends"/><span className="menu_item_text">List</span></Link>
        
        </Collapse>
        <a id="quit" className="menu-item text-right d-flex justify-content-between p-3" onClick={() => this.handleLogout()}> <i className="fas fa-power-off"/> <span className="menu_item_text">Quit</span></a>        
        </div>
      </Menu>

           
         
      
            <div id="primary" className="container mt-5" onClick={() => this.setState({menuOpen: false})}>               
            
                <Route key="channelList" path={`${this.props.match.url}/channellist`} render={props => <ChannelList {...props} handleTabCreate={this.handleTabCreate} />}></Route>
                <Route key="friendList" path={`${this.props.match.url}/friendlist`} exact={true} render={props => <FriendList {...props} handleRemoveFriend={this.handleRemoveFriend} handleCall={this.handleCall} handleJoinRoom={this.handleJoinRoom}/>} ></Route>
                {this.state.tabs.map((route) => <Route key={route.id} path={`${this.props.match.url}/chatroom/${route.id}`} render={props => <ChatRoomSocket key={route.id} {...props}/>}/>)}
                {this.props.friends.map((route) => <Route key={route._id} path={`${this.props.match.url}/${route.name}`} render={props => <PrivateChatRoomSocket users={this.state.users} key={route._id} name={route.name} {...props}/>}/>)}
                 <Route path={`/video/:id`} component={VideoCallSocket} />           
              
               
        
               


                {this.state.videoCall === true ? <Redirect push to={`video/${this.props.peer.id}`} target="_blank"></Redirect> : undefined}
           
            {this.handleToast}
            </div>
            <ToastContainer
          hideProgressBar={false}
          newestOnTop={true}
          autoClose={5000}
                  >
                  <button>Button</button>
                  </ToastContainer>
            </div>
           <div>
               <Modal isOpen={this.state.friendModal} toggle={() => this.toggleModal()} fullHeight position="bottom">
          <ModalHeader toggle={() => this.toggleModal()}>New friend request</ModalHeader>
          <ModalBody>

            <div className="d-flex justify-content-center"><img className="mr-2 rounded-circle" src={this.state.friendImg} /> <p>{this.state.friendName} wants to be friends!</p></div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => {this.handleAcceptFriendRequest(); this.handleFriendRequest(this.props.auth._id, {name: this.state.friendName, img: this.state.friendImg}); this.setState({
                friendModal: false
            })}}>Add</Button>
            <Button color="primary" onClick={() => this.setState({
                friendModal: false
            })}>Reject</Button>
          </ModalFooter>
        </Modal>
           </div>
            
          </div> 
        )
    }
}
const mapStateToProps = (state) => {
    return {
        auth: state.authReducer,
        rooms: state.roomReducer,
        room: state.currentRoomReducer,
        peer: state.peerReducer,
        friends: state.friendsReducer,
        messages: state.messagesReducer,
        
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logoutUser: logoutUser, joinRoom: joinRoom, leaveChannel: leaveChannel, peerUpdate: peerUpdate, peerCall: peerCall, checkStatus: checkStatus, AddGetFriend: AddGetFriend, RemoveGetFriend: RemoveGetFriend, GetAndCheck: GetAndCheck, createChannel: createChannel, getAllChannels: getAllChannels,}, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))