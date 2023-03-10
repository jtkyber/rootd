import { pusher } from '../../../lib/index.js';

const handler = (req, res) => {
    const { socketId, channelName, username } = req.body

    const randomString = Math.random().toString(36).slice(2)

    const presenceData = {
        user_id: randomString,
        user_info: {
            username
        }
    }

    try {
        const auth = pusher.authenticate(socketId, channelName, presenceData)
    } catch(err) {
        console.log(err)
    }
}

export default handler