import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import styles from '../styles/Layout.module.css'
import { IUserState, setUser } from '../redux/userSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { IGroup } from '../models/groupModel'
import Pusher, { PresenceChannel } from 'pusher-js'
import axios from 'axios'
import { useRouter } from 'next/router'

const Layout = (props) => {
    const user: IUserState = useAppSelector(state => state.user)
    const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)
    const [pusher, setPusher] = useState<Pusher | null>(null)
    const [channels, setChannels]: any = useState<PresenceChannel[] | []>([])
    
    const dispatch = useAppDispatch()

    const router = useRouter()

    useEffect(() => {
        if (!user?._id) return
        if (router?.pathname !== 'direct-messages') {
            (async () => {
                await axios.put('/api/setCurrentDmPerson', {
                    userId: user._id,
                    person: null
                })
            })()
        }
    }, [router.pathname, user._id])

    useEffect(() => {
        if (!user?._id) return

        // removes notifications that have been read over one day prior to current day
        (async () => await axios.put(`/api/removeExpiredNotifications`, { userId: user._id }))()

        if (!pusher && user.username && process.env.PUSHER_KEY && process.env.PUSHER_CLUSTER) {
            const pusher = new Pusher(process.env.PUSHER_KEY, {
                cluster: process.env.PUSHER_CLUSTER,
                authEndpoint: `/api/pusher/auth`,
                auth: {params: {username: user.username}}
            })
            setPusher(pusher)
        }
    }, [user._id])

    useEffect(() => {
        if (!pusher || !user?._id) return
        if (selectedGroup && router.pathname === '/home') {
            const channelsTemp = [`${user._id}`, `presence-${selectedGroup._id}`].map(channelName => {
                return pusher.subscribe(channelName)
            })
            setChannels(channelsTemp)
        } else {
            setChannels([pusher.subscribe(`${user._id}`)])
        }
        
        return () => {
            if (pusher.channels.channels) {
                for (const channelName in pusher.channels.channels) {
                    pusher.unsubscribe(channelName)
                }
            }
            setChannels([])
        }
    }, [user._id, selectedGroup, router.pathname, pusher])
    
    useEffect(() => {
        if (!channels?.[0]) return

        channels[0].bind('update-notifications', data => {
            updateNotifications(data)
        })
        
        return () => {
            channels?.[0].unbind('update-notifications')
        }
    }, [channels])
    
    const updateNotifications = async (data) => {
        let notifs
        switch(data.notificationType) {
            case 'message-like':
                if ((selectedGroup._id === data.groupId) && (router.pathname === '/home')) return
                const res = await axios.post('/api/postNotification', {
                    notificationType: data.notificationType,
                    msgId: data.msgId,
                    newLiker: data.newLiker,
                    userId: user._id,
                    groupId: data.groupId,
                    groupName: data.groupName,
                    userName: data.authorName
                })
                notifs = res.data
                break
            case 'dm-like':
                notifs = JSON.parse(data.notification)
                break
            case 'group-invite':
                notifs = JSON.parse(data.notification)
                break
            case 'group-approved':
                notifs = JSON.parse(data.notification)
                break
            case 'group-rejected':
                notifs = JSON.parse(data.notification)
                break
        }
        if (notifs) dispatch(setUser({...user, notifications: notifs}))
    }

    const renderChildren = () => {
        return React.Children.map(props.children, (child) => {
            return React.cloneElement(child, {
                channels: channels
            })
        })
    }

    return (
        <div className={styles.container}>
            <Nav channels={channels} />
            <main>{renderChildren()}</main>
            <Footer />
        </div>
    )
}

export default Layout