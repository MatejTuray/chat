const currentRoomReducer = (state = [], action) => {
    switch (action.type) {
        case "JOIN_ROOM":
            return action.payload
        case "LEAVE_ROOM":
            return []
        default:
            return state
    }
}

export default currentRoomReducer