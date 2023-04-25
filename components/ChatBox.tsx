import React from 'react'
import { Fragment } from 'react'
import{ PresenceChannel } from 'pusher-js'
import { useSession } from 'next-auth/react'
import { ObjectId } from 'mongodb'
import axios from 'axios'
import { IGroup, IMessage } from '../models/groupModel'
import { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IUserState, setUser } from '../redux/userSlice'
import LikeIcon from './LikeIcon'
import GroupDetails from './GroupDetails'
import LikeIconSVG from '../public/like-icon.svg'
import Image from 'next/image'
import PsgSelector from './PsgSelector'
import parse from 'html-react-parser'
import { useOnScreen } from '../utils/hooks'
import badWords from '../badWords.json'
import { getFormattedDateFromISO } from '../utils/dates'
import debounce from '../utils/debounce'
import { ILastSeenMsg } from '../models/userModel'
import scrollToMessage from '../utils/scrollToMessage'
import LoadingAnimation from './LoadingAnimation'
import styles from '../styles/Home.module.css'
import stylesChat from '../styles/ChatArea.module.css'
import AddPsgIcon from './AddPsgIcon'
import UserProfile from './UserProfile'
import getInitials from '../utils/getInitials'

let scrollElementId: string

let lastMsgClickedDate
let lastMsgClicked

interface ISelectedMember {
    id: ObjectId
    img: string
}

