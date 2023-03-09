import React from 'react'
import Nav from './Nav'
import Footer from './Footer'
import styles from '../styles/Layout.module.css'

const Layout = ({ children }: {children: React.ReactNode}) => {
    return (
        <div className={styles.container}>
            <Nav />
            <main>{children}</main>
            <Footer />
        </div>
    )
}

export default Layout