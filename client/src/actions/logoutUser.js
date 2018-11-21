import axios from "axios"
const logoutUser = () => {
    return {
        type: "LOGOUT",
        payload: axios.get("/api/logout")
    }
}
export default logoutUser