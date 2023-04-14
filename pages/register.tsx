import axios from 'axios'
import { NextPage } from 'next'
import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import styles from '../styles/LogReg.module.css'
import LoadingAnimation from '../components/LoadingAnimation'

const register: NextPage = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errMessage, setErrMessage] = useState('')

    const usernameRef: React.MutableRefObject<any> = useRef(null)

    const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        try {
            setIsLoading(true)
            setErrMessage('')
            const form = e.target as HTMLFormElement
    
            const username: HTMLInputElement | null = usernameRef?.current
            const password: HTMLInputElement | null = form.querySelector('#password')
            const email: HTMLInputElement | null = form.querySelector('#email')
            const gender: HTMLInputElement | null = form.querySelector('#gender')
            const bVersion: HTMLInputElement | null = form.querySelector('#bVersion')
    
            const res = await axios.post('/api/auth/register', {
                username: username?.value,
                password: password?.value,
                email: email?.value,
                gender: gender?.value,
                bVersion: bVersion?.value,
            })
            
            if (res?.data?.error) {
                setErrMessage(res.data.error)
            }

            const newUser = res.data
            if (newUser?._id?.length) {
                router.replace('/login')
            } else throw new Error('Could not Register')
        } catch (err) {
            setIsLoading(false)
            if (err?.response?.data) setErrMessage(err.response.data)
        }
    }

    const handleGoogleSignUp = async (e) => {
        e.preventDefault()
        try {
            await signIn('google', { callbackUrl: `/continue-signup` })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <h5 className={styles.errorMessage}>{errMessage}</h5>
                <input ref={usernameRef} minLength={3} maxLength={20} disabled={isLoading} type="text" placeholder='username' required />
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
                <button disabled={isLoading} onClick={handleGoogleSignUp} className={styles.buttonCustom}>Sign up with Google</button>
                <span className={styles.logRegSwitch}>Already have an account? <Link href='/login' replace>Log In</Link></span>
            </form>
        </div>
    )
}

export default register