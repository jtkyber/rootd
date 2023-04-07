import { NextPage } from 'next'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import styles from '../styles/LogReg.module.css'
import { useAppDispatch } from '../redux/hooks'
import axios from 'axios'
import { IUserState, setUser } from '../redux/userSlice'
import getUser from '../utils/getUser'
import LoadingAnimation from '../components/LoadingAnimation'

const register: NextPage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        const form = e.target as HTMLFormElement

        const email: HTMLInputElement | null = form.querySelector('#email')
        const password: HTMLInputElement | null = form.querySelector('#password')

        try {
            setIsLoading(true)

            if (email == null || password == null) return
    
            const status = await signIn('credentials', {
                redirect: false,
                email: email.value,
                password: password.value,
                callbackUrl: '/home'
            })

            if (status?.ok) {
                const user: IUserState = await getUser(email.value)
                if (user.username) {
                    dispatch(setUser({...user}))
                    router.replace(`${status?.url}`)
                } else throw new Error('Incorrect email or password')
            } else throw new Error('Incorrect email or password')
        } catch (err) {
            console.log(err)
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        await signIn('google', { callbackUrl: `/home` })
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input disabled={isLoading} id="email" type="email" placeholder='email' required />
                <input minLength={6} disabled={isLoading} id="password" type="password" placeholder='password' required />
                {
                    isLoading
                    ? <div className={styles.loading}><LoadingAnimation /></div>
                    : <button type="submit">Submit</button>
                }
                <button disabled={isLoading} onClick={handleGoogleSignIn} className={styles.buttonCustom}>Sign in with Google</button>
                <Link href='/register' replace>Register</Link>
            </form>
        </div>
    )
}

export default register