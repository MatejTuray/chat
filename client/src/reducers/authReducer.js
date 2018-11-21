const authReducer = (state = {}, action) => {
    switch (action.type) {
        case "FETCH_USER":
            return action.payload.data
        case "LOGOUT":
            return action.payload.data
        default:
            return state
    }
}

export default authReducer