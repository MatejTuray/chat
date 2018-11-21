import axios from "axios"

const getAllChannels = () => {
    return {
        type: "GET_CHANNELS",
        payload: axios.get("/api/channels")
    }
}

const createChannel = (name) => {
    return {
        type: "CREATE_CHANNEL",
        payload: axios.post("/api/channels", name)
    }
}

const leaveChannel = () => {
    return {
        type: "LEAVE_ROOM",
    }
}


export { getAllChannels, createChannel, leaveChannel }