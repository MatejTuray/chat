import axios from "axios"
const logoutUser = () => {
    return {
        type: "LOGOUT",
        payload: axios.get("https://reactchat-api.herokuapp.com/api/logout")
    }
}
export default logoutUser