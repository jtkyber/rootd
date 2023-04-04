import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import styles from '../styles/Layout.module.css'
import { IUserState, setUser } from '../redux/userSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { IGroup } from '../models/groupModel'
import Pusher, { PresenceChannel } from 'pusher-js'
import axios from 'axios'

const Layout = (props) => {
    const user: IUserState = useAppSelector(state => state.user.user)
    const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)
    const [pusher, setPusher] = useState<Pusher | null>(null)
    const [channels, setChannels]: any = useState<PresenceChannel[] | []>([])
    
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!user._id) return
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
        if (!pusher || !user._id) return
        if (selectedGroup) {
            const channelsTemp = [`${user._id}`, `presence-${selectedGroup._id}`].map(channelName => {
                return pusher.subscribe(channelName)
            })
            setChannels(channelsTemp)
        } else {
            setChannels([pusher.subscribe(`${user._id}`)])
        }
        
        return () => {
            if (selectedGroup && channels.length) {
                for (const channelName of channels) {
                    pusher.unsubscribe(channelName)
                }
            }
            setChannels([])
        }
    }, [user._id, selectedGroup])

    useEffect(() => {
        if (!channels?.[0]) return
        channels?.[0].bind('update-notifications', data => {
            updateNotifications(data)
        })

        return () => {
            channels?.[0].unbind('update-notifications')
        }
    }, [user._id, channels])

    const updateNotifications = async (data) => {
        const res = await axios.post('/api/postNotification', {
            notificationType: data.notificationType,
            msgId: data.msgId,
            newLiker: data.newLiker,
            userId: user._id,
            groupId: data.groupId,
            groupName: data.groupName
        })

        if (res.data) {
            dispatch(setUser({...user, notifications: res.data}))
        }
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
            <Nav pusher={pusher} />
            <main>{renderChildren()}</main>
            <Footer />
        </div>
    )
}

export default Layout