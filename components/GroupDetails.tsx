import React, { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

const GroupDetails = ({ selectedGroup, username, onlineMembers }) => {
    const [detailedExpanded, setDetailedExpanded] = useState(false)

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
                <button className={styles.leaveGroup}>Leave Group</button>
                {username === selectedGroup.groupAdmin 
                ? <button className={styles.removeGroup}>Remove Group</button>
                : null}
            </div>

            <button onClick={() => setDetailedExpanded(!detailedExpanded)} className={`${styles.expandGroupDetailsBtn} ${detailedExpanded ? styles.show : null}`}>
                <div className={styles.arrow}></div>
            </button>
        </div>
    )
}

export default GroupDetails