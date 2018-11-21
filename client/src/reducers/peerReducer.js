const peerReducer = (state = {}, action) => {
    switch (action.type) {
        case "PEER_INIT":
            return Object.assign(state, {}, { id: action.payload })
        case "PEER_DISCONNECT":
            return {}
        case "PEER_UPDATE":
            let user = action.payload
            return { ...state, user }
        case "PEER_CALL":
            let calling = action.payload.calling
            let name = action.payload.name
            let callerID = action.payload.callerID
            return { ...state, calling, name, callerID }
        case "PEER_ANSWER":
            let output = action.payload
            return { ...state, output }
        default:
            return state
    }
}

export default peerReducer