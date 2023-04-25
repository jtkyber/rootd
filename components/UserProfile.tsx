import React, { useEffect, useState } from 'react'
import styles from '../styles/UserProfile.module.css'
import axios from 'axios'
import { IUserState } from '../redux/userSlice'
import { useAppSelector } from '../redux/hooks'
import Image from 'next/image'
import getInitials from '../utils/getInitials'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setSelectedDmPerson } from '../redux/appSlice'

interface IMemberData {
    username: string
    bVersion: string
    sharedGroups: string[]
}

const UserProfile = ({ selectedMember }) => {
    const router = useRouter()

    const dispatch = useDispatch()

    const [memberDetails, setMemberDetails] = useState<IMemberData>({
        username: '',
        bVersion: '',
        sharedGroups: []
    })

    const user: IUserState = useAppSelector(state => state.user)

    useEffect(() => {
        (async () => {
            const res = await axios.get(`/api/getMemberInfo?userId=${user._id}&memberId=${selectedMember.id}`)
            if (res?.data) setMemberDetails(res.data)
        })()
    }, [])

    const sendDm = async () => {
        const res = await axios.post('/api/createNewDmPerson', {
            userName: user.username,
            friendName: memberDetails.username
        })

        if (res?.data) {
            dispatch(setSelectedDmPerson({ _id: selectedMember.id, username: memberDetails.username}))
            router.push('/direct-messages')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                {
                    memberDetails?.username ?
                    <>
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
                                        <h5 className={styles.singleGroupName}>{group}</h5>
                                    ))
                                }
                            </div>
                        </div>

                        <div className={styles.bottomSection}>
                            <button onClick={sendDm} className={styles.sendDmBtn}>Send direct message</button>
                            <button className={styles.inviteToGroup}>Invite to group</button>
                        </div>
                    </>
                    : null
                }
            </div>
        </div>
    )
}

export default UserProfile