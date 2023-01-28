import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group from '../../models/groupModel';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        await connectMongo()

        const { groupIds }: any = req.query
        const groupIdArray = JSON.parse(groupIds)
        if (!groupIdArray[0]) throw new Error('No group IDs provided')

        const userGroups: any = []
        for (const groupId of groupIdArray) {
            const group = await Group.findById(groupId, { messages: 0 })
            userGroups.push(group)
        }

        res.json(userGroups)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}