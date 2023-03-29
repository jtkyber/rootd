import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel'
import User from '../../models/userModel'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGroup | boolean>
  ) {
    try {
        await connectMongo()

        const { content, notificationType, groupId }: any = req.body

        switch (notificationType) {
            case 'new-group-message':
                User.updateMany({ groups: groupId }, {
                    $push: { notifications: {
                        content: content,
                        notificationType: 'new-group-message',
                        date: Date.now(),
                        groupId: groupId
                    }}
                })
            break

            // case 'message-like':
            //     User.find({ groups: groupId, notifications: {$elemMatch: {'notificationType': 'message-like'}}}, {
            //         $set: {
            //             likers: {
            //                 $cond: {
            //                     if: {

            //                     }
            //                 }
            //             }
            //         }
            //     })
            // break
        }

        res.json(true)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}