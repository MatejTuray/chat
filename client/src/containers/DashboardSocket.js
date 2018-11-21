import React from 'react'
import Dashboard from "../containers/Dashboard"
import SocketContext from "../SocketContext"
import { connect } from "react-redux"


const DashboardSocket = (props) => {
    return (
        <SocketContext.Consumer>
            {socket => <Dashboard {...props} socket={socket} />}
        </SocketContext.Consumer>
    )
}
export default DashboardSocket