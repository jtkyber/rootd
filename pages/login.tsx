import { NextPage } from 'next'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import styles from '../styles/LogReg.module.css'
import { useAppDispatch } from '../redux/hooks'
import axios from 'axios'
import { IUserState, setUser } from '../redux/userSlice'
import getUser from '../utils/getUser'

const register: NextPage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        try {
            const form = e.target as HTMLFormElement
    
            const email: HTMLInputElement | null = form.querySelector('#email')
            const password: HTMLInputElement | null = form.querySelector('#password')

            if (email == null || password == null) return
    
            const status = await signIn('credentials', {
                redirect: false,
                email: email.value,
                password: password.value,
                callbackUrl: '/home'
            })

            console.log('status', status)

            if (status?.ok) {
                const user: IUserState = await getUser(email.value)
                if (user.bVersion) {
                    dispatch(setUser({
                        bVersion: user.bVersion,
                        groups: user.groups,
                        notifications: user.notifications,
                        dmPeople: user.dmPeople,
                        strikes: user.strikes,
                        directMsgs: user.directMsgs
                    }))
                    router.replace(`${status?.url}`)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleGoogleSignIn = async () => {
        await signIn('google', { callbackUrl: `/home` })
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input id="email" type="email" placeholder='email' required />
                <input id="password" type="password" placeholder='password' required />
                <button type="submit">Submit</button>
                <button onClick={handleGoogleSignIn} className={styles.buttonCustom}>Sign in with Google</button>
                <Link href='/register' replace>Register</Link>
            </form>
        </div>
    )
}

export default register