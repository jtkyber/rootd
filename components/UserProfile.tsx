import React, { useEffect, useState, useRef } from 'react'
import styles from '../styles/UserProfile.module.css'
import axios from 'axios'
import { IUserState } from '../redux/userSlice'
import { useAppSelector } from '../redux/hooks'
import Image from 'next/image'
import getInitials from '../utils/getInitials'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setSelectedDmPerson } from '../redux/appSlice'
import { ObjectId } from 'mongodb'
import { IGroup } from '../models/groupModel'
import { ISelectedMember } from './ChatBox'

interface IMemberGroups {
    _id: ObjectId,
    name: string
}

interface IMemberData {
    username: string
    bVersion: string
    sharedGroups: IMemberGroups[]
}


const UserProfile = ({ selectedMember, setSelectedMember }: { selectedMember: ISelectedMember, setSelectedMember: any }) => {
    const router = useRouter()
    const dispatch = useDispatch()

    const modalRef: React.MutableRefObject<any> = useRef(null)
    const inviteFormRef: React.MutableRefObject<any> = useRef(null)

    const [memberDetails, setMemberDetails] = useState<IMemberData>({
        username: '',
        bVersion: '',
        sharedGroups: []
    })
    const [inviting, setInviting] = useState<boolean>(false)

    const user: IUserState = useAppSelector(state => state.user)
    const userGroups: IGroup[] = useAppSelector(state => state.group.userGroups)

    useEffect(() => {
        (async () => {
            const res = await axios.get(`/api/getMemberInfo?userId=${user._id}&memberId=${selectedMember.id}`)
            if (res?.data) setMemberDetails(res.data)
        })()
    }, [])
    
    useEffect(() => {
        document.addEventListener('mousedown', handlePageClick)
        document.addEventListener('touchstart', handlePageClick)
    
        return () => {
            document.removeEventListener('mousedown', handlePageClick)
            document.removeEventListener('touchstart', handlePageClick)
        }
    }, [inviting])

    const handlePageClick = (e) => {
        if (!modalRef?.current?.contains(e.target) && !inviteFormRef?.current?.contains(e.target) && e.target?.tagName !== 'IMG') setSelectedMember(null)
    }

    const sendDm = async () => {
        const res = await axios.post('/api/createNewDmPerson', {
            userName: user.username,
            friendName: memberDetails.username
        })

        if (res?.data) {
            dispatch(setSelectedDmPerson({ _id: selectedMember.id.toString(), username: memberDetails.username}))
            router.push('/direct-messages')
        }
    }

    const sendInvite = async (e) => {
        e.preventDefault()
        const input = e.target.querySelector('input[name=groupName]:checked')
        if (!input) return

        const res = await axios.post('/api/postNotification', {
            notificationType: "group-invite",
            userId: selectedMember.id,
            groupId: input.id,
            groupName: input.value,
            inviter: user.username
        })
        if (res?.data) {
            setInviting(false)
        }
    }

    return (
        <div className={styles.container}>
            {
                memberDetails?.username ?
                <>
                    {
                        !inviting ?
                        <div ref={modalRef} className={styles.modal}>
                            <div className={styles.msgAuthor}>
                                {
                                    selectedMember?.img ? <Image width={25} height={25} className={`${styles.authorImg}`} src={selectedMember.img} alt='Author Image'/>
                                    : <h5 className={`${styles.authorImg} ${styles.noImg}`}>{getInitials(memberDetails.username)}</h5>
                                }
                                <h2>{memberDetails.username}</h2>
                            </div>
                            <h4 className={styles.preferedBibleVersion}>Prefered Bible Version: {memberDetails.bVersion}</h4>

                            <div className={styles.sharedGroupContainer}>
                                <h4 className={styles.sharedGroupsTitle}>Groups shared with {memberDetails.username}</h4>
                                <div className={styles.sharedGroups}>
                                    {
                                        memberDetails.sharedGroups.map(group => (
                                            <h5 className={styles.singleGroupName}>{group.name}</h5>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className={styles.bottomSection}>
                                <button onClick={sendDm} className={styles.sendDmBtn}>Send direct message</button>
                                <button onClick={() => setInviting(true)} className={styles.inviteToGroup}>Invite to group</button>
                            </div>
                        </div>
                        : 
                        <form onSubmit={sendInvite} ref={inviteFormRef} className={styles.invitingToGroup}>
                            <h3 className={styles.inviteTitle}>Select a group to invite {memberDetails.username} to:</h3>
                            <div className={styles.inviteGroups} >
                                {
                                    userGroups.filter(g => {
                                        const sharedGroupIdArray = memberDetails.sharedGroups.map(g => g._id.toString())
                                        return (
                                            g?._id && !sharedGroupIdArray?.includes(g._id.toString()) 
                                            && (!g.isPrivate || (g.isPrivate && g.groupAdmin === user.username))
                                        ) ? true : false
                                    }).map((group, i) => {
                                        if (!group?._id) return null
                                        return (
                                            <div key={i} className={styles.inviteGroup}>
                                                <input type="radio" id={group._id.toString()} name="groupName" value={group.name} />
                                                <label htmlFor={group._id.toString()}>{group.name}</label><br></br>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <button type='submit' className={styles.submitInviteBtn}>Send Invite</button>
                        </form>
                    }
                </>
                : null
            }
        </div>
    )
}

export default UserProfile