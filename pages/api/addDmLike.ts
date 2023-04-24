import type { NextApiRequest, NextApiResponse } from 'next'
import { pusher } from '../../lib/index.js'
import connectMongo from '../../connectDB'
import axios from 'axios'
import User from '../../models/userModel'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
  ) {
    try {
        await connectMongo()

        const { liker, msgId, receiver, receiverId }: any = req.body
        
        const postNotification = async () => {
            console.log('postNotification')
            // await axios.post(`${process.env.CURRENT_BASE_URL}/api/postNotification`, {
            //     notificationType: 'message-like',
            //     msgId: msgId,
            //     newLiker: likerName,
            //     userId: authorID,
            //     groupId: groupId,
            //     groupName: groupName,
            //     userName: authorName
            // })
        }

        const getLikedValue: () => Promise<boolean> = async () => {
            const dmPersonObject = `directMsgs.${receiver}`
            const data = await User.findOne({ username: liker, [dmPersonObject]: { $elemMatch: { _id: msgId } } }, { [`${dmPersonObject}.$`]: 1 })
            const liked = (JSON?.parse(JSON?.stringify(data)))?.directMsgs[receiver]?.[0]?.isLiked
            return liked
        }
        
        let count = 0
        let likedPath
        let username
        const newIsLikedValue = !(await getLikedValue())

        while (count < 2) {
            if (count === 0) {
                //post to receiver
                likedPath = `directMsgs.${liker}.$[i].isLiked`
                username = receiver
            } else {
                //post to liker
                likedPath = `directMsgs.${receiver}.$[i].isLiked`
                username = liker
            }

            await User.updateOne({ username: username },
            { 
                $set: { [likedPath]: newIsLikedValue }
            }, 
            {
                arrayFilters: [ { 'i._id': msgId } ]
            }).then(async docs1 => {
                if (docs1.modifiedCount > 0) {
                    if (count === 1) {
                        const pusherRes = await pusher.get({ path: `/channels/${receiverId}` })
                        
                        if (pusherRes.status === 200) {
                            const body = await pusherRes.json()
                            if (body?.occupied) {
                                await pusher.trigger(receiverId, 'set-msg-like', { msgId: msgId, isLiked: newIsLikedValue })
                            } else {
                                await postNotification()
                                // await pusher.trigger(
                                //     `${receiverId}`, 
                                //     'update-notifications', 
                                //     { notificationType: 'message-like', msgId: msgId, newLiker: likerName, groupId: groupId, groupName: groupName, authorName: authorName }
                                // )
                            }
                        }
                        res.json(newIsLikedValue)
                    }
                } else throw new Error('Could not update isLiked')
            })
            count++
        }

    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}