import React, { useEffect, useRef } from 'react'
import styles from '../styles/Confirmation.module.css'

const Confirmation = ({ exitFunction, enterFunction }) => {
	const inputRef: React.MutableRefObject<any> = useRef(null)

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)

		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	const handleKeyDown = e => {
		if (e.code === 'Tab') e.preventDefault()
	}

	return (
		<div className={styles.container}>
			<div className={styles.confirmationBox}>
				<h2 className={styles.title}>Enter Group Password</h2>
				<input
					ref={inputRef}
					className={styles.passwordInput}
					type='password'
				/>
				<button
					onClick={exitFunction}
					className={styles.cancelBtn}>
					Cancel
				</button>
				<button
					onClick={() => enterFunction(inputRef.current.value)}
					className={styles.joinBtn}>
					Join
				</button>
			</div>
		</div>
	)
}

export default Confirmation
