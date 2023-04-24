import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User from '../../models/userModel';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
        await connectMongo()

        const { userId } = req.body

        const seconds = 1000 * 60 * 60 * 24     // 1 day
        const dateInSeconds = Date.now() - seconds
        const isoDate = new Date(dateInSeconds).toISOString()

        await User.updateOne({ _id: userId }, {
            $pull: { notifications: { readDate: { $lt: isoDate }, read: true } }
        }).then(docs => {
            if (docs.matchedCount > 0) res.json(true)
            else throw new Error('Could not find User')
        })
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}