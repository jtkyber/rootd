import React, { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { IGroup } from '../models/groupModel'
import { useRouter } from 'next/router'
import GroupDetailsArrow from './GroupDetailsArrow'
import { IUserState } from '../redux/userSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setSelectedGroup } from '../redux/groupSlice'
import Image from 'next/image'
import MuteBtn from './MuteBtn'

const GroupDetails = ({ selectedGroup, username, onlineMembers }: { selectedGroup: IGroup, username: string, onlineMembers: string[]}) => {
    const [detailedExpanded, setDetailedExpanded] = useState(false)
    const [memberArray, setMemberArray] = useState<JSX.Element[]>([])

    const user: IUserState = useAppSelector(state => state.user)

    const dispatch = useAppDispatch()

    const router = useRouter()

    useEffect(() => {
        const memberArrayTemp: JSX.Element[] = 
        selectedGroup?.members?.slice()
        ?.sort((a, b) => onlineMembers.includes(a) ? -1 : 1)
        ?.map((member, i) => (
            <h5 className={`${styles.member} ${ onlineMembers.includes(member) ? styles.inGroup : null}`} key={i}>{member}</h5>
        ))

        setMemberArray(memberArrayTemp)
    }, [selectedGroup, onlineMembers])

    const leaveGroup = async () => {
        const res = await axios.put('/api/leaveGroup', {
            username: username,
            groupId: selectedGroup._id
        })
        if (res.data) router.reload()
    }

    const toggleGroupNotications = async () => {
        const res = await axios.put('/api/toggleGroupNotications', { 
            groupId: selectedGroup._id,
            username: user.username
        })

        if (res.data && !selectedGroup.membersWithGroupMuted.includes(username)) {
            dispatch(setSelectedGroup({ ...selectedGroup, membersWithGroupMuted: [ ...selectedGroup.membersWithGroupMuted, username ] }))
        } else if (!res.data && selectedGroup.membersWithGroupMuted.includes(username)) {
            const indexOfName = selectedGroup.membersWithGroupMuted.indexOf(username)
            if (indexOfName < 0) return
            const newArray = selectedGroup.membersWithGroupMuted.slice()
            newArray.splice(indexOfName, 1)
            dispatch(setSelectedGroup({ ...selectedGroup, membersWithGroupMuted: newArray }))
        }
    }

    return (
            selectedGroup?._id ?
                <div className={`${styles.groupDetails} ${detailedExpanded ? styles.show : null}`}>
                    <button onClick={toggleGroupNotications} className={`${styles.muteGroup} ${selectedGroup.membersWithGroupMuted.includes(username) ? styles.muted : null}`}>
                        <MuteBtn /> 
                    </button>
                    <div className={styles.sectionOne}>
                        <h2 className={styles.name}>{selectedGroup.name}</h2>
                        <h5 className={styles.summary}>{selectedGroup.summary}</h5>
                    </div>

                    <div className={styles.sectionTwo}>
                        <h3>Members</h3>
                        <div className={styles.members}>
                            { memberArray }
                        </div>
                    </div>

                    <div className={styles.bottomSection}>
                        <button onClick={leaveGroup} className={styles.leaveGroup}>Leave Group</button>
                        {username === selectedGroup.groupAdmin 
                        ? <button className={styles.removeGroup}>Remove Group</button>
                        : null}
                    </div>

                    <button onClick={() => setDetailedExpanded(!detailedExpanded)} className={`${styles.expandGroupDetailsBtn} ${detailedExpanded ? styles.show : null}`}>
                        <GroupDetailsArrow />
                    </button>
                </div>
            : null
    )
}

export default GroupDetails