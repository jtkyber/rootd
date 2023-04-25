import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User, { IUser } from '../../models/userModel'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
        const { userName, friendName } = req.body
        await connectMongo()

        await User.find( { username: { $in: [ userName, friendName ] } } ).then(docs => {
            if (docs.length !== 2) throw new Error('User does not exist')
        })
      
        let count = 0
        let friendDmsArrayPath
        let username
        while (count < 2) {
            if (count === 0) {
                //post to friend
                friendDmsArrayPath = `directMsgs.${userName}`
                username = friendName
            } else {
                //post to user
                friendDmsArrayPath = `directMsgs.${friendName}`
                username = userName
            }
            await User.updateOne(
                {
                    username: username,
                    [friendDmsArrayPath]: { $exists: false } 
                },
                {
                    $set: { [friendDmsArrayPath]: [] }
                }
            )
            count++
        }
        res.json(true)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}