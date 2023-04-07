import axios from 'axios'
import { NextPage } from 'next'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import styles from '../styles/LogReg.module.css'
import LoadingAnimation from '../components/LoadingAnimation'

const register: NextPage = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const form = e.target as HTMLFormElement
    
            const username: HTMLInputElement | null = form.querySelector('#username')
            const password: HTMLInputElement | null = form.querySelector('#password')
            const email: HTMLInputElement | null = form.querySelector('#email')
            const gender: HTMLInputElement | null = form.querySelector('#gender')
            const bVersion: HTMLInputElement | null = form.querySelector('#bVersion')
            
            if (username == null || password == null || email == null || gender == null || bVersion == null) return
            if (gender.value === 'Gender' || bVersion.value === 'Prefered Bible Version') return
    
            const res = await axios.post('/api/auth/register', {
                username: username?.value,
                password: password?.value,
                email: email?.value,
                gender: gender?.value,
                bVersion: bVersion?.value,
            })

    
            const newUser = res.data
    
            if (newUser?._id?.length) {
                router.replace('/login')
            } else throw new Error('Could not Register')
        } catch (err) {
            console.log(err)
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        signIn('google', { callbackUrl: `/home` })
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <input minLength={3} maxLength={20} disabled={isLoading} id="username" type="text" placeholder='username' required />
                <input minLength={6} disabled={isLoading} id="password" type="password" placeholder='password' required />
                <input disabled={isLoading} id="email" type="email" placeholder='email' required />
                <div className={styles.genderAndVersion}>
                    <select disabled={isLoading} id="gender" name='gender' defaultValue='Gender' required>
                        <option value="Gender" disabled hidden>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select disabled={isLoading} id="bVersion" name='bVersion' defaultValue='Prefered Bible Version' required>
                        <option value="Prefered Bible Version" disabled hidden>Prefered Bible Version</option>
                        <option value="NIV">NIV</option>
                        <option value="ESV">ESV</option>
                    </select>
                </div>
                {
                    isLoading
                    ? <div className={styles.loading}><LoadingAnimation /></div>
                    : <button type="submit">Submit</button>
                }
                <button disabled={isLoading} onClick={handleGoogleSignIn} className={styles.buttonCustom}>Sign in with Google</button>
                <Link href='/login' replace>Log In</Link>
            </form>
        </div>
    )
}

export default register