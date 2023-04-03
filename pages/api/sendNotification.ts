import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel'
import User from '../../models/userModel'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGroup | boolean>
  ) {
    try {
        await connectMongo()

        const { content, notificationType, groupId, msgId, newLiker, userId }: any = req.body

        let data;

        switch (notificationType) {

            case 'new-group-message':
                // data = await User.updateMany({ 
                //     groups: groupId,
                //     'notifications.groupId': groupId,
                //     'notifications.notificationType': 'new-group-message',
                //     'notifications.read': false
                // },
                // {
                //     $inc: {'notifications.$.numOfMsgs': 1}
                // }
                // )
                // break

            case 'message-like':
                const newNotificationObject = {
                    content: 'New Message Like',
                    date: Date.now(),
                    notificationType: 'message-like',
                    likers: [newLiker],
                    msgId: msgId
                }

                await User.updateOne(
                    { 
                        $and: [
                            { _id: userId }, 
                            { 'notifications.notificationType': 'message-like' },  
                            { 'notifications.msgId': msgId }
                        ]
                    }, 
                    {
                        $set: {
                            'notifications.$[i].read': false,
                            'notifications.$[i].date': Date.now()
                        },
                        $push: { 
                            'notifications.$[i].likers': {
                                $each: [newLiker],
                                $position: 0
                            }
                        } 
                    },
                    {
                        arrayFilters: [ { 'i.likers': { $nin: newLiker } } ]
                    }
                )
                .then(async (docs1) => {
                    if (docs1.matchedCount > 0) res.json(true)
                    else {
                        await User.updateOne({ _id: userId }, 
                        { 
                            $push: { 
                                notifications: {
                                    $each: [newNotificationObject],
                                    $position: 0
                                }
                            } 
                        }) 
                        .then(docs2 => {
                            if (docs2.matchedCount) res.json(true)
                            else throw new Error('Could not add notification')
                        })
                        .catch(err => { throw new Error(err) })
                    }
                })
                .catch(err => { throw new Error(err) })

            break
        }
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}