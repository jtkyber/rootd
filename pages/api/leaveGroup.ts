import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';
import User, { IUser } from '../../models/userModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser>
  ) {
    try {
        await connectMongo()
        const { username, groupId }: any = req.body

        const user: IUser | any = await User.findOneAndUpdate({ username: username }, { $pull: { groups: groupId }}, { new: true })

        if (user.acknowledged) await Group.updateOne({ _id: groupId }, { $pull: { members: username }})
        else throw new Error('could not retrieve user')

        res.json(user)
        
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}