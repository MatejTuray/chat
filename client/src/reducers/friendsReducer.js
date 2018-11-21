const friendsReducer = (state = [], action) => {
    switch (action.type) {
        case "GET_FRIENDS":
            return action.payload.data.friends
        case "ADD_FRIEND":
            return state
        case "REMOVE_FRIEND":
            return state
        case "CHECK_STATUS":      
            
            return state.map((friend) => {
                if (action.payload.find((user) => user.name === friend.name)) {
                    return { ...friend, status: true }
                }
                else {
                    return { ...friend, status: false }
                }
            })        
        default:
            return state
    }
}

export default friendsReducer