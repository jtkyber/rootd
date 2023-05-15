import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group from '../../models/groupModel';
import User from '../../models/userModel';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
  ) {
    try {
        await connectMongo()

        const { userId }: any = req.body

        const data = await User.findOne({ _id: userId }, { darkMode: 1 })
        
        const user = await User.findOneAndUpdate(
            { 
                _id: userId 
            }, 
            {
                darkMode: !data.darkMode
            },
            {
                projection: { darkMode: 1 },
                new: true
            }
        )
            
        if (typeof user?.darkMode === 'boolean') res.json(user.darkMode)
        else throw new Error('Could not update dark mode')
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}