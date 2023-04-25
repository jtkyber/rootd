import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User, { IUser } from '../../models/userModel'
import Group from '../../models/groupModel'
import { ObjectId } from 'mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
      const { userId, memberId } = req.query
      await connectMongo()

      const user: IUser | null = await User.findById(userId, { groups: 1 })

      const member: IUser | null = await User.findById(memberId, {
        username: 1,
        bVersion: 1,
        groups: 1
      })

      if (!user) throw new Error('Could not find user')
      if (!member) throw new Error('Could not find member')

      const sharedGroupIds: ObjectId[] = member.groups.filter(g => user.groups.includes(g)).map(grp => new ObjectId(grp))

      const sharedGroups = await Group.find({
        _id: { $in: [ ...sharedGroupIds ] },
      }, { name: 1 })

      const sharedGroupNames = sharedGroups.map(g => g.name)

      const memberProfileData = {
        username: member.username,
        bVersion: member.bVersion,
        sharedGroups: sharedGroupNames
      }
      
      res.json(memberProfileData)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}