import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../../connectDB'
import User from '../../../models/userModel'
import bcrypt from 'bcrypt'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        const { username, password } = req.query
        console.log(req.query)
        await connectMongo()
        
        const user = await User.findOne({ username: username })
        if (!user) throw new Error('Could not find user')
        else {
            const pwMatch = await bcrypt.compare(password, user.password)
            if (pwMatch) {
                const userClone = (({ password, ...object }) => object)(user._doc)
                res.json(userClone)
            } else throw new Error('Incorrect password')
        }
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}