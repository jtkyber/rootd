import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User, { IUser } from '../../models/userModel';
import mongoose from 'mongoose';

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

        const { receiver, content, authorId, date, author, authorProfileImg }: any = req.body

        let count = 0
        let objectPath
        let username
        const msgId = new mongoose.Types.ObjectId
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

            const user: IUser | null = await User.findOneAndUpdate({username: username}, {
                $push: {
                    [objectPath]: {
                        $each: [
                            {
                                _id: msgId,
                                content: content.trim(),
                                authorId: authorId,
                                date: Date.now(),
                                isLiked: false,
                                isRead: false,
                                author: author,
                                authorProfileImg: authorProfileImg
                            }
                        ],
                        $position: 0
                    }
                }
            }, { new: true, directMsgs: 1 })

            if (count === 1 && typeof user?.directMsgs === 'object') {
                const newMessage = JSON.parse(JSON.stringify(user.directMsgs))
                res.json(newMessage[receiver][0])
            }

            count++
        }

    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}