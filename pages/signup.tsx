import axios from 'axios'
import { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import bibleVersions from '../bibleVersions.json'
import LoadingAnimation from '../components/LoadingAnimation'
import googleImage from '../public/google-logo.png'
import styles from '../styles/LogReg.module.css'

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
				router.replace('/signin')
			} else throw new Error('Could not Register')
		} catch (err) {
			setIsLoading(false)
			if (err?.response?.data) setErrMessage(err.response.data)
		}
	}

	const handleGoogleSignUp = async e => {
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
				<h1 className={styles.title}>Sign Up</h1>
				<h5 className={styles.errorMessage}>{errMessage}</h5>
				<input
					ref={usernameRef}
					minLength={3}
					maxLength={20}
					disabled={isLoading}
					type='text'
					placeholder='Name'
					required
				/>
				<input
					minLength={6}
					disabled={isLoading}
					id='password'
					type='password'
					placeholder='Password'
					required
				/>
				<input
					disabled={isLoading}
					id='email'
					type='email'
					placeholder='Email'
					required
				/>
				<div className={styles.genderAndVersion}>
					<select
						disabled={isLoading}
						id='gender'
						name='gender'
						defaultValue='Gender'
						required>
						<option
							value='Gender'
							disabled
							hidden>
							Gender
						</option>
						<option value='male'>Male</option>
						<option value='female'>Female</option>
					</select>
					<select
						disabled={isLoading}
						id='bVersion'
						name='bVersion'
						defaultValue='Bible Version'
						required>
						<option
							value='Bible Version'
							disabled
							hidden>
							Bible Version
						</option>
						{bibleVersions.map((version, i) => (
							<option
								key={i}
								value={version}>
								{version}
							</option>
						))}
					</select>
				</div>
				{isLoading ? (
					<div className={styles.loading}>
						<LoadingAnimation />
					</div>
				) : (
					<button type='submit'>Sign Up</button>
				)}
				<h5 className={styles.orText}>OR</h5>
				<button
					disabled={isLoading}
					onClick={handleGoogleSignUp}
					className={styles.googleSignInBtn}>
					<Image
						src={googleImage}
						alt='Google logo'
					/>
					Sign up with Google
				</button>
				<Link
					className={styles.logRegSwitch}
					href='/signin'
					replace>
					Already have an account?
				</Link>
			</form>
		</div>
	)
}

export default register
