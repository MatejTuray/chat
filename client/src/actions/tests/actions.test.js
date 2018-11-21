import fetchUser from "../fetchUser";
import logoutUser from "../logoutUser";

describe("fetch user and logout user action creators", () => {
    it("has action type of FETCH_USER", () => {
        const action = fetchUser()
        expect(action.type).toEqual("FETCH_USER")
    })
    it("should have a payload of redux-promise", () => {
        const action = fetchUser()
        expect(action.payload).toBeInstanceOf(Promise)
    })
    it("has action type of LOGOUT", () => {
        const action = logoutUser()
        expect(action.type).toEqual("LOGOUT")
    })
    it("should have a payload of redux-promise", () => {
        const action = logoutUser()
        expect(action.payload).toBeInstanceOf(Promise)
    })
})