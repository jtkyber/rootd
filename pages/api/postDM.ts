import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User, { IUser } from '../../models/userModel';
import mongoose from 'mongoose';
import { pusher } from '../../lib';

export interface IDm {
    content: string
    date: Date | number
    isLiked: boolean
    isRead: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
        await connectMongo()

        const { receiver, content, authorId, friendId, author, authorProfileImg }: any = req.body

        let count = 0
        let objectPath
        let username
        let friendInChat = false
        let friendOnline = false
        const msgId = new mongoose.Types.ObjectId

        const pusherRes = await pusher.get({ path: `/channels/${friendId}` })

        if (pusherRes.status === 200) {
            const body = await pusherRes.json()
            if (body?.occupied) {
                const data = await User.findById(friendId, { currentDmPerson: 1 })
                if (data.currentDmPerson === author) friendInChat = true
                friendOnline = true
            }
        }

        while (count < 2) {
            if (count === 0) {
                //post to receiver
                objectPath = `directMsgs.${author}`
                username = receiver
            } else {
                //post to author
                objectPath = `directMsgs.${receiver}`
                username = author
            }

            const message = {
                _id: msgId,
                content: content.trim(),
                authorId: authorId,
                date: Date.now(),
                isLiked: false,
                isRead: friendInChat,
                author: author,
                authorProfileImg: authorProfileImg
            }

            const user: IUser | null = await User.findOneAndUpdate({ username: username }, {
                $push: {
                    [objectPath]: {
                        $each: [ message ],
                        $position: 0
                    }
                }
            }, { new: true, directMsgs: 1 })

            if (typeof user?.directMsgs === 'object') {
                if (count === 0) {
                    if (friendInChat) await pusher.trigger(friendId, 'fetch-new-group-msgs', { msg: JSON.stringify(message), username: author })
                    else if (friendOnline) await pusher.trigger(friendId, 'check-for-new-dms', {})
                } else if (count === 1) {
                    const newMessage = JSON.parse(JSON.stringify(user.directMsgs))
                    res.json(newMessage[receiver][0])
                }
            }


            count++
        }

    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}