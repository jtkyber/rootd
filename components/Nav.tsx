import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NotificationCenter from './NotificationCenter'
import styles from '../styles/Nav.module.css'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setActiveDropdown } from '../redux/appSlice'
import Settings from './Settings'
import Logo from './Logo'
import DmIcon from './DmIcon'
import { IUserState } from '../redux/userSlice'
import axios from 'axios'
import HomeIcon from './HomeIcon'

const Nav = ({ channels }) => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const [hasNewDms, setHasNewDms] = useState(false)

    const activeDropdown: string = useAppSelector(state => state.app.activeDropdown)
    const user: IUserState = useAppSelector(state => state.user)

    useEffect(() => {
        if (!user._id) return
        checkForNewDms()
    }, [user._id, router.pathname])
    
    const checkForNewDms = async () => {
        const hasNewDms = await axios.get(`/api/checkIfUnreadDms?userId=${user._id}`)
        setHasNewDms(hasNewDms?.data)
    }

    useEffect(() => {
        document.addEventListener('click', closeNotifications)
        return () => document.removeEventListener('click', closeNotifications)
    }, [activeDropdown])

    useEffect(() => {
        if (!channels?.[0]) return
        
        channels?.[0].bind('check-for-new-dms', () => {
            checkForNewDms()
        })

        return () => {
            channels?.[0].unbind('check-for-new-dms')
        }
    }, [channels])

    const closeNotifications = (e) => {
        const el = e.target as SVGSVGElement
        if (el.classList.contains(styles.bellIcon)){
            dispatch(setActiveDropdown(activeDropdown === 'notifications' ? '' : 'notifications'))
        } else if (el.classList.contains(styles.settingsIcon)) {
            dispatch(setActiveDropdown(activeDropdown === 'settings' ? '' : 'settings'))
        } else dispatch(setActiveDropdown(''))
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <Logo />
            </div>
            <div className={styles.right}>
                {
                    router.pathname === '/'
                    ? <Link href='/login'>Log In</Link>
                    : router.pathname === '/login' || router.pathname === '/register'
                        ? <Link href='/'>Back</Link>
                        : router.pathname === '/home'
                            ? 
                            <>
                                <Link href='/group-search'><h4 className={styles.findGroupText}>Find Group</h4></Link>
                                <Link href='/direct-messages'><DmIcon hasNewDms={hasNewDms} /></Link>
                                <NotificationCenter />
                                <Settings />
                            </>
                            : router.pathname === '/direct-messages'
                                ? 
                                <>
                                    {/* <Link href='/group-search'><h4 className={styles.findGroupText}>Find Group</h4></Link> */}
                                    <Link href='/home'><HomeIcon /></Link>
                                    <NotificationCenter />
                                    <Settings />
                                </>
                                : router.pathname === '/group-search'
                                    ?
                                    <>
                                        <Link href='/home'><HomeIcon /></Link>
                                        <Link href='/direct-messages'><DmIcon hasNewDms={hasNewDms} /></Link>
                                        <NotificationCenter />
                                        <Settings />
                                    </>
                                    : null
                }
            </div>
        </div>
    )
}

export default Nav