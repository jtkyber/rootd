import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import NotificationCenter from './NotificationCenter'
import styles from '../styles/Nav.module.css'

const Nav: React.FC = () => {
    const router = useRouter()

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <h1>Bible Chat</h1>
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
                                <Link href='/home'>Settings</Link>
                            </>
                            : router.pathname === '/groupSearch'
                                ?
                                <>
                                    <Link href='/home'>My Groups</Link>
                                    <Link href='/groupSearch'>DMs</Link>
                                    <NotificationCenter />
                                    <Link href='/groupSearch'>Settings</Link>
                                </>
                                : null
                }
            </div>
        </div>
    )
}

export default Nav