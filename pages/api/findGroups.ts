import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User from '../../models/userModel'
import { IGroup } from '../../models/groupModel';

type Data = {
  name: string
}

// const testGroup: IGroup = {
//     groupId: '12345',
//     name: 'Test Group',
//     members: ['123', 'steve', 'jeff', 'bob'],
//     messages: [
//         {
//             msgId: 'dsa4g423',
//             author: 'steve',
//             content: 'This is a test message. 1 Samuel 4:8.',
//             date: 1673990334268,
//             likes: 2,
//             psgReference: '1 Samuel 4:8'
//         },
//         {
//             msgId: '2345tg55',
//             author: '123',
//             content: 'Nice!',
//             date: 1673991701168,
//             likes: 1
//         },
//     ],
//     isPrivate: false,
//     summary: 'This is a test group',
//     tags: ['test', 'abc'],
//     characters: ['samuel, david', 'saul'],
//     books: ['1 samuel'],
//     date: 1673990300000
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
//   ) {
//     try {
//         await connectMongo()
//         const { userId } = req.query
//         const user = await User.findOne({ _id: userId }).select('groups')
            
//         console.log()
//         }
//     } catch(err) {
//         console.log(err)
//         res.status(400).end(err)
//     }
// }