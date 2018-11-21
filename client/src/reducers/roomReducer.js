const roomReducer = (state = [], action) => {
    switch (action.type) {
        case "GET_CHANNELS":
            return action.payload.data
        case "CREATE_CHANNEL":
            return [...state, action.payload.data]
        default:
            return state
    }
}

export default roomReducer