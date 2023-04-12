import React, { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { IGroup } from '../models/groupModel'
import { useRouter } from 'next/router'
import GroupDetailsArrow from './GroupDetailsArrow'

const GroupDetails = ({ selectedGroup, username, onlineMembers }: { selectedGroup: IGroup, username: string, onlineMembers: string[]}) => {
    const [detailedExpanded, setDetailedExpanded] = useState(false)

    const router = useRouter()

    const leaveGroup = async () => {
        const res = await axios.put('/api/leaveGroup', {
            username: username,
            groupId: selectedGroup._id
        })
        if (res.data) router.reload()
    }

    return (
        <div className={`${styles.groupDetails} ${detailedExpanded ? styles.show : null}`}>
            <div className={styles.sectionOne}>
                <h2 className={styles.name}>{selectedGroup.name}</h2>
                <h5 className={styles.summary}>{selectedGroup.summary}</h5>
            </div>

            <div className={styles.sectionTwo}>
                <h3>Members</h3>
                <div className={styles.members}>
                    {
                        selectedGroup.members.map((member, i) => (
                            <h5 className={`${styles.member} ${ onlineMembers.includes(member) ? styles.inGroup : null}`} key={i}>{member}</h5>
                        ))
                    }
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
    )
}

export default GroupDetails