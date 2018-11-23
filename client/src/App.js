import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import React, { Component } from 'react';
import Login from "./containers/Login"
import PageNotFound from "./components/PageNotFound"
import { Route, Switch, Redirect } from "react-router-dom";
import {Router} from "react-router"
import { connect } from "react-redux"
import AuthError from './components/AuthError';
import fetchUser from "./actions/fetchUser";
import { bindActionCreators } from 'redux';
import DashboardSocket from "./containers/DashboardSocket"
import SocketContext from "./SocketContext"
import * as io from "socket.io-client";
import Entry from './containers/Entry';
import { peerInit } from './actions/peerActions';
import "./styles/styles.css"
import createBrowserHistory from 'history/createBrowserHistory';
import 'react-tippy/dist/tippy.css'
import VideoCallSocket from "./containers/VideoCallSocket"


const history = createBrowserHistory();
const socket = io("https://react-chat01.herokuapp.com/")

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }
  componentDidMount() {
    this.props.fetchUser()
    socket.on("fetch_id", (id) => {
      this.props.peerInit(id)
    })

  }
  componentWillUnmount() {
    socket.disconnect(true)
  }

  render() {
    return (

      < div >
        <Router history={history}>
          <Switch>
            <Route path="/" exact={true} component={Login} />
            <Route path="/entry" component={Entry} />
            <Route path="/503" component={AuthError} />
            {this.props.auth.name ? <SocketContext.Provider value={socket}>
              <Route path="/dashboard" component={DashboardSocket} />             
              
            </SocketContext.Provider> : <Redirect to="/" />}
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </div >
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.authReducer,
    room: state.roomReducer
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchUser: fetchUser, peerInit: peerInit }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
