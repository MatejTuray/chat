import axios from "axios"

const fetchUser = () => {
    return {
        type: "FETCH_USER",
        payload: axios.get("https://reactchat-api.herokuapp.com/api/current_user")
    }
}

export default fetchUser
