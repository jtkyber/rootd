import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGroup | boolean>
  ) {
    try {
        await connectMongo()

        const { groupId, msgId, name }: any = req.body

        const msg = await Group.findOneAndUpdate(
            { "_id": groupId, "messages._id": msgId },
            { "$pull": {
                "messages.$.likes": name.toString()
            }}
        )
        if (!msg) res.json(false)
        res.json(msg)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}