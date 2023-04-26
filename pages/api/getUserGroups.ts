import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group from '../../models/groupModel';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
        await connectMongo()

        const { groupIds }: any = req.query
        const groupIdArray = JSON.parse(groupIds)
        if (!groupIdArray[0]) throw new Error('No group IDs provided')

        const userGroups = await Group.find({ _id: { $in: groupIdArray }}, { messages: 0, password: 0 })

        res.json(userGroups.reverse())
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}