import { pusher } from '../../../lib/index.js';

const handler = (req, res) => {
    const { socket_id, channel_name, username } = req.body
    
    const randomString = Math.random().toString(36).slice(2)

    const presenceData = {
        user_id: randomString,
        user_info: {
            username
        }
    }

    try {
        const auth = pusher.authorizeChannel(socket_id, channel_name, presenceData)
        res.json(auth)
    } catch(err) {
        console.log(err)
    }
}

export default handler