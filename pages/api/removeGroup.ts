import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';
import User from '../../models/userModel';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean | string>
  ) {
    try {
        await connectMongo()

        const { groupId, username }: any = req.body

        const doc = await Group.remove({ _id: groupId, groupAdmin: username })
        if (doc.deletedCount > 0) {
            await User.updateMany(
                { 
                    groups: { $in: [ groupId ]} 
                }, 
                {
                    $pull: { 
                        groups: groupId,
                        lastSeenMsgs: { groupId: groupId },
                        notifications: { 'group.id': groupId }
                    }
                }
            )
            res.json(groupId)
        } else throw new Error('Could not remove group')
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}