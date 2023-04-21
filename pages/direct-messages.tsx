import { getSession, useSession } from 'next-auth/react'
import React, { useEffect, useState, useRef, Fragment } from 'react'
import { IUserState, setUser } from '../redux/userSlice'
import getUser from '../utils/getUser'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import axios from 'axios'
import NotAuthorizedScreen from '../components/NotAuthorizedScreen'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IDm } from '../models/userModel'
import Image from 'next/image'
import LikeIcon from '../components/LikeIcon'
import { getFormattedDateFromISO } from '../utils/dates'
import LoadingAnimation from '../components/LoadingAnimation'
import styles from '../styles/Home.module.css'
import stylesChat from '../styles/ChatArea.module.css'
import { useOnScreen } from '../utils/hooks'
import { PresenceChannel } from 'pusher-js'

let scrollElementId: string

let lastMsgClickedDate
let lastMsgClicked

interface IDmPeople {
  username: string,
  _id: string
}

const directMessages = ({ channels }: {channels: PresenceChannel[] | []}) => {
  const { data: session }: any = useSession()

  const textAreaRef: React.MutableRefObject<any> = useRef(null)
  const chatAreaRef: React.MutableRefObject<any> = useRef(null)
  const chatBoxRef: React.MutableRefObject<any> = useRef(null)
  const messagesRef: React.MutableRefObject<any> = useRef(null)
  const resultsEndRef: React.MutableRefObject<any> = useRef(null)

  const [dmPeople, setDmPeople] = useState<IDmPeople[]>([])
  const [selectedPerson, setSelectedPerson] = useState<IDmPeople>()
  const [lastNextPageFetchTime, setLastNextPageFetchTime] = useState(0)

  const user: IUserState = useAppSelector(state => state.user)

  const isVisible = useOnScreen(resultsEndRef)

  const dispatch = useAppDispatch()

  const queryClient = useQueryClient()

  const { data, status, isFetching, fetchNextPage, hasNextPage, error } = useInfiniteQuery(
    ['dms', selectedPerson], fetchDMs, {
        getNextPageParam: (lastPage, pages) => lastPage?.cursor
    } 
  )

  const sendMessage = useMutation((msgData: (Partial<IDm> & string)) => {
    return axios.post('/api/postDM', msgData)
    }, {
        onSuccess: async (newData) => {
            addMessage(newData)
            textAreaRef.current.value = ''
            chatBoxRef?.current.scrollTo(0, chatBoxRef?.current.scrollHeight)
            await axios.get(`/api/pusher/updateGrpMemberMsgs?username=${user.username}&channelName=${selectedPerson?._id}&msg=${JSON.stringify(newData)}`)
        }
    }
)

  useEffect(() => {
    if (session?.user) {
        (async () => {
          const updatedUser: IUserState = await getUser(session.user.email)
          if (!user?._id && updatedUser?._id) dispatch(setUser(updatedUser))
          
          if (updatedUser) {
            const res = await axios.get(`/api/getDmPeople?userId=${updatedUser._id}`)
            if (res?.data?.length) {
              setDmPeople(res?.data)
              setSelectedPerson(res.data[0])
            }
          }
        })()
    }
  }, [user._id])

  useEffect(() => {
    if (!channels?.[0]) return

    channels?.[0].bind('fetch-new-group-msgs', data => {
      if (data?.username !== user?.username) addMessage(JSON?.parse?.(data.msg))
    })
    
    // channels?.[1].bind('set-msg-like', data => {
    //     if (data.liker === user.username) return
    //     setNewMsgLikes(data.msgId, data.isAdded, data.liker)
    // })
    
    return () => {
        channels?.[0].unbind('fetch-new-group-msgs')
        // channels?.[1].unbind('set-msg-like')
    }
}, [channels, data, user.username])

  useEffect(() => {
    const now = Date.now()
    if (!isVisible || isFetching || (now - lastNextPageFetchTime) < 250 || !hasNextPage) return
    setLastNextPageFetchTime(now)
    handleLoadMore()
  }, [isVisible])

  async function handleLoadMore() {
    const earliestMsg = document.querySelector(`.${stylesChat.earliestMsg}`)?.id
    if (earliestMsg) scrollElementId = earliestMsg
    await fetchNextPage()
    document.getElementById(`${scrollElementId}`)?.scrollIntoView()
    chatBoxRef.current.scrollBy(0, -100)
    scrollElementId = ''
  }

  function addMessage(newData) {
    queryClient.setQueryData(['dms', selectedPerson], (prev: any) => ({
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

  async function fetchDMs({ pageParam = 0 }) {
    if (!selectedPerson) return null
      try {
        const res = await axios.get(`/api/getDirectMsgs?userId=${user._id}&selectedPersonName=${selectedPerson.username}&cursor=${pageParam}&limit=10`)
        return res.data
      } catch (err) {
        console.log(err)
    }
  }

  const getInitials = (uN: string): string => {
    let initials: string
    const usernameArray = uN.split(' ')

    if (usernameArray.length > 1) initials = usernameArray[0][0] + usernameArray[1][0]
    else initials = uN[0] + uN[1]
    return initials.toUpperCase()
}

const handleMsgLikeClick = (msg: IDm, e?: React.TouchEvent<HTMLDivElement>): void => {
  // if (msg.author === user.username) return
  // const timeSinceLastMsgClick = Date.now() - lastMsgClickedDate
  // lastMsgClickedDate = Date.now()

  // if (!e) postMsgLike(msg)
  // else if ((lastMsgClicked === e.target) && timeSinceLastMsgClick > 0 && timeSinceLastMsgClick < 300) postMsgLike(msg) 
  // else lastMsgClicked = e.target
}

function handleSendMsgClick () {
  const msgData: (Partial<IDm> & any) = {
    receiver: selectedPerson, 
    content: textAreaRef.current.value,
    authorId: user?._id || undefined,
    date: Date.now(),
    author: user.username,
    authorProfileImg: session?.user?.image ? session.user.image : null
  }

  sendMessage.mutate(msgData)
  textAreaRef.current.value = ''
}

  return (
    <div className={styles.container}>
    {
        session ?
        <>
          <div className={styles.userGroups}>
              <h4 className={styles.title}>Messages</h4>
              {
              dmPeople?.length ?
              dmPeople.map((person, i) => (
                  <div 
                  onClick={()=> setSelectedPerson(person)} 
                  key={i} 
                  className={`${styles.singleGroup} ${person.username === selectedPerson?.username ? styles.selected : null}`}>
                      <h4 className={styles.groupName}>{person.username}</h4>
                  </div>
                  ))
              : null
              }
          </div>
          <div className={styles.selectedGroup}>
            <h2 className={styles.selectedGroupName}>{selectedPerson?.username}</h2>
            <div ref={chatAreaRef} className={stylesChat.chatArea}>
                <div ref={chatBoxRef} className={stylesChat.chatBox}>
                    <div ref={messagesRef} className={`${stylesChat.messages} ${stylesChat.dms}`}>
                        {data?.pages.map((page, i, row1) => (
                        <Fragment key={i}>
                            {page?.data?.map((msg: IDm, j, row2) => {return (
                                <div key={j} id={msg._id?.toString()} 
                                    className={`
                                    ${stylesChat.msg} 
                                    ${msg.author === user?.username ? stylesChat.userMsg : stylesChat.msgFromOther}
                                    ${(i+1 === row1.length) && (j+1 === row2.length) ? stylesChat.earliestMsg : null}
                                    `}
                                >
                                    <div className={stylesChat.msgAuthor}>
                                        {
                                            msg?.authorProfileImg ? <Image width={25} height={25} className={`${stylesChat.authorImg}`} src={msg.authorProfileImg} alt='Author Image'/>
                                            : <h5 className={`${stylesChat.authorImg} ${stylesChat.noImg} `}>{getInitials(msg.author)}</h5>
                                        }
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
                        {
                            isFetching 
                            ? <div className={stylesChat.loadingMsgs}><LoadingAnimation /></div>
                            : null
                        }
                        <div ref={resultsEndRef}></div>
                    </div>
                </div>
                    
                <div className={stylesChat.chatInputArea}>
                    <div></div>
                    <input type='text' ref={textAreaRef} className={stylesChat.input} />
                    <button onClick={handleSendMsgClick} className={stylesChat.sendMsgBtn}>Send</button>
                </div>
            </div>
        </div>
        </>
        : <NotAuthorizedScreen />
    }
    </div>
  )
}

export default directMessages

export async function getServerSideProps({req}) {
    const session: any = await getSession({req})
  
    if (!session) return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
    return {
      props: { 
        session
      }
    }
  }