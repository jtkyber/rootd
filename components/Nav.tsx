import axios from 'axios'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { setActiveDropdown } from '../redux/appSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { IUserState } from '../redux/userSlice'
import styles from '../styles/Nav.module.css'
import DmIcon from './DmIcon'
import HomeIcon from './HomeIcon'
import Logo from './Logo'
import NotificationCenter from './NotificationCenter'
import Settings from './Settings'

const Nav = ({ channels }) => {
	const router = useRouter()
	const dispatch = useAppDispatch()

	const { data: session }: any = useSession()

	const [hasNewDms, setHasNewDms] = useState(false)

	const activeDropdown: string = useAppSelector(state => state.app.activeDropdown)
	const user: IUserState = useAppSelector(state => state.user)

	useEffect(() => {
		if (!user._id) return
		checkForNewDms()
	}, [user._id, router.pathname])

	useEffect(() => {
		document.addEventListener('click', closeNotifications)
		return () => document.removeEventListener('click', closeNotifications)
	}, [activeDropdown])

	useEffect(() => {
		if (!channels?.[0]) return

		if (router.pathname !== '/direct-messages') {
			channels?.[0].bind('check-for-new-dms', data => {
				checkForNewDms()
			})
		} else channels?.[0].unbind('check-for-new-dms')

		return () => {
			channels?.[0].unbind('check-for-new-dms')
		}
	}, [channels, router.pathname])

	const checkForNewDms = async () => {
		const hasNewDms = await axios.get(`/api/checkIfUnreadDms?userId=${user._id}`)
		setHasNewDms(hasNewDms?.data)
	}

	const closeNotifications = e => {
		const el = e.target
		const bell = document.querySelector(`.${styles.bellIcon}`)
		const settings = document.querySelector(`.${styles.settingsIcon}`)
		if (bell?.contains(el)) {
			dispatch(setActiveDropdown(activeDropdown === 'notifications' ? '' : 'notifications'))
		} else if (settings?.contains(el)) {
			dispatch(setActiveDropdown(activeDropdown === 'settings' ? '' : 'settings'))
		} else dispatch(setActiveDropdown(''))
	}

	return (
		<div className={styles.container}>
			<div className={styles.left}>
				{/* <Link className={styles.appTitle} href={router.pathname === '/' ? '/' : '/home'}><span>B</span>ible <span>C</span>hat</Link> */}
				{/* <Image width={30} height={30} alt='Logo' src={'/logo.svg'} /> */}
				<Link
					className={styles.appTitle}
					href={router.pathname === '/' ? '/' : '/home'}>
					root'd
				</Link>
			</div>
			<div className={styles.right}>
				{router.pathname === '/' ? (
					<Link
						className={styles.loginBtn}
						href='/signin'>
						Log In
					</Link>
				) : router.pathname === '/signin' || router.pathname === '/signup' ? (
					<Link
						className={styles.backBtn}
						href='/'>
						Back
					</Link>
				) : router.pathname === '/home' ? (
					<>
						<Link href='/group-search'>
							<h5 className={styles.findGroupBtn}>Find Group</h5>
						</Link>
						{session?.user?.isAdmin ? (
							<Link href='/admin'>
								<h5 className={styles.adminToolsBtn}>Admin Tools</h5>
							</Link>
						) : null}
						<Link
							href='/direct-messages'
							className='hasTooltip'
							data-tooltip-msg='Direct Messages'
							data-tooltip-position='below'>
							<DmIcon hasNewDms={hasNewDms} />
						</Link>
						<NotificationCenter />
						<Settings />
					</>
				) : router.pathname === '/direct-messages' ? (
					<>
						<Link
							href='/home'
							className='hasTooltip'
							data-tooltip-msg='My Groups'
							data-tooltip-position='below'>
							<HomeIcon />
						</Link>
						<NotificationCenter />
						<Settings />
					</>
				) : router.pathname === '/group-search' ? (
					<>
						<Link
							href='/home'
							className='hasTooltip'
							data-tooltip-msg='My Groups'
							data-tooltip-position='below'>
							<HomeIcon />
						</Link>
						<Link
							href='/direct-messages'
							className='hasTooltip'
							data-tooltip-msg='Direct Messages'
							data-tooltip-position='below'>
							<DmIcon hasNewDms={hasNewDms} />
						</Link>
						<NotificationCenter />
						<Settings />
					</>
				) : router.pathname === '/admin' ? (
					<>
						{/* <Link href='/home' className={`${styles.backBtn} hasTooltip`} data-tooltip-msg='My Groups' data-tooltip-position='below'>Back</Link> */}
						<Link
							href='/home'
							className='hasTooltip'
							data-tooltip-msg='My Groups'
							data-tooltip-position='below'>
							<HomeIcon />
						</Link>
					</>
				) : router.pathname === '/account' ? (
					<>
						<Link
							href='/home'
							className='hasTooltip'
							data-tooltip-msg='My Groups'
							data-tooltip-position='below'>
							<HomeIcon />
						</Link>
					</>
				) : null}
			</div>
		</div>
	)
}

export default Nav
