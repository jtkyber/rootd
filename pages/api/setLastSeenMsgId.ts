import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User from '../../models/userModel';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
  ) {
    try {
        await connectMongo()

        const { userId, msgId, groupId }: any = req.body
        const user = await User.findOneAndUpdate(
            { "_id": userId },
            { 
                $set: {
                    'lastSeenMsgs.$[i].msgId': msgId
                }
            },
            {
                arrayFilters: [ { 'i.groupId': groupId } ],
                new: true
            }
        )
        if (!user) res.json(false)
        res.json(user.lastSeenMsgs)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}