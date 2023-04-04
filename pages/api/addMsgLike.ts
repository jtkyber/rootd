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

        const { groupId, groupName, msgId, name, channel }: any = req.body

        await Group.updateOne({ _id : groupId },
        { 
            $addToSet: { "messages.$[i].likes": name.toString() }
        }, 
        {
            arrayFilters: [ { 'i._id': msgId } ],
        }).then(async docs1 => {
            if (docs1.modifiedCount > 0) {
                await pusher.trigger(`presence-${groupId}`, 'set-msg-like', {msgId: msgId, isAdded: true, liker: name})
                await pusher.trigger(`${channel}`, 'update-notifications', {notificationType: 'message-like', msgId: msgId, newLiker: name, groupId: groupId, groupName: groupName})
                res.json(true)
            } else {
                await Group.updateOne({ _id : groupId }, {
                    $pull: { "messages.$[i].likes": name.toString() },
                }, 
                {
                    arrayFilters: [ { 'i._id': msgId } ],
                }).then(async docs2 => {
                    if (docs2.modifiedCount > 0) {
                        await pusher.trigger(`presence-${groupId}`, 'set-msg-like', {msgId: msgId, isAdded: false, liker: name})
                        res.json(false)
                    } else throw new Error('Error occured when setting message like')
                })
            }
        })
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}