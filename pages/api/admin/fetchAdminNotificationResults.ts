import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../../connectDB'
import User, { IUser } from '../../../models/userModel'
import Admin from '../../../models/adminModel'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
        const { userId, resultType, cursor, limit }: any = req.query
        await connectMongo()

        const isAdmin: IUser | null = await User.findOne({ _id: userId, isAdmin: true })
        const userIsAdmin = isAdmin ? true : false

        if (userIsAdmin) {
            const notifs = await Admin.findOne({}, { [`${resultType}`]: 1, _id: 0 }).skip(parseInt(cursor)).limit(parseInt(limit))
            res.json({
                data: notifs.groupCreationRequests,
                cursor: notifs.groupCreationRequests.length >= parseInt(limit) ? parseInt(cursor) + parseInt(limit) : null
            })
        } else throw new Error('This feature is only accessable to admins')
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}