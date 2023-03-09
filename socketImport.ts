import io from 'socket.io-client'

const socketInitializer = () => {
    fetch(`${process.env.CURRENT_BASE_URL}/api/socket`)
    return io()
}

export default socketInitializer()
