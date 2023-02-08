import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group from '../../models/groupModel';
import User from '../../models/userModel';

// type Data = {
//   name: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
        await connectMongo()

        const { userId, userName, groupId }: any = req.body

        const groupTest = await Group.findById(groupId)
        if (groupTest.members.includes(userName)) throw new Error('User already in group')


        const group = await Group.findByIdAndUpdate(groupId, { $push: {members: userName}}, { new: true })
        if (group.members.includes(userName)) {
            const user = await User.findByIdAndUpdate(userId, { $push: {groups: groupId}}, { new: true })
            res.json(user)
        } else throw new Error('User not able to be added to group')

    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}