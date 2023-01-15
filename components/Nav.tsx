import Link from 'next/link'
import React from 'react'
import styles from '../styles/Nav.module.css'

const Nav: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <h1>Bible Study</h1>
            </div>
            <div className={styles.right}>
                <Link href='/register'>Log In</Link>
            </div>
        </div>
    )
}

export default Nav