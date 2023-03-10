import { pusher } from '../../../lib/index.js';

const handler = async (req, res) => {
    try {
        const { channelName, msg } = req.query
        await pusher.trigger(channelName, 'fetch-new-group-msgs', {msg: msg})
        res.json({status: 200})
    } catch(err) {console.log(err)}
}

export default handler