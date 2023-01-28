import io from 'Socket.IO-client'

const socketInitializer = () => {
    fetch(`${process.env.CURRENT_BASE_URL}/api/socket`)
    return io()
}

export default socketInitializer()
