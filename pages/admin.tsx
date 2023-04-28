import React, { useEffect, useState, Fragment } from 'react'
import styles from '../styles/Admin.module.css'
import { getSession, useSession } from 'next-auth/react'
import NotAuthorizedScreen from '../components/NotAuthorizedScreen'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { IUserState, setUser } from '../redux/userSlice'
import getUser from '../utils/getUser'
import { IGroupReport, IGrpCreationReq, IUserReport } from '../models/adminModel'
import { getFormattedDateFromISO } from '../utils/dates'
import refreshIcon from '../public/refresh.svg'
import Image from 'next/image'

interface IAdminResultPartial extends Partial<IGrpCreationReq>, Partial<IUserReport>, Partial<IGroupReport> {}

const admin = () => {
    const { data: session }: any = useSession()

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()

    const [resultType, setResultType] = useState('')

    const [selectedResult, setSelectedResult] = useState<IAdminResultPartial>({})

    const user: IUserState = useAppSelector(state => state.user)

    const { data, status, isFetching, fetchNextPage, hasNextPage, error } = useInfiniteQuery(
        ['adminNotifications', [resultType]], fetchResults, {
            getNextPageParam: (lastPage, pages) => lastPage?.cursor
        }
    )

    const refetch = () => queryClient.resetQueries({ queryKey: ['adminNotifications', [resultType]], type: 'active' })

    useEffect(() => {
        if (session?.user) {
          (async () => {
            const updatedUser: IUserState = await getUser(session.user.email)
            if (!user?._id && updatedUser?._id) dispatch(setUser(updatedUser))
          })()
        }
    }, [])

    useEffect(() => { if (user?._id) setResultType('groupCreationRequests') }, [user._id])

    async function fetchResults({ pageParam = 0 }) {
        if (!user?._id) return
        try {
            const res = await axios.get(`/api/fetchAdminNotificationResults?userId=${user._id}&resultType=${resultType}&cursor=${pageParam}&limit=10`)
            console.log(res.data)
            return res.data
        } catch (err) {
            console.log(err)
        }
    }

    const constructNotification = (notif: IAdminResultPartial): any => {
        switch (resultType) {
            case 'groupCreationRequests':
                return <>
                    <h5>{notif.name}</h5>
                </>
            default:
                return null
        }
    }

    const constructResultContent = (): any => {
        return <>
            <div className={styles.notification}>
                <h4 className={styles.notificationTitle}>
                    {
                        resultType == 'groupCreationRequests' ? 'Group Creation Request'
                        : null
                    }
                </h4>

                <div className={styles.notificationMsg}>
                    {
                        resultType == 'groupCreationRequests' ? 
                        <>
                            <h5><span>Name:</span> {selectedResult?.name}</h5>
                            <h5><span>Description:</span> {selectedResult?.description}</h5>
                            <h5><span>Tags:</span> {selectedResult?.tags?.join(', ')}</h5>
                            <h5><span>Date of request:</span> {getFormattedDateFromISO(selectedResult?.date)}</h5>
                        </>
                        : null
                    }
                </div>
            </div>

            <div className={styles.actions}>
                <h4 className={styles.actionsTitle}>Actions</h4>
                <div className={styles.actionsTools}>
                    <div className={styles.acceptChunk}>
                        <button>Accept</button>
                    </div>
                    <div className={styles.rejectChunk}>
                    {
                        resultType == 'groupCreationRequests' ? 
                        <>
                            <h5 className={styles.rejectReason}>Provide a reason for rejecting this group</h5>
                            <textarea id="rejectReason" rows={5}></textarea>
                            <button className={styles.rejectBtn}>Reject</button>
                        </>
                        : null
                    }
                    </div>
                </div>
            </div>
        </>
    }

    return (
        <div className={styles.container}>
            {
                session?.user?.isAdmin ?
                <>
                    <h2 className={styles.title}>Admin Tools</h2>
                    <div className={styles.sideBar}>
                        <div className={styles.options}>
                            <h5 className={`${styles.resultTypeBtn} ${resultType === 'groupCreationRequests' ? styles.active : ''}`} id='groupCreationRequests' onClick={(e) => setResultType((e.target as HTMLButtonElement).id)}>New Groups</h5>
                            <h5 className={`${styles.resultTypeBtn} ${resultType === 'userReports' ? styles.active : ''}`} id='userReports' onClick={(e) => setResultType((e.target as HTMLButtonElement).id)}>User Reports</h5>
                            <h5 className={`${styles.resultTypeBtn} ${resultType === 'groupReports' ? styles.active : ''}`} id='groupReports' onClick={(e) => setResultType((e.target as HTMLButtonElement).id)}>Group Reports</h5>
                            <Image onClick={refetch} src={refreshIcon} alt='refresh icon'></Image>
                        </div>
                        <div className={styles.results}>
                            {
                                data?.pages?.map((page, i) => (
                                    <Fragment key={i}>
                                        {
                                            page?.data?.map((notif, j) => {
                                                return <div onClick={() => setSelectedResult(notif)} className={`${styles.result} ${notif._id === selectedResult._id ? styles.active : null}`} key={j}>
                                                    {constructNotification(notif)}
                                                </div>
                                            })
                                        }
                                    </Fragment>
                                ))
                            }
                        </div>
                    </div>
                    <div className={styles.content}>
                        { selectedResult._id ? constructResultContent() : null }
                    </div>
                </>
                : <NotAuthorizedScreen />
            }
        </div>
    )
}

export default admin

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