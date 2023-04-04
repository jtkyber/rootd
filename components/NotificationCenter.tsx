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

const NotificationCenter = () => {
    const [active, setActive] = useState(false)
    const user: IUserState = useAppSelector(state => state.user.user)
    const userGroups: IGroup[] = useAppSelector(state => state.group.userGroups)
    const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)

    const dispatch = useAppDispatch()

    const router = useRouter()

    useEffect(() => {
        document.addEventListener('click', closeNotifications)
        return () => document.removeEventListener('click', closeNotifications)
    }, [])

    const closeNotifications = (e) => {
        if (!(e.target as SVGSVGElement).classList.contains(styles.bellIcon)) setActive(false)
    }

    const markNotificationAsRead = async (notification:  INotification) => {
        await axios.put('/api/markNotificationAsRead', {
            userId: user._id,
            notificationId: notification._id
        })
    }

    const onNotificationClick = async (notification:  INotification) => {
        await markNotificationAsRead(notification)

        switch(notification.notificationType) {
            case 'message-like':
                for (const group of userGroups) {
                    if (group?._id?.toString() === notification?.group?.id.toString()) {
                        const res = await axios.put('/api/setLastSeenMsgId', {
                            userId: user._id,
                            msgId: notification.msgId,
                            groupId: selectedGroup._id
                        })
                        const resData: ILastSeenMsg[] = res.data
                        dispatch(setUser({...user, lastSeenMsgs: resData, notifications: user.notifications.map(notif => {
                            if (notif._id === notification._id) return {...notif, read: true}
                            return notif
                        })}))
                        if (router.pathname !== '/home') router.replace('/home')
                        dispatch(setSelectedGroup(group))
                        scrollToMessage(resData, selectedGroup._id)
                    }
                }
        }
    }

    return (
        <div className={styles.navigationContainer}>
            <NotificationBellIcon active={active} setActive={setActive} />
            
            <h5 className={styles.unreadCount}>{user?.notifications.filter(notif => !notif.read).length}</h5>

            <div className={`${styles.notificationDropdown} ${active ? styles.active : null}`}>
                {
                    user?.notifications?.map((notif: INotification, i: number) => {
                        return <div onClick={() => onNotificationClick(notif)} key={i} className={`${styles.notification} ${notif.read ? styles.read : null}`}>
                            {
                                notif.notificationType === 'message-like' && notif?.likers?.length && notif?.group ?
                                    <h5>{notif?.likers?.[0]} {notif.likers.length > 1 ? 'and ' + (notif.likers.length - 1) + ` other${notif.likers.length > 2 ? 's' : ''}` : ''} liked your message in "{notif.group.name}"</h5>
                                : null
                            }
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default NotificationCenter