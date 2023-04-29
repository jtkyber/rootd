import React, { useEffect, useState } from 'react'
import NotificationBellIcon from './NotificationBellIcon'
import styles from '../styles/Nav.module.css'
import { IUserState, setUser } from '../redux/userSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { ILastSeenMsg, INotification } from '../models/userModel'
import axios from 'axios'
import { IGroup } from '../models/groupModel'
import { setSelectedGroup, setUserGroups } from '../redux/groupSlice'
import { useRouter } from 'next/router'
import scrollToMessage from '../utils/scrollToMessage'
import { setSelectedDmPerson } from '../redux/appSlice'

const NotificationCenter = () => {
    const [notificationArray, setNotificationArray] = useState<JSX.Element[]>([])
    const [joiningPrivateGroup, setJoiningPrivateGroup] = useState<boolean>(false)
    
    const user: IUserState = useAppSelector(state => state.user)
    const userGroups: IGroup[] = useAppSelector(state => state.group.userGroups)
    const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)
    const activeDropdown: string = useAppSelector(state => state.app.activeDropdown)

    const dispatch = useAppDispatch()

    const router = useRouter()

    useEffect(() => {
        const notifArrTemp: JSX.Element[] = 
        user?.notifications?.slice()
        ?.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        ?.map((notif: INotification, i: number) => {
            return <div onClick={(e) => onNotificationClick(e, notif)} key={i} className={`${styles.notification} ${notif.read ? styles.read : null}`}>
                {
                    notif?.notificationType === 'message-like' && notif?.likers?.length && notif?.group ?
                        <h5>{notif.likers[0]} {notif.likers.length > 1 ? 'and ' + (notif.likers.length - 1) + ` other${notif.likers.length > 2 ? 's' : ''}` : ''} liked your message in "{notif.group.name}"</h5>
                    : notif?.notificationType === 'dm-like' && notif?.likers?.[0] ?
                        <h5>{notif.likers[0]} liked your direct message</h5>
                    : notif?.notificationType === 'group-invite' ?
                    <div className={styles.groupInviteNotif}>
                        <h5 className={styles.text}>{notif.inviter} invited you to join "{notif.group?.name}"</h5>
                        {
                            !notif.read ?
                            <>
                                <button id='reject' className={styles.rejectBtn}>Reject</button>
                                <button id='join' className={styles.joinBtn}>Join</button>
                            </>
                            : null
                        }
                    </div>
                    : notif?.notificationType === 'group-approved' ?
                        <h5>Your request for the creation of "{notif.group?.name}" has been approved</h5>
                    : null
                }
            </div>
        })

        setNotificationArray(notifArrTemp)
    }, [user, router.pathname, userGroups])

    const markNotificationAsRead = async (notification:  INotification, updateUserNotifs: boolean) => {
        if (notification?.read) return
        const res = await axios.put('/api/markNotificationAsRead', {
            userId: user._id,
            notificationId: notification._id
        })
        if (res?.data && updateUserNotifs) {
            dispatch(setUser({...user, notifications: user.notifications.map(notif => {
                if (notif._id === notification._id) return {...notif, read: true}
                return notif
            })}))
        }
    }

    const handleJoinGroup = async (groupId, notifId) => {
        try {
            const res = await axios.post('/api/joinGroup', {
                userId: user._id,
                userName: user.username,
                groupId: groupId,
                passwordException: true
            })
    
            const newGroup: IGroup = res.data
            if (!newGroup?._id) return

            dispatch(setUser({ 
                ...user, 
                groups: [newGroup._id.toString(), ...user.groups ] ,
                notifications: user.notifications.map(notif => {
                    if (notif._id === notifId) return {...notif, read: true}
                    return notif
                })
            }))

            dispatch(setUserGroups([ newGroup, ...userGroups ]))
            dispatch(setSelectedGroup(newGroup))
            router.replace('/home')
        } catch(err) {
          console.log(err)
        }
      }

    const onNotificationClick = async (e, notification: INotification) => {
        if (notification.notificationType === 'group-invite' && e.target?.id !=='reject' && e.target?.id !=='join') return

        switch(notification.notificationType) {
            case 'message-like':
                await markNotificationAsRead(notification, true)
                const res = await axios.put('/api/setLastSeenMsgId', {
                    userId: user._id,
                    msgId: notification.msgId,
                    groupId: notification.group?.id
                })
                const resData: ILastSeenMsg[] = res.data
                
                if (router.pathname !== '/home') router.replace('/home')
                const selectedGroupTemp = userGroups.find(g => g._id === notification.group?.id)
                dispatch(setSelectedGroup(selectedGroupTemp || selectedGroup))

                scrollToMessage(resData, selectedGroup._id)
                break
            case 'dm-like':
                await markNotificationAsRead(notification, true)
                if (notification?.likers?.[0] && notification?.likerId) dispatch(setSelectedDmPerson({ _id: notification.likerId.toString(), username: notification.likers[0] }))
                if (router.pathname !== '/direct-messages') router.replace('/direct-messages')
                break
            case 'group-invite':
                await markNotificationAsRead(notification, false)
                if (e.target.id === 'join') handleJoinGroup(notification.group?.id,  notification._id)
                break
            case 'group-approved':
                await markNotificationAsRead(notification, false)
                handleJoinGroup(notification.group?.id, notification._id)
                break
        }
    }

    return (
        <div className={styles.notificationContainer}>
            <NotificationBellIcon />
            
            {
                user?.notifications?.filter(notif => !notif.read).length > 0
                ? <h5 className={styles.unreadCount}>{user?.notifications.filter(notif => !notif.read).length}</h5>
                : null
            }

            <div className={`${styles.notificationDropdown} ${activeDropdown === 'notifications' ? styles.active : null}`}>
                { notificationArray }
            </div>
        </div>
    )
}

export default NotificationCenter