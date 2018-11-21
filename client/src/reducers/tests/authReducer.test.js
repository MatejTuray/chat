import authReducer from "../authReducer";
import axios from "axios"

describe("authReducer tests", () => {
    it("should handle wrong action types", () => {
        const action = {
            type: "FETCH_USZR",
            action: axios.get("/api/current_user")
        }
        const newState = authReducer({}, action)
        expect(newState).toEqual({})
    })
})