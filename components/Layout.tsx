import React from 'react'
import styles from '../styles/Layout.module.css'
import Nav from './Nav'

const Layout = ({ children }: {children: React.ReactNode}) => {
    return (
        <div className={styles.container}>
            <Nav />
            <main>{children}</main>
        </div>
    )
}

export default Layout