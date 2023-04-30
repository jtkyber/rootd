import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User, { INotification, IUser } from '../../models/userModel'
import mongoose from 'mongoose'
import Group, { IGroup } from '../../models/groupModel'
import { pusher } from '../../lib'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    try {
        await connectMongo()

        const { notificationType, groupId, groupName, msgId, newLiker, userId, userName, inviter, reason }: any = req.body

        const groupMutedByUser = async () => {
            const group: IGroup | null = await Group.findById(groupId)
            if (group?.membersWithGroupMuted?.includes(userName)) {
                return true
            } 
            return false
        }

        const getNotifications = async () => {
            const user: IUser | null = await User.findById(userId).sort({ 'notifications.date': -1})
            if (user?.notifications) {
                return user.notifications
            }
            return null
        }

        let newNotificationObject: INotification

        switch (notificationType) {
            case 'dm-like':
                newNotificationObject = {
                    _id: new mongoose.Types.ObjectId,
                    content: 'New DM Like',
                    date: Date.now(),
                    readDate: Date.now(),
                    notificationType: notificationType,
                    likerId: userId,
                    likers: [newLiker],
                    msgId: msgId
                }

                await User.updateOne({ _id: userId }, {
                    $push: { 
                        notifications: {
                            $each: [newNotificationObject],
                            $position: 0
                        }
                    } 
                }).then(async docs => {
                    if (docs?.modifiedCount > 0) {
                        res.json(await getNotifications())
                    } else throw new Error('Could not post like notification')
                })
                break

            case 'message-like':
                if (await groupMutedByUser()) return res.json(false)

                newNotificationObject = {
                    _id: new mongoose.Types.ObjectId,
                    content: 'New Message Like',
                    date: Date.now(),
                    readDate: Date.now(),
                    notificationType: notificationType,
                    likers: [newLiker],
                    msgId: msgId,
                    group: {
                        id: groupId,
                        name: groupName
                    }
                }

                await User.updateOne(
                    { 
                        $and: [
                            { _id: userId }, 
                            { 'notifications.notificationType': notificationType },  
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
                        arrayFilters: [ 
                            { 
                                'i.likers': { $nin: newLiker }, 
                                'i.notificationType': 'message-like',
                                'i.msgId': msgId
                            }
                        ]
                    }
                )
                .then(async docs1 => {
                    if (docs1.matchedCount > 0) {
                        res.json(await getNotifications())
                    }
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
                        .then(async docs2 => {
                            if (docs2.matchedCount) {
                                res.json(await getNotifications())
                            }
                            else throw new Error('Could not add notification')
                        })
                        .catch(err => { throw new Error(err) })
                    }
                })
                .catch(err => { throw new Error(err) })
                break
            case 'group-invite':
                const content = `Invited to ${groupName}`

                newNotificationObject = {
                    _id: new mongoose.Types.ObjectId,
                    content: content,
                    date: Date.now(),
                    readDate: Date.now(),
                    notificationType: notificationType,
                    group: {
                        id: groupId,
                        name: groupName
                    },
                    inviter: inviter
                }
                
                User.updateOne(
                    { 
                        _id: userId,
                        groups: { $nin: groupId },
                        'notifications.content': { $ne: content }
                    }, 
                    {
                        $push: { 
                            notifications: {
                                $each: [newNotificationObject],
                                $position: 0
                            }
                        } 
                    }
                    ).then(async docs => {
                        if (docs.modifiedCount > 0) {
                            const pusherRes = await pusher.get({ path: `/channels/${userId}` })
                            
                            if (pusherRes.status === 200) {
                                const body = await pusherRes.json()
                                if (body?.occupied) {
                                    await pusher.trigger(userId, 'update-notifications', { notificationType: notificationType, notification: JSON.stringify(await getNotifications()) })
                                }
                            }
                            res.json(true)
                        }
                        else res.status(400).end('User has already been invited to that group')
                })
                break
            case 'group-approved':
                newNotificationObject = {
                    _id: new mongoose.Types.ObjectId,
                    content: 'Group approved',
                    date: Date.now(),
                    readDate: Date.now(),
                    notificationType: notificationType,
                    group: {
                        id: groupId,
                        name: groupName
                    },
                }

                User.updateOne({ _id: userId },
                    {
                        $push: { 
                            notifications: {
                                $each: [newNotificationObject],
                                $position: 0
                            }
                        } 
                    }
                ).then(async docs => {
                    if (docs.modifiedCount > 0) {
                        const pusherRes = await pusher.get({ path: `/channels/${userId}` })
                        
                        if (pusherRes.status === 200) {
                            const body = await pusherRes.json()
                            if (body?.occupied) {
                                await pusher.trigger(userId, 'update-notifications', { notificationType: notificationType, notification: JSON.stringify(await getNotifications()) })
                            }
                        }
                        res.json(true)
                    }
                    else res.status(400).end('Could not notify user of accepted group')
                })
                break
            case 'group-rejected':
                console.log(req.body)
                if (reason.length < 20) throw new Error('Please provide a longer reason')
                newNotificationObject = {
                    _id: new mongoose.Types.ObjectId,
                    content: 'Group rejected',
                    date: Date.now(),
                    readDate: Date.now(),
                    notificationType: notificationType,
                    group: {
                        id: groupId,
                        name: groupName
                    },
                    reason: reason
                }

                User.updateOne({ _id: userId },
                    {
                        $push: { 
                            notifications: {
                                $each: [newNotificationObject],
                                $position: 0
                            }
                        } 
                    }
                ).then(async docs => {
                    if (docs.modifiedCount > 0) {
                        const pusherRes = await pusher.get({ path: `/channels/${userId}` })
                        
                        if (pusherRes.status === 200) {
                            const body = await pusherRes.json()
                            if (body?.occupied) {
                                await pusher.trigger(userId, 'update-notifications', { notificationType: notificationType, notification: JSON.stringify(await getNotifications()) })
                            }
                        }
                        res.json(true)
                    }
                    else res.status(400).end('Could not notify user of rejected group')
                })
                break
        }
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}