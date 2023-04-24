import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User from '../../models/userModel';
import { ObjectId } from 'mongodb';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
        await connectMongo()
        const { userId }: any = req.query

        const uid = new ObjectId(userId)
        
        const data = await User.aggregate(
            [
                {
                    $project: { 
                        directMsgs: { $objectToArray: '$directMsgs'} 
                    }
                },
                { 
                    $match: { 
                        $and: [
                            { _id: uid }, 
                            {
                                $expr: {
                                    $ne: [
                                    {
                                        $filter: {
                                        input: {
                                            $reduce: {
                                            input: "$directMsgs.v",
                                            initialValue: [],
                                            in: {
                                                $concatArrays: [
                                                "$$value",
                                                "$$this"
                                                ]
                                            }
                                            }
                                        },
                                        cond: {
                                            $and: [
                                            {
                                                $ne: [
                                                "$$this.authorId",
                                                uid
                                                ]
                                            },
                                            {
                                                $eq: [
                                                "$$this.isRead",
                                                false
                                                ]
                                            }
                                            ]
                                        }
                                        }
                                    },
                                    []
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        )
        res.json(data?.length > 0)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}