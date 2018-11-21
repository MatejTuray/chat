import React, { Component } from 'react'
import { connect } from "react-redux"
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLoginButton } from "react-social-login-buttons";
import { GithubLoginButton } from "react-social-login-buttons";
import { ToastContainer, toast } from 'mdbreact';

class Login extends Component {
    constructor(props) {
        super(props)
        this.handleLogin = this.handleLogin.bind(this)
        
        this.state = {
            loading: false,
            visible: false,
            
        }
    }
 

    componentDidMount(){       
        toast.info('This site uses cookies for navigation and authentication, as well as third party content. By continuing to visit or use our services, you are agreeing to the use of cookies and similar technologies for the aforementioned purposes', {
            autoClose: 7000,
            position: "bottom-center"
          });
    }
    handleLogin(){
        this.setState({
            loading:true
        })
    }
   


    render() {
        return (
            <div className="container-fluid"  id="login">
            <ToastContainer
                className="toast text-center"
          hideProgressBar={true}
          newestOnTop={true}
          autoClose={7000}
        />
            <div className="mt-auto justify-content-center align-items-center" >
                
     
                <div id="box">
                <div id="border">
              
                <h1 className="login_heading">ReactChat.io</h1>
                <h3 className="login_heading">A place to chat and make new friends </h3>
                <div className="row">
                <a className="login_btn" onClick={this.handleLogin} href="/auth/google"><GoogleLoginButton>Log in with Google</GoogleLoginButton></a>
                </div>
                <div className="row">
                <a className="login_btn" onClick={this.handleLogin} href="/auth/facebook"><FacebookLoginButton>Log in with Facebook</FacebookLoginButton></a>
                </div>
                <div className="row">
                <a className="login_btn" onClick={this.handleLogin} href="/auth/github"><GithubLoginButton >Log in with Github</GithubLoginButton ></a>
                </div>
                
                {this.state.loading ? <div className="mt-5 d-flex justify-content-center align-items-center" ><div class="dot-loader"></div>
                        <div class="dot-loader"></div>
                        <div class="dot-loader"></div></div> : <div className="mt-5 p-2 d-flex justify-content-center align-items-center" ><div></div>
                        <div ></div>
                        <div ></div></div>}
                {/* {this.props.auth.name ? <Redirect to="/dashboard" /> : undefined} */}
                </div>
                
                </div>           
                </div>
                
            
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        auth: state.authReducer
    }
}
export default connect(mapStateToProps)(Login)
