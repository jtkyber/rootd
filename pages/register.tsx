import axios from 'axios'
import { NextPage } from 'next'
import React from 'react'
import { useRouter } from 'next/router'
import Nav from '../components/Nav'
import styles from '../styles/LogReg.module.css'
import { useAppDispatch } from '../redux/hooks'
import { IUserState, setUser } from '../redux/userSlice'

const register: NextPage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        try {
            const form = e.target as HTMLFormElement
    
            const username: HTMLInputElement | null = form.querySelector('#username')
            const password: HTMLInputElement | null = form.querySelector('#password')
            const email: HTMLInputElement | null = form.querySelector('#email')
            const gender: HTMLInputElement | null = form.querySelector('#gender')
            const bVersion: HTMLInputElement | null = form.querySelector('#bVersion')
            
            if (username == null || password == null || email == null || gender == null || bVersion == null) return
            if (gender.value === 'Gender' || bVersion.value === 'Prefered Bible Version') return
    
            const res = await axios.post('/api/register', {
                username: username?.value,
                password: password?.value,
                email: email?.value,
                gender: gender?.value,
                bVersion: bVersion?.value,
            })
    
            const newUser: IUserState = res.data
    
            if (newUser?._id?.length) {
                dispatch(setUser(newUser))
                router.replace('/home')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={styles.container}>
            <Nav />
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <input id="username" type="text" placeholder='username' required />
                <input id="password" type="password" placeholder='password' required />
                <input id="email" type="email" placeholder='email' required />
                <select id="gender" name='gender' defaultValue='Gender' required>
                    <option value="Gender" disabled hidden>Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <select id="bVersion" name='bVersion' defaultValue='Prefered Bible Version' required>
                    <option value="Prefered Bible Version" disabled hidden>Prefered Bible Version</option>
                    <option value="NIV">NIV</option>
                    <option value="ESV">ESV</option>
                </select>
                <input type="submit" />
            </form>
        </div>
    )
}

export default register