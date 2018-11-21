import axios from "axios"

const getAllChannels = () => {
    return {
        type: "GET_CHANNELS",
        payload: axios.get("https://peaceful-oasis-31467.herokuapp.com/https://reactchat-api.herokuapp.com/api/channels")
    }
}

const createChannel = (name) => {
    return {
        type: "CREATE_CHANNEL",
        payload: axios.post("https://peaceful-oasis-31467.herokuapp.com/https://reactchat-api.herokuapp.com//api/channels", name)
    }
}

const leaveChannel = () => {
    return {
        type: "LEAVE_ROOM",
    }
}


export { getAllChannels, createChannel, leaveChannel }