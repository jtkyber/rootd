import React, { useEffect, useState } from 'react'
import NotificationBellIcon from './NotificationBellIcon'
import styles from '../styles/Nav.module.css'
import { IUserState, setUser } from '../redux/userSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { ILastSeenMsg, INotification } from '../models/userModel'
import axios from 'axios'
import { IGroup } from '../models/groupModel'
import { setSelectedGroup } from '../redux/groupSlice'
import { useRouter } from 'next/router'
import scrollToMessage from '../utils/scrollToMessage'
import { ISelectedDmPerson, setSelectedDmPerson } from '../redux/appSlice'
import stylesChat from '../styles/ChatArea.module.css'

const NotificationCenter = () => {
    const [notificationArray, setNotificationArray] = useState<JSX.Element[]>([])
    
    const user: IUserState = useAppSelector(state => state.user)
    const userGroups: IGroup[] = useAppSelector(state => state.group.userGroups)
    const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)
    const selectedDmPerson: ISelectedDmPerson = useAppSelector(state => state.app.selectedDmPerson)
    const activeDropdown: string = useAppSelector(state => state.app.activeDropdown)

    const dispatch = useAppDispatch()

    const router = useRouter()

    useEffect(() => {
        const notifArrTemp: JSX.Element[] = 
        user?.notifications?.slice()
        ?.filter(n => !n.read || (n.read && (Date.now() - Date.parse(n.date) < 10000)))
        ?.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        ?.map((notif: INotification, i: number) => {
            return <div onClick={() => onNotificationClick(notif)} key={i} className={`${styles.notification} ${notif.read ? styles.read : null}`}>
                {
                    notif?.notificationType === 'message-like' && notif?.likers?.length && notif?.group ?
                        <h5>{notif.likers[0]} {notif.likers.length > 1 ? 'and ' + (notif.likers.length - 1) + ` other${notif.likers.length > 2 ? 's' : ''}` : ''} liked your message in "{notif.group.name}"</h5>
                    : notif?.notificationType === 'dm-like' && notif?.likers?.[0] ?
                        <h5>{notif.likers[0]} liked your direct message</h5>
                    : null
                }
            </div>
        })

        setNotificationArray(notifArrTemp)
    }, [user?.notifications, router.pathname, userGroups])


    // const closeNotifications = (e) => {
    //     if (!(e.target as SVGSVGElement).classList.contains(styles.bellIcon)) dispatch(setActiveDropdown(''))
    // }

    const markNotificationAsRead = async (notification:  INotification) => {
        if (notification?.read) return
        await axios.put('/api/markNotificationAsRead', {
            userId: user._id,
            notificationId: notification._id
        })
    }

    const onNotificationClick = async (notification: INotification) => {
        await markNotificationAsRead(notification)

        switch(notification.notificationType) {
            case 'message-like':
                const res = await axios.put('/api/setLastSeenMsgId', {
                    userId: user._id,
                    msgId: notification.msgId,
                    groupId: notification.group?.id
                })
                const resData: ILastSeenMsg[] = res.data

                dispatch(setUser({...user, notifications: user.notifications.map(notif => {
                    if (notif._id === notification._id) return {...notif, read: true}
                    return notif
                })}))
                
                if (router.pathname !== '/home') router.replace('/home')
                const selectedGroupTemp = userGroups.find(g => g._id === notification.group?.id)
                dispatch(setSelectedGroup(selectedGroupTemp || selectedGroup))

                scrollToMessage(resData, selectedGroup._id)
                break
            case 'dm-like':
                dispatch(setUser({...user, notifications: user.notifications.map(notif => {
                    if (notif._id === notification._id) return {...notif, read: true}
                    return notif
                })}))
                if (notification?.likers?.[0] && notification?.likerId) dispatch(setSelectedDmPerson({ _id: notification.likerId.toString(), username: notification.likers[0] }))
                if (router.pathname !== '/direct-messages') router.replace('/direct-messages')
                break
        }
    }

    return (
        <div className={styles.notificationContainer}>
            <NotificationBellIcon />
            
            {
                user?.notifications.filter(notif => !notif.read).length > 0
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