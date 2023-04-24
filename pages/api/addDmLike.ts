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

        const { liker, likerId, msgId, receiver, receiverId }: any = req.body
        
        const postNotification = async () => {
            const res = await axios.post(`${process.env.CURRENT_BASE_URL}/api/postNotification`, {
                notificationType: 'dm-like',
                msgId: msgId,
                newLiker: liker,
                userId: receiverId
            })
            if (res?.data) return res.data
            else throw new Error('Could not post notification')
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

                                const data = await User.findById(receiverId, { currentDmPerson: 1 })
                                if (data.currentDmPerson !== liker) {
                                    const notif = await postNotification()
                                    await pusher.trigger(
                                        receiverId, 
                                        'update-notifications', 
                                        { notificationType: 'dm-like', notification: JSON.stringify(notif) }
                                    )
                                }
                            } else {
                                await postNotification()
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