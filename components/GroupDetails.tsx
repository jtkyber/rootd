import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { IGroup } from '../models/groupModel'
import copyTextSvg from '../public/copyText.svg'
import { setSelectedGroup, setSingleGroup, setUserGroups } from '../redux/groupSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { IUserState } from '../redux/userSlice'
import styles from '../styles/Home.module.css'
import GroupDetailsArrow from './GroupDetailsArrow'
import MuteBtn from './MuteBtn'
import OptionsDots from './OptionsDots'

const GroupDetails = ({
	selectedGroup,
	username,
	onlineMembers,
}: {
	selectedGroup: IGroup
	username: string
	onlineMembers: string[]
}) => {
	const [detailedExpanded, setDetailedExpanded] = useState(false)
	const [optionsActive, setOptionsActive] = useState(false)
	const [memberArray, setMemberArray] = useState<JSX.Element[]>([])

	const showPasswordRef: React.MutableRefObject<any> = useRef(null)
	const passwordRef: React.MutableRefObject<any> = useRef(null)
	const passwordContainerRef: React.MutableRefObject<any> = useRef(null)

	const user: IUserState = useAppSelector(state => state.user)
	const userGroups: IGroup[] = useAppSelector(state => state.group.userGroups)

	const dispatch = useAppDispatch()

	const router = useRouter()

	useEffect(() => {
		document.addEventListener('click', handlePageClick)
		return () => {
			document.removeEventListener('click', handlePageClick)
		}
	}, [optionsActive])

	useEffect(() => {
		if (!passwordContainerRef?.current || !showPasswordRef?.current || !passwordRef?.current) return
		passwordContainerRef.current.classList.remove(styles.copied)
		showPasswordRef.current.style.display = 'block'
		passwordContainerRef.current.style.display = 'none'
		passwordRef.current.innerText = ''
	}, [selectedGroup._id])

	useEffect(() => {
		const memberArrayTemp: JSX.Element[] = selectedGroup?.members
			?.slice()
			?.sort((a, b) => (onlineMembers.includes(a) ? -1 : 1))
			?.map((member, i) => (
				<h5
					className={`${styles.member} ${onlineMembers.includes(member) ? styles.inGroup : null}`}
					key={i}>
					{member}
				</h5>
			))

		setMemberArray(memberArrayTemp)
	}, [selectedGroup, onlineMembers])

	const handlePageClick = e => {
		if (e.target.id === 'optionDots') setOptionsActive(!optionsActive)
		else if (!e.target?.classList?.contains(styles.groupOptions)) setOptionsActive(false)
	}

	const leaveGroup = async () => {
		const res = await axios.put('/api/leaveGroup', {
			username: username,
			groupId: selectedGroup._id,
		})
		if (res.data) router.reload()
	}

	const toggleGroupNotications = async () => {
		const res = await axios.put('/api/toggleGroupNotications', {
			groupId: selectedGroup._id,
			username: user.username,
		})

		if (res.data && !selectedGroup.membersWithGroupMuted.includes(username)) {
			dispatch(
				setSelectedGroup({
					...selectedGroup,
					membersWithGroupMuted: [...selectedGroup.membersWithGroupMuted, username],
				})
			)
			for (let i = 0; i < userGroups.length; i++) {
				if (userGroups[i]._id === selectedGroup._id) {
					const groupCopy = { ...userGroups[i] }
					groupCopy.membersWithGroupMuted = [...selectedGroup.membersWithGroupMuted, username]
					dispatch(setSingleGroup({ index: i, group: groupCopy }))
					break
				}
			}
		} else if (!res.data && selectedGroup.membersWithGroupMuted.includes(username)) {
			const indexOfName = selectedGroup.membersWithGroupMuted.indexOf(username)
			if (indexOfName < 0) return
			const newArray = selectedGroup.membersWithGroupMuted.slice()
			newArray.splice(indexOfName, 1)
			dispatch(setSelectedGroup({ ...selectedGroup, membersWithGroupMuted: newArray }))
			for (let i = 0; i < userGroups.length; i++) {
				if (userGroups[i]._id === selectedGroup._id) {
					const groupCopy = { ...userGroups[i] }
					groupCopy.membersWithGroupMuted = [...newArray]
					dispatch(setSingleGroup({ index: i, group: groupCopy }))
					break
				}
			}
		}
	}

	const getGroupPassword = async e => {
		const res = await axios.get(`/api/getGroupPassword?groupId=${selectedGroup._id}`)
		if (res?.data) {
			showPasswordRef.current.style.display = 'none'
			passwordContainerRef.current.style.display = 'flex'
			passwordRef.current.innerText = res?.data
		}
	}

	const selectPassword = () => {
		navigator.clipboard.writeText(passwordRef.current.innerText)
		if (passwordContainerRef.current.classList.contains(styles.copied)) return
		passwordContainerRef.current.classList.add(styles.copied)
	}

	const removeGroup = async () => {
		const res = await axios.post('/api/removeGroup', {
			groupId: selectedGroup._id,
			username: username,
		})

		if (res.data) {
			const groupId = res.data
			const newUserGroups = userGroups.slice().filter(g => g._id !== groupId)
			dispatch(setUserGroups(newUserGroups))
		}
	}

	return selectedGroup?._id ? (
		<div className={`${styles.groupDetails} ${detailedExpanded ? styles.show : null}`}>
			<div className={styles.topRight}>
				<button
					data-tooltip-msg='Mute Group'
					data-tooltip-position='below'
					tabIndex={-1}
					onClick={toggleGroupNotications}
					className={`${styles.muteGroup} hasTooltip ${
						selectedGroup.membersWithGroupMuted.includes(username) ? styles.muted : null
					}`}>
					<MuteBtn />
				</button>
				<div className={styles.groupOptionsContainer}>
					<OptionsDots />
					<div className={`${styles.groupOptions} ${optionsActive ? styles.show : null}`}>
						<button
							onClick={leaveGroup}
							className={styles.leaveGroup}>
							Leave Group
						</button>
						{username === selectedGroup.groupAdmin ? (
							<button
								onClick={removeGroup}
								className={styles.removeGroup}>
								Remove Group
							</button>
						) : null}
					</div>
				</div>
			</div>
			<div className={styles.sectionOne}>
				<h2 className={styles.name}>{selectedGroup.name}</h2>
				<h5
					lang='en'
					className={styles.description}>
					{selectedGroup.description}
				</h5>
			</div>

			<div className={styles.sectionTwo}>
				<h3>Members</h3>
				<div className={styles.members}>{memberArray}</div>
			</div>

			<div
				className={`${styles.bottomSection} ${
					selectedGroup.groupAdmin !== username || !selectedGroup.isPrivate ? styles.hide : null
				}`}>
				<button
					ref={showPasswordRef}
					onClick={getGroupPassword}
					className={styles.showPasswordBtn}>
					Show Group Password
				</button>
				<div
					ref={passwordContainerRef}
					className={`${styles.passwordContainer}`}>
					<h5
						ref={passwordRef}
						className={styles.password}></h5>
					<Image
						onClick={selectPassword}
						src={copyTextSvg}
						alt='Copy text'
					/>
				</div>
			</div>

			<button
				tabIndex={-1}
				className={`${styles.expandGroupDetailsBtn} ${detailedExpanded ? styles.show : null}`}>
				<GroupDetailsArrow clickFunction={() => setDetailedExpanded(!detailedExpanded)} />
			</button>
		</div>
	) : null
}

export default GroupDetails
