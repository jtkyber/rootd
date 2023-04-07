import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NotificationCenter from './NotificationCenter'
import styles from '../styles/Nav.module.css'
import Pusher from 'pusher-js/types/src/core/pusher'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setActiveDropdown } from '../redux/appSlice'
import Settings from './Settings'
import Image from 'next/image'
import Logo from './Logo'

const Nav = ({ pusher }: {pusher: Pusher | null}) => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const activeDropdown: string = useAppSelector(state => state.app.activeDropdown)

    useEffect(() => {
        document.addEventListener('click', closeNotifications)
        return () => document.removeEventListener('click', closeNotifications)
    }, [activeDropdown])

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
                                <Link href='/groupSearch'>Find Group</Link>
                                <Link href='/home'>DMs</Link>
                                <NotificationCenter />
                                <Settings />
                            </>
                            : router.pathname === '/groupSearch'
                                ?
                                <>
                                    <Link href='/home'>My Groups</Link>
                                    <Link href='/groupSearch'>DMs</Link>
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