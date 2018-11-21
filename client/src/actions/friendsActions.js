import axios from "axios"
import { getAllChannels } from "./channelActions";
const addFriend = (id, data) => {
     
    return {
        type: "ADD_FRIEND",
        payload: axios.patch(`/api/users/${id}/friends/add`, {name: data.name, img: data.img})

    }
}
const getFriends = (id) => {
    return {
        type: "GET_FRIENDS",
        payload: axios.get(`/api/users/${id}/friends`)
    }
}
const removeFriend = (id, friendName) => {
    return {
        type: "REMOVE_FRIEND",
        payload: axios.patch(`/api/users/${id}/friends/delete`, friendName)
    }
}
const checkStatus = (friends) => {
    return {
        type: "CHECK_STATUS",
        payload: friends
    }
}
const getFriendMessages = (id, friendName) => {
    return {
        type: "GET_FRIEND_MESSAGES",
        payload: axios.get(`/api/users/${id}/friends/${friendName}`),
        
    }
}

const AddGetFriend = (id, data, friends) => (dispatch) => {
    dispatch(addFriend(id, data)).then((res) => dispatch(getFriends(id))).then((res) => dispatch(checkStatus(friends)))
}
const GetAndCheck = (id, friends) => (dispatch) => {
    dispatch(getFriends(id)).then((res) => dispatch(checkStatus(friends))).then((res) => dispatch(getAllChannels()))
}
const RemoveGetFriend = (id, friendName, friends) => (dispatch) => {
    dispatch(removeFriend(id, friendName)).then((res) => dispatch(getFriends(id)))
}


export { addFriend, getFriends, removeFriend, checkStatus, AddGetFriend, GetAndCheck, RemoveGetFriend, getFriendMessages }