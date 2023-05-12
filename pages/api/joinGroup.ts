import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';
import User from '../../models/userModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
        await connectMongo()

        const { userId, userName, groupId, password = null, passwordException = false }: any = req.body
        console.log(req.body)

        const groupTest: IGroup | null = await Group.findById(groupId)
        const isAdmin = groupTest?.groupAdmin === userName

        if (groupTest?.members.includes(userName)) throw new Error('User already in group')
        if (!isAdmin && groupTest?.isPrivate && !password && !passwordException) throw new Error('Please enter the group password')
        if (!isAdmin && groupTest?.isPrivate && (password !== groupTest?.password?.toString()) && !passwordException) throw new Error('Wrong Password')

        const group = await Group.findByIdAndUpdate(groupId, { 
            $set: { memberCount: groupTest?.members?.length ? groupTest.members.length + 1 : 1 },
            $push: { members: userName }
        }, { new: true })

        if (group.members.includes(userName)) {
            await User.findByIdAndUpdate(userId, { 
                $push: {
                    groups: {$each: [groupId], $position: 0},
                    lastSeenMsgs: {
                        msgId: null,
                        groupId: groupId
                    }
                }
            }, { new: true, groups: 1 }).then(docs => {
                if (docs) {
                    res.json(group)
                } else throw new Error('User not able to be added to group')
            })
        } else throw new Error('User not able to be added to group')

    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}