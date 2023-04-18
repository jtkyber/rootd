import type { NextApiRequest, NextApiResponse } from 'next'
import { pusher } from '../../lib/index.js'
import connectMongo from '../../connectDB'
import Group from '../../models/groupModel'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
  ) {
    try {
        await connectMongo()

        const { groupId, groupName, msgId, likerName, authorID, authorName }: any = req.body
        
        const postNotification = async () => {
            await axios.post(`${process.env.CURRENT_BASE_URL}/api/postNotification`, {
                notificationType: 'message-like',
                msgId: msgId,
                newLiker: likerName,
                userId: authorID,
                groupId: groupId,
                groupName: groupName,
                userName: authorName
            })
        }

        await Group.updateOne({ _id : groupId },
        { 
            $addToSet: { "messages.$[i].likes": likerName.toString() }
        }, 
        {
            arrayFilters: [ { 'i._id': msgId } ],
        }).then(async docs1 => {
            if (docs1.modifiedCount > 0) {
                await pusher.trigger(`presence-${groupId}`, 'set-msg-like', { msgId: msgId, isAdded: true, liker: likerName })
                
                const pusherRes = await pusher.get({ path: `/channels/${authorID}` })
                
                if (pusherRes.status === 200) {
                    const body = await pusherRes.json()
                    if (!body?.occupied) {
                        await postNotification()
                    } else {
                        await pusher.trigger(
                            `${authorID}`, 
                            'update-notifications', 
                            { notificationType: 'message-like', msgId: msgId, newLiker: likerName, groupId: groupId, groupName: groupName, authorName: authorName }
                        )
                    }
                }
                res.json(true)
            } else {
                await Group.updateOne({ _id : groupId }, {
                    $pull: { "messages.$[i].likes": likerName.toString() },
                }, 
                {
                    arrayFilters: [ { 'i._id': msgId } ],
                }).then(async docs2 => {
                    if (docs2.modifiedCount > 0) {
                        await pusher.trigger(`presence-${groupId}`, 'set-msg-like', { msgId: msgId, isAdded: false, liker: likerName })
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