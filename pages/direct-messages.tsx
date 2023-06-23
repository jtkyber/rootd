import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { PresenceChannel } from 'pusher-js'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import LikeIcon from '../components/LikeIcon'
import LoadingAnimation from '../components/LoadingAnimation'
import NotAuthorizedScreen from '../components/NotAuthorizedScreen'
import { IDm } from '../models/userModel'
import { ISelectedDmPerson, setSelectedDmPerson } from '../redux/appSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { IUserState, setUser } from '../redux/userSlice'
import stylesChat from '../styles/ChatArea.module.css'
import styles from '../styles/Home.module.css'
import { getFormattedDateFromISO } from '../utils/dates'
import getInitials from '../utils/getInitials'
import getUser from '../utils/getUser'
import { useOnScreen } from '../utils/hooks'

let scrollElementId: string

let lastMsgClickedDate
let lastMsgClicked
const resultsLimit = 20

interface IDmPerson {
	username: string
	_id: string
}

const directMessages = ({ channels }: { channels: PresenceChannel[] | [] }) => {
	const { data: session }: any = useSession()

	const textAreaRef: React.MutableRefObject<any> = useRef(null)
	const chatAreaRef: React.MutableRefObject<any> = useRef(null)
	const chatBoxRef: React.MutableRefObject<any> = useRef(null)
	const messagesRef: React.MutableRefObject<any> = useRef(null)
	const resultsEndRef: React.MutableRefObject<any> = useRef(null)

	const [dmPeople, setDmPeople] = useState<IDmPerson[]>([])
	const [lastNextPageFetchTime, setLastNextPageFetchTime] = useState(0)
	const [newMsgsCountObject, setNewMsgsCountObject] = useState<{ [key: string]: number }>({})

	const user: IUserState = useAppSelector(state => state.user)
	const selectedDmPerson: ISelectedDmPerson = useAppSelector(state => state.app.selectedDmPerson)

	const isVisible = useOnScreen(resultsEndRef)

	const dispatch = useAppDispatch()

	const router = useRouter()

	const queryClient = useQueryClient()

	const { data, status, isFetching, fetchNextPage, hasNextPage, error } = useInfiniteQuery(
		['dms', selectedDmPerson],
		fetchDMs,
		{
			getNextPageParam: (lastPage, pages) => lastPage?.cursor,
		}
	)

	const sendMessage = useMutation(
		(msgData: Partial<IDm> & string) => {
			return axios.post('/api/postDM', msgData)
		},
		{
			onSuccess: async newData => {
				addMessage(newData.data)
				textAreaRef.current.value = ''
				chatBoxRef?.current.scrollTo(0, chatBoxRef?.current.scrollHeight)
			},
		}
	)

	const refetch = () => queryClient.resetQueries({ queryKey: ['dms', selectedDmPerson], type: 'active' })

	useEffect(() => {
		if (session?.user) {
			;(async () => {
				if (user?._id && data) refetch()
				const updatedUser: IUserState = await getUser(session.user.email)
				if (!user?._id) {
					if (updatedUser?._id) dispatch(setUser(updatedUser))
					else router.replace('/signin')
				}

				if (updatedUser._id) {
					const res = await axios.get(`/api/getDmPeople?userId=${updatedUser._id}`)
					if (res?.data?.length) {
						setDmPeople(res.data)
						if (!selectedDmPerson?._id?.length) dispatch(setSelectedDmPerson(res.data[0]))
						const unreadObject = await getUnreadMsgsCount(updatedUser._id)
						if (unreadObject) setNewMsgsCountObject(unreadObject)
					}
				}
			})()
		}
	}, [session?.user])

	const getUnreadMsgsCount = async userId => {
		const res2 = await axios.get(`/api/getDmPeopleUnreadMsgCount?userId=${userId}`)
		if (Object.keys(res2.data).length > 0) return res2.data
		else return null
	}

	useEffect(() => {
		if (!channels?.[0]) return

		channels?.[0].bind('fetch-new-group-msgs', data => {
			if (data?.username !== user?.username) addMessage(JSON.parse?.(data.msg))
		})

		channels?.[0].bind('set-msg-like', data => {
			if (data.liker === user.username) return
			setNewMsgLikes(data.msgId, data.isLiked)
		})

		channels?.[0].bind('check-for-new-dms', data => {
			setNewMsgsCountObject({
				...newMsgsCountObject,
				[data.friendName]: newMsgsCountObject?.[data.friendName]
					? newMsgsCountObject[data.friendName] + 1
					: 1,
			})
		})

		return () => {
			channels?.[0].unbind('fetch-new-group-msgs')
			channels?.[0].unbind('set-msg-like')
			channels?.[0].unbind('check-for-new-dms')
		}
	}, [channels, data, user.username, newMsgsCountObject])

	useEffect(() => {
		const now = Date.now()
		if (!isVisible || isFetching || now - lastNextPageFetchTime < 250 || !hasNextPage) return
		setLastNextPageFetchTime(now)
		handleLoadMore()
	}, [isVisible])

	useEffect(() => {
		if (!selectedDmPerson?.username) return
		;(async () => {
			const copy = { ...newMsgsCountObject }
			delete copy[selectedDmPerson.username]
			setNewMsgsCountObject({ ...copy })
			await axios.put('/api/setCurrentDmPerson', {
				userId: user._id,
				person: selectedDmPerson.username,
			})
		})()
	}, [selectedDmPerson])

	const setNewMsgLikes = (msgId, isLiked) => {
		queryClient.setQueryData(['dms', selectedDmPerson], (prev: any) => {
			return {
				...data,
				pages: prev?.pages.map((page, i) => {
					return {
						...page,
						data: page.data.map((m, j) => {
							return {
								...m,
								isLiked: m._id === msgId ? isLiked : m.isLiked,
							}
						}),
					}
				}),
			}
		})
	}

	async function handleLoadMore() {
		const earliestMsg = document.querySelector(`.${stylesChat.earliestMsg}`)?.id
		if (earliestMsg) scrollElementId = earliestMsg
		await fetchNextPage()
		document.getElementById(`${scrollElementId}`)?.scrollIntoView()
		chatBoxRef.current.scrollBy(0, -100)
		scrollElementId = ''
	}

	function addMessage(newData) {
		queryClient.setQueryData(['dms', selectedDmPerson], (prev: any) => ({
			...data,
			pages: prev?.pages.map((page, i) => {
				if (i === 0)
					return {
						...page,
						data: [newData, ...page.data],
					}
				else return page
			}),
		}))
	}

	async function fetchDMs({ pageParam = 0 }) {
		if (!selectedDmPerson?.username) return null
		try {
			await axios.get(
				`/api/markDmMsgsAsRead?userName=${user.username}&friendName=${selectedDmPerson.username}`
			)

			const res2 = await axios.get(
				`/api/getDirectMsgs?userId=${user._id}&selectedPersonName=${selectedDmPerson.username}&cursor=${pageParam}&limit=${resultsLimit}`
			)
			return res2.data
		} catch (err) {
			console.log(err)
		}
	}

	const postMsgLike = async (msg: IDm) => {
		const res = await axios.put('/api/addDmLike', {
			liker: user.username,
			likerId: user._id,
			msgId: msg._id,
			receiver: msg.author,
			receiverId: selectedDmPerson?._id,
		})
		if (res.data === true) setNewMsgLikes(msg._id, true)
		else setNewMsgLikes(msg._id, false)
	}

	const handleMsgLikeClick = (msg: IDm, e?: React.TouchEvent<HTMLDivElement>): void => {
		if (msg.author === user.username) return
		const timeSinceLastMsgClick = Date.now() - lastMsgClickedDate
		lastMsgClickedDate = Date.now()

		if (!e) postMsgLike(msg)
		else if (lastMsgClicked === e.target && timeSinceLastMsgClick > 0 && timeSinceLastMsgClick < 300)
			postMsgLike(msg)
		else lastMsgClicked = e.target
	}

	function handleSendMsgClick() {
		const msgData: Partial<IDm> & any = {
			receiver: selectedDmPerson?.username,
			content: textAreaRef.current.value,
			authorId: user?._id || undefined,
			friendId: selectedDmPerson?._id || undefined,
			author: user.username,
			authorProfileImg: session?.user?.image ? session.user.image : null,
		}

		sendMessage.mutate(msgData)
		textAreaRef.current.value = ''
	}

	return (
		<div className={`${styles.container} ${user?.darkMode === true ? styles.darkMode : ''}`}>
			{session ? (
				<>
					<div className={styles.userDmNames}>
						<h4 className={styles.title}>Messages</h4>
						{dmPeople?.length
							? dmPeople.map((person, i) => (
									<div
										onClick={() => dispatch(setSelectedDmPerson(person))}
										key={i}
										className={`${styles.singleDmName} ${
											person.username === selectedDmPerson?.username ? styles.selected : null
										}`}>
										<h4 className={styles.groupName}>{person.username}</h4>
										{newMsgsCountObject?.[person.username] > 0 ? (
											<h5 className={styles.newDmsCount}>{newMsgsCountObject[person.username]}</h5>
										) : null}
									</div>
							  ))
							: null}
					</div>
					<div className={styles.selectedGroup}>
						<h2 className={styles.selectedGroupName}>{selectedDmPerson?.username}</h2>
						<div
							ref={chatAreaRef}
							className={`${stylesChat.chatArea} ${user?.darkMode === true ? stylesChat.darkMode : ''}`}>
							<div
								ref={chatBoxRef}
								className={stylesChat.chatBox}>
								<div
									ref={messagesRef}
									className={`${stylesChat.messages} ${stylesChat.dms}`}>
									{data?.pages.map((page, i, row1) => (
										<Fragment key={i}>
											{page?.data?.map((msg: IDm, j, row2) => {
												return (
													<div
														key={j}
														id={msg?._id?.toString()}
														className={`
                                    ${stylesChat.msg} 
                                    ${stylesChat.dm} 
                                    ${
																			msg.author === user?.username
																				? stylesChat.userMsg
																				: stylesChat.msgFromOther
																		}
                                    ${
																			i + 1 === row1.length && j + 1 === row2.length
																				? stylesChat.earliestMsg
																				: null
																		}
                                    `}>
														<div className={stylesChat.msgAuthor}>
															{msg?.authorProfileImg ? (
																<Image
																	width={25}
																	height={25}
																	className={`${stylesChat.authorImg}`}
																	src={msg.authorProfileImg}
																	alt='Author Image'
																/>
															) : (
																<h5 className={`${stylesChat.authorImg} ${stylesChat.noImg} `}>
																	{getInitials(msg.author)}
																</h5>
															)}
															<h5>{msg.author}</h5>
														</div>
														<h4 className={stylesChat.msgContent}>
															{msg.content}
															<LikeIcon
																isAuthor={msg.author === user.username}
																msgLikes={msg.isLiked ? 1 : 0}
																handleMsgLikeClick={() => handleMsgLikeClick(msg)}
																likedByUser={msg.isLiked && msg.author !== user.username ? true : false}
															/>
														</h4>
														<h6 className={stylesChat.msgDate}>{getFormattedDateFromISO(msg.date)}</h6>
													</div>
												)
											})}
										</Fragment>
									))}
									{isFetching ? (
										<div className={stylesChat.loadingMsgs}>
											<LoadingAnimation />
										</div>
									) : null}
									<div ref={resultsEndRef}></div>
								</div>
							</div>

							<div className={stylesChat.chatInputArea}>
								<div></div>
								<textarea
									ref={textAreaRef}
									className={stylesChat.input}
								/>
								<button
									onClick={handleSendMsgClick}
									className={stylesChat.sendMsgBtn}>
									Send
								</button>
							</div>
						</div>
					</div>
				</>
			) : (
				<NotAuthorizedScreen />
			)}
		</div>
	)
}

export default directMessages

export async function getServerSideProps({ req }) {
	const session: any = await getSession({ req })

	if (!session)
		return {
			redirect: {
				destination: '/signin',
				permanent: false,
			},
		}
	return {
		props: {
			session,
		},
	}
}
