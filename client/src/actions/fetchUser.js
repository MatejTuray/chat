import axios from "axios"

const fetchUser = () => {
    return {
        type: "FETCH_USER",
        payload: axios.get("/api/current_user")
    }
}

export default fetchUser
