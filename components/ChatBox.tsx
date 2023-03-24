import React from 'react'
import { Fragment } from 'react'
import Pusher from 'pusher-js'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { IGroup, IMsg } from '../models/groupModel'
import { useState, useEffect, useRef } from 'react'
import { useAppSelector } from '../redux/hooks'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import styles from '../styles/Home.module.css'
import { IUserState } from '../redux/userSlice'
import LikeIcon from '../components/LikeIcon'
import LikeIconSVG from '../public/like-icon.svg'
import Image from 'next/image'
import PsgSelector from './PsgSelector'
import parse from 'html-react-parser'
import { useOnScreen } from '../utils/hooks'


let scrollElementId: string

interface IGroupId {
  groupId: string
}

let pusher
let lastMsgClickedDate
let lastMsgClicked

const ChatBox: React.FC = () => {
    const textAreaRef: React.MutableRefObject<any> = useRef(null)
    const chatAreaRef: React.MutableRefObject<any> = useRef(null)
    const chatBoxRef: React.MutableRefObject<any> = useRef(null)
    const messagesRef: React.MutableRefObject<any> = useRef(null)
    const resultsEndRef: React.MutableRefObject<any> = useRef(null)

    const isVisible = useOnScreen(resultsEndRef)
    
    const queryClient = useQueryClient()

    const user: IUserState = useAppSelector(state => state.user.user)
    const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)
    
    const [channel, setChannel]: any = useState(null)
    const [detailedExpanded, setDetailedExpanded] = useState(false)
    const [addingPsg, setAddingPsg] = useState(false)
    const [lastNextPageFetchTime, setLastNextPageFetchTime] = useState(0)
    
    const { data: session }: any = useSession()
  
    const sendMessage = useMutation((msgData: (Partial<IMsg> & IGroupId)) => {
        return axios.post('/api/postGroupMsg', msgData)
        }, {
            onSuccess: async (newData) => {
                addMessage(newData)
                textAreaRef.current.value = ''
                await axios.get(`/api/pusher/updateGrpMemberMsgs?username=${user.username}&channelName=${selectedGroup._id}&msg=${JSON.stringify(newData)}`)
            }
        }
    )

    
    const { data, status, isFetching, fetchNextPage, hasNextPage, error } = useInfiniteQuery(
        ['groupMessages', selectedGroup._id], fetchGroupMessages, {
            getNextPageParam: (lastPage, pages) => lastPage?.cursor
        }
    )

    useEffect(() => {
        document.addEventListener('click', handlePageClick)

        return () => document.removeEventListener('click', handlePageClick)
    }, [])

    useEffect(() => {
        const now = Date.now()
        if (!isVisible || isFetching || (now - lastNextPageFetchTime) < 250 || !hasNextPage) return
        setLastNextPageFetchTime(now)
        handleLoadMore()
      }, [isVisible])

    const handlePageClick = (e) => {
        if (e.target.classList.contains('passageLink') && !e.target.parentElement.classList.contains(styles.input)) {
            window.open(`https://www.biblegateway.com/passage/?search=${e.target.id}&version=${user.bVersion}`, '_blank')
        }
    }

    useEffect(() => {
        if (!pusher && user.username && process.env.PUSHER_KEY && process.env.PUSHER_CLUSTER) {
            pusher = new Pusher(process.env.PUSHER_KEY, {
                cluster: process.env.PUSHER_CLUSTER,
                authEndpoint: `/api/pusher/auth`,
                auth: {params: {username: user.username}}
            })
        }
    }, [user.username])

    useEffect(() => {
        if (!pusher) return
        if (selectedGroup) {
           setChannel(pusher.subscribe(selectedGroup._id))
        }

        return () => {
            pusher.unsubscribe(selectedGroup._id)
            setChannel(null)
        }
    }, [selectedGroup])

    useEffect(() => {
        if (!channel) return
        channel.bind('fetch-new-group-msgs', data => {
            if (data.username !== user.username) addMessage(JSON.parse(data.msg))
        })

        channel.bind('set-msg-like', data => {
            if (data.liker === user.username) return
            if (data.isAdded) {
                setNewMsgLikes(data.msg, true, data.liker)
            }
            else setNewMsgLikes(data.msg, false, data.liker)
        })

        return () => {
            channel.unbind('fetch-new-group-msgs')
            channel.unbind('set-msg-like')
        }
    }, [channel, data, user.username])
    
    async function fetchGroupMessages ({ pageParam = 0 }) {
        if (!selectedGroup._id) return null
        try {
            const res = await axios.get(`/api/getGroupMsgs?groupId=${selectedGroup._id}&cursor=${pageParam}&limit=10`)
            return res.data
        } catch (err) {
            console.log(err)
        }
    }

    function isToday (someDate) {
        const today = new Date()
        return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
    }

    function addMessage(newData) {
        queryClient.setQueryData(['groupMessages', selectedGroup._id], (prev: any) => ({
        ...data,
        pages: prev?.pages.map((page, i) => {
            if (i === 0) return {
            ...page,
            data: [newData.data, ...page.data]
            } 
            else return page
        })
        }))
    }

    function handleSendMsgClick () {
        const msgData: (Partial<IMsg> & IGroupId) = {
            groupId: selectedGroup._id,
            author: session.user.username,
            content: textAreaRef.current.innerHTML,
            date: new Date,
            psgReference: ''
        }

        sendMessage.mutate(msgData)
        textAreaRef.current.innerHTML = ''
    }

    async function handleLoadMore() {
        const earliestMsg = document.querySelector(`.${styles.earliestMsg}`)?.id
        if (earliestMsg) scrollElementId = earliestMsg
        await fetchNextPage()
        document.getElementById(`${scrollElementId}`)?.scrollIntoView()
        chatBoxRef.current.scrollBy(0, -100)
        scrollElementId = ''
    }

    const setNewMsgLikes = (msg, isAdded, liker = user.username) => {
        queryClient.setQueryData(['groupMessages', selectedGroup._id], (prev: any) => {
            return {
                ...data,
                pages: prev?.pages.map((page, i) => {
                    return {
                        ...page,
                  data: page.data.map((m, j) => {
                    return {
                        ...m,
                        likes: m._id === msg._id ? 
                            isAdded ? [...m.likes, liker] : m.likes.filter(like => like !== liker)
                        : m.likes
                    }
                  })
                } 
              })
            }
        })
    }

    const postMsgLike = async (msg) => {
        const res = await axios.post('/api/addMsgLike', {
            msg: msg,
            name: user.username,
            channel: selectedGroup._id
        })
        if (res.data) setNewMsgLikes(msg, true) 
        else setNewMsgLikes(msg, false)
    }

    const handleMsgLikeClick = (msg: IMsg, e?: React.TouchEvent<HTMLDivElement>): void => {
        if (msg.author === user.username) return
        const timeSinceLastMsgClick = Date.now() - lastMsgClickedDate
        lastMsgClickedDate = Date.now()

        if (!e)  postMsgLike(msg)
        else if ((lastMsgClicked === e.target) && timeSinceLastMsgClick > 0 && timeSinceLastMsgClick < 300) postMsgLike(msg) 
        else lastMsgClicked = e.target
    }

    const likedByUser = (msg: IMsg): boolean => {
        if (msg.likes.includes(user.username)) return true
        return false
    }

    const showLikeNames = (e, msg) => {
        if (!msg.likes.length || !e.target.classList.contains(styles.msgContent)) return
        document.getElementById(msg._id + '-likes')?.classList.toggle(styles.show)
    }

    return (
        <div className={styles.selectedGroup}>
            <h2 className={styles.selectedGroupName}>{selectedGroup?.name}</h2>
            <div ref={chatAreaRef} className={styles.chatArea}>
                <div ref={chatBoxRef} className={styles.chatBox}>
                    <div ref={messagesRef} className={styles.messages}>
                        {data?.pages.map((page, i, row1) => (
                        <Fragment key={i}>
                            {page?.data.map((msg: IMsg, j, row2) => {
                                const dateObj = new Date(msg.date)
                                const date = dateObj.toLocaleDateString()
                                const time = dateObj.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}).replace(/\s+/g, '').toLocaleLowerCase()
                                return (
                                <div key={j} id={msg._id} 
                                    className={`
                                    ${styles.msg} 
                                    ${msg.author === session.user.username ? styles.userMsg : styles.msgFromOther}
                                    ${(i+1 === row1.length) && (j+1 === row2.length) ? styles.earliestMsg : null}
                                    `}
                                >
                                    <h5 className={styles.msgAuthor}>{msg.author}</h5>
                                    <h4 onClick={(e) => showLikeNames(e, msg)} className={styles.msgContent}>
                                        {parse(msg.content)}
                                        <LikeIcon 
                                            isAuthor={msg.author === user.username}
                                            msgLikes={msg.likes.length} 
                                            handleMsgLikeClick={() => handleMsgLikeClick(msg)} 
                                            likedByUser={likedByUser(msg) ? true : false} 
                                        />
                                    </h4>
                                    <h6 className={styles.msgDate}>{`${isToday(dateObj) ? '' : date + ' '}${time}`}</h6>
                                    <div id={msg._id + '-likes'} className={styles.msgLikeNames}>
                                        {
                                            msg.likes.map((name, i) => {
                                                return <h6 key={i} className={styles.likeName}>
                                                    {name}
                                                    <Image className={styles.likeImg} src={LikeIconSVG} alt='Like Icon'></Image>
                                                </h6>
                                            })
                                        }
                                    </div>
                                </div>
                                )
                            })}
                            </Fragment>
                        ))}
                        <div ref={resultsEndRef} className={styles.resultsEnd}></div>
                    </div>
                    {addingPsg ? <PsgSelector textArea={textAreaRef.current} setAddingPsg={setAddingPsg} /> : null}
                </div>

                <div style={{pointerEvents: addingPsg ? 'none' : 'all'} } className={styles.chatInputArea}>
                    <button onClick={() => setAddingPsg(true)} className={styles.addPsgBtn}>Insert Passage</button>
                    <div suppressContentEditableWarning={true} contentEditable={true} ref={textAreaRef} className={styles.input}></div>
                    <button onClick={handleSendMsgClick} className={styles.sendMsgBtn}>Send</button>
                </div>
            </div>
            <div className={`${styles.groupDetails} ${detailedExpanded ? styles.show : null}`}>
                <h2 className={styles.name}>{selectedGroup.name}</h2>
                <h5 className={styles.summary}>{selectedGroup.summary}</h5>
                <button onClick={() => setDetailedExpanded(!detailedExpanded)} className={`${styles.expandGroupDetailsBtn} ${detailedExpanded ? styles.show : null}`}>
                    <div className={styles.arrow}></div>
                </button>
            </div>
        </div>
    )
}

export default ChatBox