import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';
import User, { IUser } from '../../models/userModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
  ) {
    try {
        await connectMongo()
        const { username, groupId }: any = req.body

        const user: IUser | any = await User.updateOne({ username: username }, { 
            $pull: { 
                groups: groupId,
                lastSeenMsgs: { groupId: groupId},
                notifications: { 'group.id': groupId}
            }
        }).catch(err => {throw new Error(err)})

        if (user?.modifiedCount > 0) await Group.updateOne({ _id: groupId }, { $pull: { members: username }})
        else throw new Error('could not retrieve user')

        res.json(true)
        
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}