const ChatBox = ({ channels }: {channels: PresenceChannel[] | []}) => {
    const textAreaRef: React.MutableRefObject<any> = useRef(null)
    const chatAreaRef: React.MutableRefObject<any> = useRef(null)
    const chatBoxRef: React.MutableRefObject<any> = useRef(null)
    const messagesRef: React.MutableRefObject<any> = useRef(null)
    const resultsEndRef: React.MutableRefObject<any> = useRef(null)
    const svgRef: React.MutableRefObject<any> = useRef(null)
    const psgSelectorRef: React.MutableRefObject<any> = useRef(null)

    const isVisible = useOnScreen(resultsEndRef)
    
    const queryClient = useQueryClient()

    const dispatch = useAppDispatch()

    const user: IUserState = useAppSelector(state => state.user)
    const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)
    
    const [addingPsg, setAddingPsg] = useState(false)
    const [lastNextPageFetchTime, setLastNextPageFetchTime] = useState(0)
    const [windowWidth, setWindowWidth] = useState(0)
    const [windowHeight, setWindowHeight] = useState(0)
    const [onlineMembers, setOnlineMembers] = useState<string[]>([])
    const [selectedMember, setSelectedMember] = useState<ISelectedMember | null>(null)

    const [pointOneX, setPointOneX] = useState(0)
    const [pointOneY, setPointOneY] = useState(0)
    const [pointTwoX, setPointTwoX] = useState(0)
    const [pointTwoY, setPointTwoY] = useState(0)
    const [pointThreeX, setPointThreeX] = useState(0)
    const [pointThreeY, setPointThreeY] = useState(0)

    
    const { data: session }: any = useSession()
  
    const sendMessage = useMutation((msgData: (Partial<IMessage> & ObjectId)) => {
        return axios.post('/api/postGroupMsg', msgData)
        }, {
            onSuccess: async (newData) => {
                addMessage(newData)
                textAreaRef.current.value = ''
                chatBoxRef?.current.scrollTo(0, chatBoxRef?.current.scrollHeight)
                await axios.get(`/api/pusher/updateGrpMemberMsgs?username=${user.username}&channelName=presence-${selectedGroup._id}&msg=${JSON.stringify(newData)}`)
            }
        }
    )

    
    const { data, status, isFetching, fetchNextPage, hasNextPage, error } = useInfiniteQuery(
        ['groupMessages', selectedGroup._id], fetchGroupMessages, {
            getNextPageParam: (lastPage, pages) => lastPage?.cursor
        }
    )

    const refetch = () => queryClient.resetQueries({ queryKey: ['groupMessages', selectedGroup._id], type: 'active' })

    useEffect(() => {
        setWindowWidth(window.innerWidth)
        setWindowHeight(window.innerHeight)
        document.addEventListener('click', handlePageClick)
        window.addEventListener('resize', handleWindowResize)
        if (data) refetch()
        
        return () => {
            document.removeEventListener('click', handlePageClick)
            window.removeEventListener('resize', handleWindowResize)
        }
    }, [])

    useEffect(() => {
        if (!user?.lastSeenMsgs?.length || !selectedGroup._id || status === 'loading') return
        scrollToMessage(user.lastSeenMsgs, selectedGroup._id)
     }, [selectedGroup, status])
    
    useEffect(() => setSvgPosition(), [addingPsg])
    
    useEffect(() => {
        const now = Date.now()
        if (!isVisible || isFetching || (now - lastNextPageFetchTime) < 250 || !hasNextPage) return
        setLastNextPageFetchTime(now)
        handleLoadMore()
    }, [isVisible])
    
    useEffect(() => {
        if (chatBoxRef.current) chatBoxRef.current.addEventListener('scroll', handleChatScroll)

        const interval = setInterval(() => periodicallyCheckGroupMembers(), 5000)

        return () => {
            clearInterval(interval)
            sendJoinedGroup()
            if (chatBoxRef.current) chatBoxRef.current.removeEventListener('scroll', handleChatScroll)
        }
    }, [selectedGroup, channels])
    
    useEffect(() => {
        if (!channels?.[1]) return
        
        channels?.[1].bind('pusher:subscription_succeeded', (data) => {
            const onlineMembs = Object.keys(data?.members).map(key => data?.members[key].username)
            if (onlineMembs.length) {
                sendJoinedGroup()
                setOnlineMembers(onlineMembs)
            }
        })
        
        channels?.[1].bind('update-online-members', data => {
            const onlineMembs = Object.keys(channels?.[1].members.members).map(key => channels?.[1].members.members[key].username)
            if (onlineMembs.length) setOnlineMembers(onlineMembs)
        })
        
        channels?.[1].bind('fetch-new-group-msgs', data => {
            if (data?.username !== user?.username) addMessage(JSON?.parse?.(data.msg))
        })
        
        channels?.[1].bind('set-msg-like', data => {
            if (data.liker === user.username) return
            setNewMsgLikes(data.msgId, data.isAdded, data.liker)
        })
        
        return () => {
            channels?.[1].unbind('pusher:subscription_succeeded')
            channels?.[1].unbind('update-online-members')
            channels?.[1].unbind('fetch-new-group-msgs')
            channels?.[1].unbind('set-msg-like')
        }
    }, [channels, data, user.username])

    const periodicallyCheckGroupMembers = () => {
        if (channels?.[1]?.members?.members) {
            const onlineMembs = Object.keys(channels?.[1].members.members).map(key => channels?.[1].members.members[key].username)
            if (onlineMembs.length) setOnlineMembers(onlineMembs)
        }
    }

    const setNewMsgLastSeen = debounce(async(i) => {
        const msgId = messagesRef.current?.children?.[i]?.id
        if (!msgId) return
        const res = await axios.put('/api/setLastSeenMsgId', {
            userId: user._id,
            msgId: msgId,
            groupId: selectedGroup._id
        })
        const resData: ILastSeenMsg[] = res.data
        dispatch(setUser({...user, lastSeenMsgs: resData}))
    }, 1000)

    const handleChatScroll = () => {
        for (let i = messagesRef.current.children.length - 1; i >= 0; i--) {
            if (
                messagesRef.current.children[i].getBoundingClientRect().bottom < window.innerHeight
                && messagesRef.current.children[i].getBoundingClientRect().bottom < (window.innerHeight - 100)
                ) {
                setNewMsgLastSeen(i)
            }
        }
    }

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
                setPointThreeX(pointXAtInput)
                setPointThreeY(pointYAtInput)
            } else if (pointXAtInput && lastEl) {
                setPointThreeX(inputLeft + 10)
                setPointThreeY(textAreaRef.current?.getBoundingClientRect().bottom - 15)
            } else {
                setPointThreeX(inputLeft + 5)
                setPointThreeY(inputTop + 15)
            }
            textAreaRef.current.blur()
        }
    }

    
    const sendJoinedGroup = async () => {
        await axios.get(`/api/pusher/updateMemberStatus?username=${user.username}&channelName=${selectedGroup._id}`)
    }

    const handlePageClick = (e) => {
        if (e.target.classList.contains('passageLink')) {
            window.open(`https://www.biblegateway.com/passage/?search=${e.target.id}&version=${user.bVersion}`, '_blank')
        }
    }
    
    async function fetchGroupMessages ({ pageParam = 0 }) {
        if (!selectedGroup._id) return null
        try {
            const res = await axios.get(`/api/getGroupMsgs?groupId=${selectedGroup._id}&cursor=${pageParam}&limit=100`)
            return res.data
        } catch (err) {
            console.log(err)
        }
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
            if (!domNode) return

            // if (domNode?.name === 'div') {
            //     return <></>
            // }
      
            if (domNode.type === 'text') {
                domNode.data = filterBadWords(domNode.data)
                return domNode
            } 
            
            return domNode
        }
    }
    
    function handleSendMsgClick () {
        if (!textAreaRef?.current?.innerHTML) return

        const getTrimmedText = function(prevText) {
            const textTemp = prevText.replace(/<div>&nbsp;<\/div>/gi, '<div><br><\/div>').replace(/&nbsp;/gi, ' ').replace(/<div><br><\/div>$|^<div><br><\/div>/gi, '').replace(/<p><br><\/p>/gi, '').replace(/<div> | <div>/gi, '<div>').replace(/^ | $|\s{2,}/gi, ' ')
            if (textTemp.length === prevText.length) return textTemp
            else return getTrimmedText(textTemp)
        }

        const text = getTrimmedText(textAreaRef.current.innerHTML)
        
        const msgData: (Partial<IMessage> & any) = {
            groupId: selectedGroup._id,
            author: user.username,
            authorId: user._id,
            content: text,
            date: new Date,
            psgReference: '',
            authorProfileImg: session?.user?.image ? session.user.image : null
        }

        sendMessage.mutate(msgData)
        textAreaRef.current.innerHTML = ''
    }

    async function handleLoadMore() {
        const earliestMsg = document.querySelector(`.${stylesChat.earliestMsg}`)?.id
        if (earliestMsg) scrollElementId = earliestMsg
        await fetchNextPage()
        document.getElementById(`${scrollElementId}`)?.scrollIntoView()
        chatBoxRef.current.scrollBy(0, -100)
        scrollElementId = ''
    }

    const setNewMsgLikes = (msgId, isAdded, liker = user.username) => {
        queryClient.setQueryData(['groupMessages', selectedGroup._id], (prev: any) => {
            return {
                ...data,
                pages: prev?.pages.map((page, i) => {
                    return {
                        ...page,
                  data: page.data.map((m, j) => {
                    return {
                        ...m,
                        likes: m._id === msgId ? 
                            isAdded ? [...m.likes, liker] : m.likes.filter(like => like !== liker)
                        : m.likes
                    }
                  })
                } 
              })
            }
        })
    }

    const postMsgLike = async (msg: IMessage) => {
        const res = await axios.put('/api/addMsgLike', {
            groupId: selectedGroup._id,
            groupName: selectedGroup.name,
            msgId: msg._id,
            likerName: user.username,
            authorID: msg.authorId,
            authorName: msg.author
        })
        if (res.data === true) setNewMsgLikes(msg._id, true) 
        else setNewMsgLikes(msg._id, false)
    }

    const handleMsgLikeClick = (msg: IMessage, e?: React.TouchEvent<HTMLDivElement>): void => {
        if (msg.author === user.username) return
        const timeSinceLastMsgClick = Date.now() - lastMsgClickedDate
        lastMsgClickedDate = Date.now()

        if (!e) postMsgLike(msg)
        else if ((lastMsgClicked === e.target) && timeSinceLastMsgClick > 0 && timeSinceLastMsgClick < 300) postMsgLike(msg) 
        else lastMsgClicked = e.target
    }

    const likedByUser = (msg: IMessage): boolean => {
        if (msg.likes.includes(user.username)) return true
        return false
    }

    const showLikeNames = (e, msg) => {
        if (!msg.likes.length || !e.target.classList.contains(stylesChat.msgContent)) return
        document.getElementById(msg._id + '-likes')?.classList.toggle(stylesChat.show)
    }

    return (
        <div className={styles.selectedGroup}>
            <h2 className={styles.selectedGroupName}>{selectedGroup?.name}</h2>
            <div ref={chatAreaRef} className={stylesChat.chatArea}>
                <div ref={chatBoxRef} className={stylesChat.chatBox}>
                    <div ref={messagesRef} className={stylesChat.messages}>
                        {data?.pages.map((page, i, row1) => (
                        <Fragment key={i}>
                            {page?.data.map((msg: IMessage, j, row2) => {return (
                                <div key={j} id={msg._id} 
                                    className={`
                                    ${stylesChat.msg} 
                                    ${msg.author === user?.username ? stylesChat.userMsg : stylesChat.msgFromOther}
                                    ${(i+1 === row1.length) && (j+1 === row2.length) ? stylesChat.earliestMsg : null}
                                    `}
                                >
                                    <div className={stylesChat.msgAuthor}>
                                        {
                                            msg?.authorProfileImg ? <Image onClick={() => msg.authorId !== user._id ? setSelectedMember({ id: msg.authorId, img: msg.authorProfileImg}): null} width={25} height={25} className={`${stylesChat.authorImg} ${onlineMembers.includes(msg.author) ? stylesChat.online : null}`} src={msg.authorProfileImg} alt='Author Image'/>
                                            : <h5 onClick={() => msg.authorId !== user._id ? setSelectedMember({ id: msg.authorId, img: msg.authorProfileImg}) : null} className={`${stylesChat.authorImg} ${stylesChat.noImg} ${onlineMembers.includes(msg.author) ? stylesChat.online : null}`}>{getInitials(msg.author)}</h5>
                                        }
                                        <h5>{msg.author}</h5>
                                    </div>
                                    <h4 onClick={(e) => showLikeNames(e, msg)} className={stylesChat.msgContent}>
                                        {parse(msg.content, options)}
                                        <LikeIcon 
                                            isAuthor={msg.author === user.username}
                                            msgLikes={msg.likes.length} 
                                            handleMsgLikeClick={() => handleMsgLikeClick(msg)} 
                                            likedByUser={likedByUser(msg) ? true : false} 
                                        />
                                    </h4>
                                    <h6 className={stylesChat.msgDate}>{getFormattedDateFromISO(msg.date)}</h6>
                                    <div id={msg._id + '-likes'} className={stylesChat.msgLikeNames}>
                                        {
                                            msg.likes.map((name, i) => {
                                                return <h6 key={i} className={stylesChat.likeName}>
                                                    {name}
                                                    <Image className={stylesChat.likeImg} src={LikeIconSVG} alt='Like Icon' />
                                                </h6>
                                            })
                                        }
                                    </div>
                                </div>
                                )
                            })}
                            </Fragment>
                        ))}
                        {
                            isFetching 
                            ? <div className={stylesChat.loadingMsgs}><LoadingAnimation /></div>
                            : null
                        }
                        <div ref={resultsEndRef}></div>
                    </div>
                    {addingPsg ? 
                    <>
                        <PsgSelector textArea={textAreaRef.current} setAddingPsg={setAddingPsg} psgSelectorRef={psgSelectorRef} />
                        <svg className={stylesChat.triangle} ref={svgRef} width={windowWidth} height={windowHeight}>
                            <polygon points={`${pointOneX},${pointOneY} ${pointTwoX},${pointTwoY} ${pointThreeX},${pointThreeY}`} fill='rgb(255,0,0)' stroke='rgb(255,0,0)' strokeWidth='2' />
                        </svg>
                    </>
                    : null}
                </div>
                    
                <div style={{pointerEvents: addingPsg ? 'none' : 'all'} } className={stylesChat.chatInputArea}>
                    <button onClick={() => setAddingPsg(true)} className={stylesChat.addPsgBtn}><AddPsgIcon /></button>
                    <div ref={textAreaRef} contentEditable={true} suppressContentEditableWarning={true} className={stylesChat.input}></div>
                    <button onClick={handleSendMsgClick} className={stylesChat.sendMsgBtn}>Send</button>
                </div>
            </div>
            <GroupDetails selectedGroup={selectedGroup} username={user.username} onlineMembers={onlineMembers} />
            {selectedMember?.id ? <UserProfile selectedMember={selectedMember} /> : null} 
        </div>
    )
}

export default ChatBox