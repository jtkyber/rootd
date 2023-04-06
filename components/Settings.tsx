import React from 'react'
import styles from '../styles/Nav.module.css'
import SettingsIcon from './SettingsIcon'
import { signOut } from 'next-auth/react'
import { useAppSelector } from '../redux/hooks'

const Settings = () => {
    const activeDropdown: string = useAppSelector(state => state.app.activeDropdown)
    
    return (
        <div className={styles.settingsContainer}>
            <SettingsIcon />

            <div className={`${styles.settingsDropdown} ${activeDropdown === 'settings' ? styles.active : null}`}>
                <h5 className={styles.setting} onClick={() => console.log('Manage Account')}>Manage Account</h5>
                <h5 className={styles.setting} onClick={() => signOut({ callbackUrl: '/login' })}>Log Out</h5>
            </div>
        </div>
    )
}

export default Settings