import { combineReducers } from "redux"
import authReducer from "./authReducer"
import roomReducer from "./roomReducer"
import currentRoomReducer from "./currentRoomReducer";
import peerReducer from "./peerReducer";
import friendsReducer from "./friendsReducer";
import messagesReducer from "./messagesReducer"
const rootReducer = combineReducers({
    authReducer: authReducer,
    roomReducer: roomReducer,
    currentRoomReducer: currentRoomReducer,
    peerReducer: peerReducer,
    friendsReducer: friendsReducer,
    messagesReducer: messagesReducer
    
})

export default rootReducer