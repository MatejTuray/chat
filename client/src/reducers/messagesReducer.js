const messagesReducer = (state = [], action) => {
    switch (action.type){
        case "GET_FRIEND_MESSAGES":
            
            let friendMessages = action.payload.data.friends
            return friendMessages
        default:
            return state
    }
}

export default messagesReducer