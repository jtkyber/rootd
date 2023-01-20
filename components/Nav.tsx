import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styles from '../styles/Nav.module.css'

const Nav: React.FC = () => {
    const router = useRouter()

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <h1>Bible Study</h1>
            </div>
            <div className={styles.right}>
                {
                    router.asPath === '/'
                    ? <Link href='/login'>Log In</Link>
                    : router.asPath === '/login' || router.asPath === '/register'
                        ? <Link href='/'>Back</Link>
                        : router.asPath === '/home'
                            ? 
                            <>
                                <Link href='/groupSearch'>Find Group</Link>
                                <Link href='/home'>DMs</Link>
                                <Link href='/home'>Notifications</Link>
                                <Link href='/home'>Settings</Link>
                            </>
                            : router.asPath === '/groupSearch'
                                ?
                                <>
                                    <Link href='/home'>Back</Link>
                                    <Link href='/groupSearch'>DMs</Link>
                                    <Link href='/groupSearch'>Notifications</Link>
                                    <Link href='/groupSearch'>Settings</Link>
                                </>
                                : null
                }
            </div>
        </div>
    )
}

export default Nav