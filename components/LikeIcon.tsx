import React from 'react'
import styles from '../styles/Home.module.css'

const LikeIcon = ({ isAuthor, msgLikes, handleMsgLikeClick, likedByUser }: { isAuthor: boolean, msgLikes: number, handleMsgLikeClick: () => void, likedByUser: boolean}) => {
    return (
        <div className={styles.msgLikes}>
            <svg onClick={(handleMsgLikeClick)} className={`${isAuthor ? styles.isAuthor : null} ${styles.msgLikeIcon}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path fill={likedByUser ? "#ca0000" : msgLikes > 0 ? "#56667a" : "transparent"} stroke={likedByUser ? 'ca0000' : '#56667a'} d="M5.301 3.002c-.889-.047-1.759.247-2.404.893-1.29 1.292-1.175 3.49.26 4.926l.515.515L8.332 14l4.659-4.664.515-.515c1.435-1.437 1.55-3.634.26-4.926-1.29-1.292-3.483-1.175-4.918.262l-.516.517-.517-.517C7.098 3.438 6.19 3.049 5.3 3.002z"/>
            </svg>
            <h5 className={styles.msgLikeNumber}>{msgLikes > 0 ? msgLikes : null}</h5>
        </div>
    )
}

export default LikeIcon