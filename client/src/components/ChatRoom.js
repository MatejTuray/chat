import React, { Component } from 'react'
import axios from "axios"
import {
    Tooltip,
  } from 'react-tippy';
import moment from "moment"
import EmojiPicker from 'emoji-picker-react';
import JSEMOJI from 'emoji-js';
import { Emojione } from 'react-emoji-render';
const jsemoji = new JSEMOJI();
jsemoji.img_set = 'emojione';
jsemoji.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/';
jsemoji.supports_css = false;
jsemoji.allow_native = false;
jsemoji.replace_mode = 'unified';
jsemoji.use_sheet = true;
jsemoji.init_env(); 
jsemoji.replace_mode = 'unified';
jsemoji.allow_native = true;

class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.handleSendMessage = this.handleSendMessage.bind(this)
        this.handleTyping = this.handleTyping.bind(this)
        this.handleFocusLoss = this.handleFocusLoss.bind(this)
        this.state = {
            messages: [],
            roomName: "",
            msg: "",
            usersTyping: [],
           
        }
    }   
    componentDidMount(){    
        
        this.setState({
            roomName: this.props.room.name,
            roomID: this.props.room.id,
            
        })
        
        this.props.socket.on("newMessage", (data) => {
            
            
            this.setState({
                messages: this.state.messages.concat(data),
                typing: false,
                usersTyping: this.state.usersTyping.filter((user)=> user !== data.from),
            })
        })

        this.props.socket.on("users", (data) => {
            
        })
        
        axios.get(`/api/channels/${this.props.room.id}`).then((res) => this.setState({
            messages: res.data.messages
        }))
            
        this.props.socket.on("typing", (data) => {
            if (data){
            this.setState({
                typing: true,
                usersTyping: this.state.usersTyping.concat(data)
            })
            }
        })
        this.props.socket.on("stopTyping", (data) => { 
                     
            this.setState({
                usersTyping: this.state.usersTyping.filter((user) => user !== data )
            })
        })

    }
  
  
    handleSendMessage(e) {
        e.preventDefault()        
        this.props.socket.emit("room_message", this.props.room.name, {
            from: this.props.auth.name,
            text: e.target[0].value,
            img: this.props.auth.img

        }, this.props.room.id)
        this.setState({
            typing: false,
            msg: ""
        })
    }       
 
    
    handleTyping(e){
        
        this.setState({
            msg: e.target.value
        })
  
    }
    componentWillUnmount() {
        this.setState({
            toDashboard:true,
        })       
        this.props.socket.emit("disconnect_room", this.props.room.name)
        
    }
    handleFocusLoss(){
        this.props.socket.emit("user_stop_typing", this.props.auth.name, this.props.room.name)
    }
    render() {
        
        
        let timeout
        let setOfUsers = new Set(this.state.usersTyping)
        let users = Array.from(setOfUsers)
        if(this.state.msg !== ""){
            timeout = setTimeout(
            this.props.socket.emit("user_typing", this.props.auth.name, this.props.room.name), 2000)    
            }
            else if(this.state.msg === ""){
                clearTimeout(timeout)             
              
            }
        return (
            <div id="chat" className="col-lg-10 offset-lg-2  ml-1 col-sm-12 w-100"> 
                

                {/* {message.from}: */}
               
                <ul className="chat_msg_list">
                    
                    {this.state.messages.map((message) => <li key={message.createdAt}><span><Tooltip

title={message.from}
position="right"
trigger="mouseenter"
><img className="mr-2 rounded-circle" src={message.img} /></Tooltip></span> <Emojione className="chat_message" text={message.text}></Emojione><span className="float-right mr-2"><small>{moment(message.createdAt).format("M/D HH:MM")}</small></span></li>)}
<div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.el = el; }}>
        </div>
                </ul>
                
                <div id="toolbar" className="d-flex justify-content-center w-100">
               
                <form className="chat_form form-inline"onSubmit={(e) => this.handleSendMessage(e, this.props.room.name)}>
                    <input className="form-control mr-2 chat_input w-75" type="text" value={this.state.msg} onInput={(e) => this.handleTyping(e)} onBlur={this.handleFocusLoss} />
                    <button className="chat_button"><i className="toolbar_icon fas fa-location-arrow"></i></button>
                    
                  

                </form>
                
                {this.state.typing && users.length > 1 && users.length < 5 ? <p>{users.map(user => <span>{`${user}, `}</span>)} are typing...</p>: undefined}
                {this.state.typing && users.length === 1 ? <p>{users.map(user => <span>{`${user}`}</span>)} is typing...</p>: undefined}
                </div>
                <button className="emoji_button" onClick={() => this.setState({emoji: !this.state.emoji})}><i className="toolbar_icon fas fa-smile"></i></button>
                {this.state.emoji ? <EmojiPicker onEmojiClick={(code,emojiName) => {jsemoji.replace_unified(`${emojiName}`); emojiName= jsemoji.replace_colons(`:${emojiName.name}:`); this.setState({msg: this.state.msg + emojiName})}}/> : undefined}
            </div>
        )
    }
}
export default ChatRoom