import { connect } from "react-redux"
import Peer from "peerjs"
import React, { Component } from 'react'

class VideoCall extends Component {
    constructor(props) {
        super(props)

        this.state = {
            peer: {}
        }
    }
    componentDidMount() {
        
        let peer = new Peer(this.props.peer.id)
        this.setState({
            peer: peer
        })
        console.log(peer)
        peer.on("open", (id) => {
            console.log("I am connected with id", id)
        })
        if (this.props.peer.calling) {
            this.props.socket.emit("calling", { name: this.props.auth.name, callerID: this.props.peer.callerID })
            
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                    let call = peer.call(this.props.peer.callerID, stream)
                    this.videoOutput.srcObject = stream
                    call.on("stream", (remoteStream) => {
                        console.log(remoteStream)
                        this.setState({
                            recieving: this.props.peer.callerID
                        })                        
                        this.videoInput.srcObject = remoteStream
                    })
                })
            
        }      
        peer.on("call", (call) => {
            console.log("Call", call)
            let confirmation = window.confirm("Someone is calling you")
            if(confirmation){
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                call.answer(stream)
                this.setState({
                    sending: this.props.peer.id
                })
                this.videoOutput.srcObject = stream
                call.on("stream", (remoteStream) => {
                    this.videoInput.srcObject = remoteStream
                })
            })
        }
        }) 
    
    
    
    
        
        
       
    }

    render() {
        
        return (
            <div className="video_component">
                <h4>VIDEO CHAT</h4>
                <h6>SENDING : {this.state.sending}</h6>
                <h6>RECIEVING: {this.state.recieving}</h6>
                <div className="video_container">
                <p>VIDEO OUTPUT</p>
                <video ref={video => { this.videoOutput = video }} id="videoOutput" controls autoPlay={true}></video>
                <br />
                <p>VIDEO INPUT</p>
                <video ref={video => { this.videoInput = video }} id="videoInput" controls autoPlay={true} />
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        auth: state.authReducer,
        peer: state.peerReducer,
    }
}

export default connect(mapStateToProps)(VideoCall)