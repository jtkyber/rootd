import type { NextApiRequest, NextApiResponse } from 'next'
import { pusher } from '../../lib/index.js'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
  ) {
    try {
        await connectMongo()

        const { msg, name, channel }: any = req.body
        console.log(req.body)
        await Group.findOneAndUpdate(
            { "messages._id" : msg._id},
            { "$addToSet": {
                "messages.$.likes": name.toString()
            }},
            {new: false}
        ).then(async (docs1) => {
            const msgs = docs1.messages.filter(m => m._id.toString() === msg._id)
            if (msgs[0]?.likes?.includes(name)) {
                await Group.findOneAndUpdate(
                    { "messages._id" : msg._id },
                    { "$pull": {
                        "messages.$.likes": name.toString()
                    }}
                )
                res.json(false)
                await pusher.trigger(channel, 'set-msg-like', {msg: msg, isAdded: false, liker: name})
            } else {
                res.json(true)
                await pusher.trigger(channel, 'set-msg-like', {msg: msg, isAdded: true, liker: name})
            }
            
        })
            

            

    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}