import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User, { IUser } from '../../models/userModel'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser>
  ) {
    try {
        const { email } = req.query
        await connectMongo()
        
        const user: IUser | null = await User.findOne({ email: email })
        if (!user) throw new Error('Could not find user')
        res.json(user)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}