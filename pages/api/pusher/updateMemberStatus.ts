import { pusher } from '../../../lib/index.js';

const handler = async (req, res) => {
    try {
        const { username, channelName } = req.query
        const ok = await pusher.trigger(`presence-${channelName}`, 'update-online-members', {username: username})
        res.json({status: 200})
    } catch(err) {console.log(err)}
}

export default handler