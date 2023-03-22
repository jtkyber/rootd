import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IMsg } from '../../models/groupModel';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        await connectMongo()

        const { groupId, author, content, date, psgReference }: any = req.body
        const msg: Partial<IMsg> = {
            author,
            content,
            date,
            psgReference
        }
        
        await Group.findByIdAndUpdate(groupId, {
            $push: {
                messages: {
                    $each: [msg],
                    $position: 0
                }
            },
            $set: {lastActive: Date.now()}
        }, { new: true }).then((docs) => {
            if (docs) res.json(docs.messages[0])
        })
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}