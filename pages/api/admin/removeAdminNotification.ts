import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../../connectDB'
import User, { IUser } from '../../../models/userModel'
import Admin from '../../../models/adminModel'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
        const { userId, notifId, resultType }: any = req.body
        await connectMongo()

        const isAdmin: IUser | null = await User.findOne({ _id: userId, isAdmin: true })
        const userIsAdmin = isAdmin ? true : false

        if (userIsAdmin) {
            await Admin.updateOne({},
                {
                    $pull: { [resultType]: { _id: notifId } }
                }
            ).then(docs => {
                res.json(docs.modifiedCount)
            })
        } else throw new Error('This feature is only accessable to admins')
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}