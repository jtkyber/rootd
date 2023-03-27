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
import badWords from '../badWords.json'


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
    const svgRef: React.MutableRefObject<any> = useRef(null)
    const psgSelectorRef: React.MutableRefObject<any> = useRef(null)

    const isVisible = useOnScreen(resultsEndRef)
    
    const queryClient = useQueryClient()

    const user: IUserState = useAppSelector(state => state.user.user)
    const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)
    
    const [channel, setChannel]: any = useState(null)
    const [detailedExpanded, setDetailedExpanded] = useState(false)
    const [addingPsg, setAddingPsg] = useState(false)
    const [lastNextPageFetchTime, setLastNextPageFetchTime] = useState(0)
    const [windowWidth, setWindowWidth] = useState(0)
    const [windowHeight, setWindowHeight] = useState(0)

    const [pointOneX, setPointOneX] = useState(0)
    const [pointOneY, setPointOneY] = useState(0)
    const [pointTwoX, setPointTwoX] = useState(0)
    const [pointTwoY, setPointTwoY] = useState(0)
    const [pointThreeX, setPointThreeX] = useState(0)
    const [pointThreeY, setPointThreeY] = useState(0)

    
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
        setWindowWidth(window.innerWidth)
        setWindowHeight(window.innerHeight)
        document.addEventListener('click', handlePageClick)
        window.addEventListener('resize', handleWindowResize)

        return () => {
            document.removeEventListener('click', handlePageClick)
            window.removeEventListener('resize', handleWindowResize)
        }
    }, [])

    const handleWindowResize = () => {
        setWindowWidth(window.innerWidth)
        setWindowHeight(window.innerHeight)
        setSvgPosition()
    }

    const getCaretTopPoint = () => {
        const sel = document.getSelection()
        if (!sel || sel.rangeCount <= 0) return

        const r = sel.getRangeAt(0)
        let rect
        let r2
        // supposed to be textNode in most cases
        // but div[contenteditable] when empty
        const node: any = r.startContainer
        const offset = r.startOffset

        if (offset > 0) {
          // new range, don't influence DOM state
          r2 = document.createRange()
          r2.setStart(node, (offset - 1))
          r2.setEnd(node, offset)
          // https://developer.mozilla.org/en-US/docs/Web/API/range.getBoundingClientRect
          // IE9, Safari?(but look good in Safari 8)
          rect = r2.getBoundingClientRect()
          return { left: rect.right, top: rect.top }
        } else if (offset < node.length) {
          r2 = document.createRange()
          // similar but select next on letter
          r2.setStart(node, offset)
          r2.setEnd(node, (offset + 1))
          rect = r2.getBoundingClientRect()
          return { left: rect.left, top: rect.top }
        } else { // textNode has length
          // https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
          rect = node.getBoundingClientRect()
          const styles = getComputedStyle(node)
          const lineHeight = parseInt(styles.lineHeight)
          const fontSize = parseInt(styles.fontSize)
          // roughly half the whitespace... but not exactly
          const delta = (lineHeight - fontSize) / 2
          return { left: rect.left, top: (rect.top + delta) }
        }
      }

    const setSvgPosition = () => {
        if (addingPsg) {
            textAreaRef.current.focus()
            document.execCommand('selectAll', false, '')
            document.getSelection()?.collapseToEnd()

            const psgSelectorLeft = document.getElementById('psgSelector')?.getBoundingClientRect().left
            const psgSelectorRight = document.getElementById('psgSelector')?.getBoundingClientRect().right
            const psgSelectorBottom  = document.getElementById('psgSelector')?.getBoundingClientRect().bottom
            
            let inputLeft  = textAreaRef.current?.getBoundingClientRect().left
            let inputTop  = textAreaRef.current?.getBoundingClientRect().top
            
            if (!psgSelectorLeft || !psgSelectorRight || !psgSelectorBottom) return
            
            setPointOneX(psgSelectorLeft + 5)
            setPointOneY(psgSelectorBottom)
            setPointTwoX(psgSelectorRight - 5)
            setPointTwoY(psgSelectorBottom)

            const pointAtInput = getCaretTopPoint()
            
            const pointXAtInput = pointAtInput?.left + 5
            const pointYAtInput = pointAtInput?.top + 15
            const lastEl = textAreaRef.current.children[textAreaRef.current.children.length-1]
            const containsOnlySpaces = textAreaRef.current.innerText.replace(/\s/g, '').length === 0
            
            if (containsOnlySpaces && textAreaRef.current?.children.length) {
                while (textAreaRef.current.firstChild) textAreaRef.current.removeChild(textAreaRef.current.firstChild)
            }
            
            if (pointXAtInput && pointYAtInput) {
                console.log(1)
                setPointThreeX(pointXAtInput)
                setPointThreeY(pointYAtInput)
            } else if (pointXAtInput && lastEl) {
                console.log(2)
                setPointThreeX(inputLeft + 10)
                setPointThreeY(textAreaRef.current?.getBoundingClientRect().bottom - 15)
            } else {
                console.log(3)
                setPointThreeX(inputLeft + 5)
                setPointThreeY(inputTop + 15)
            }
            textAreaRef.current.blur()
        }
    }

    useEffect(() => setSvgPosition(), [addingPsg])

    useEffect(() => {
        const now = Date.now()
        if (!isVisible || isFetching || (now - lastNextPageFetchTime) < 250 || !hasNextPage) return
        setLastNextPageFetchTime(now)
        handleLoadMore()
      }, [isVisible])

    const handlePageClick = (e) => {
        if (e.target.classList.contains('passageLink')) {
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

    const filterBadWords = (text) => {
        for (let word of badWords) {
            if (text.toLowerCase().includes(word)) {
                const indexOfBadWordLastChar = text.lastIndexOf(word) + word.length - 1
                if (
                    (text[text.lastIndexOf(word) - 1] && text[text.lastIndexOf(word) - 1].match(/[a-z]/i))
                    || (text[indexOfBadWordLastChar + 1] && text[indexOfBadWordLastChar + 1].match(/[a-z]/i))
                ) continue
                text = text.replaceAll(word, `${word[0]}${'•'.repeat(word.length - 2)}${word[word.length - 1]}`)
            }
        }
        return text
    }

    const options = {
        replace: domNode => {
            if (!domNode) {
                return
            }
      
            if (domNode.type === 'text') {
                domNode.data = filterBadWords(domNode.data)
                return domNode
            } 
            
            return domNode
        }
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
                                        {parse(msg.content, options)}
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
                    {addingPsg ? 
                    <>
                        <PsgSelector textArea={textAreaRef.current} setAddingPsg={setAddingPsg} psgSelectorRef={psgSelectorRef} />
                        <svg className={styles.triangle} ref={svgRef} width={windowWidth} height={windowHeight}>
                            <polygon points={`${pointOneX},${pointOneY} ${pointTwoX},${pointTwoY} ${pointThreeX},${pointThreeY}`} fill='rgb(255,0,0)' stroke='rgb(255,0,0)' strokeWidth='2' />
                        </svg>
                    </>
                    : null}
                </div>

                <div style={{pointerEvents: addingPsg ? 'none' : 'all'} } className={styles.chatInputArea}>
                    <button onClick={() => setAddingPsg(true)} className={styles.addPsgBtn}>Insert Passage</button>
                    <div ref={textAreaRef} contentEditable={true} suppressContentEditableWarning={true} className={styles.input}></div>
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