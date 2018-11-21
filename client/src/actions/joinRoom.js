const joinRoom = (room, id,img) => {
    return {
        type: "JOIN_ROOM",
        payload: { name: room, id: id, img:img }
    }
    
}

export default joinRoom