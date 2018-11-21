const peerInit = (id) => {
    return {
        type: "PEER_INIT",
        payload: id
    }
}

const peerDisconnect = () => {
    return {
        type: "PEER_DISCONNECT",
    }
}

const peerUpdate = (name) => {
    return {
        type: "PEER_UPDATE",
        payload: name
    }
}
const peerCall = (payload) => {
    return {
        type: "PEER_CALL",
        payload: payload
    }
}
const peerAnswer = (stream) => {
    return {
        type: "PEER_ANSWER",
        payload: stream
    }
}

export { peerInit, peerDisconnect, peerUpdate, peerCall, peerAnswer }