import React, { Component } from 'react'
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import fetchUser from "../actions/fetchUser"
import logoutUser from "../actions/logoutUser"
import { Link, Redirect } from "react-router-dom"
import Typing from 'react-typing-animation';
class Entry extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    componentDidMount() {
        this.props.fetchUser()
        
        setTimeout( () => 
        this.setState({
            redirect:true
        }), 60000)
    
    }
  
    render() {
        return (
            <div className="container-fluid"  id="login">
            <div className="mt-auto d-flex justify-content-center align-items-center" >
            <div id="box">
            <div>
                <h1 className="login_heading"><Typing speed={100} hideCursor={true} ><span>Logging you in as...</span></Typing> <br/><span><img className="entry_img rounded-circle" src={this.props.auth.img} /><Typing hideCursor={true} speed={100} startDelay={2000} ><span>{this.props.auth.name}</span> </Typing> </span> </h1>
                
                <div className="mt-3 d-flex justify-content-around align-items-center" >
                {/* <Link className="entry_link" push to="/"><i className="fas fa-arrow-left entry_icon"/></Link>
                <Link className="entry_link" push to="/dashboard"><i className="fas fa-arrow-right entry_icon"/></Link> */}
                </div>
            </div>
            </div>
            </div>
            {this.state.redirect ? <Redirect to="/dashboard"/> : undefined}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        auth: state.authReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchUser: fetchUser, logoutUser: logoutUser }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Entry)
