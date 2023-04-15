import React from 'react'
import styles from '../styles/Home.module.css'

const LikeIcon = ({ isAuthor, msgLikes, handleMsgLikeClick, likedByUser }: { isAuthor: boolean, msgLikes: number, handleMsgLikeClick: () => void, likedByUser: boolean}) => {
    return (
        <div className={styles.msgLikes}>
            {/* <svg onClick={(handleMsgLikeClick)} className={`${isAuthor ? styles.isAuthor : null} ${styles.msgLikeIcon}`} xmlns="http://www.w3.org/2000/svg">
                <path fill={likedByUser ? "#e42525" : msgLikes > 0 ? "#56667a" : "transparent"} stroke={likedByUser ? 'e42525' : '#56667a'} d="M5.301 3.002c-.889-.047-1.759.247-2.404.893-1.29 1.292-1.175 3.49.26 4.926l.515.515L8.332 14l4.659-4.664.515-.515c1.435-1.437 1.55-3.634.26-4.926-1.29-1.292-3.483-1.175-4.918.262l-.516.517-.517-.517C7.098 3.438 6.19 3.049 5.3 3.002z"/>
            </svg> */}
            <svg onClick={(handleMsgLikeClick)} className={`${isAuthor ? styles.isAuthor : null} ${styles.msgLikeIcon} ${likedByUser ? styles.likedByUser : msgLikes > 0 ? styles.likedByOther : null}`} viewBox="0 -20 188 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* <path d="M49.1899 0.279618C36.0771 -0.413632 23.2446 3.92287 13.7309 13.4514C-5.29664 32.5084 -3.60039 64.9289 17.5659 86.1099L25.1621 93.7061L93.8971 162.5L162.617 93.7061L170.214 86.1099C191.38 64.9141 193.076 32.5084 174.049 13.4514C155.021 -5.60563 122.674 -3.87988 101.508 17.3159L93.8971 24.9416L86.2714 17.3159C75.6956 6.71062 62.3174 0.972868 49.1899 0.279618Z"/> */}
                <path d="M49.1635 0.77892L49.1881 0.312816L49.1635 0.778922C62.1645 1.46549 75.4268 7.14916 85.9173 17.6689L85.9178 17.6694L93.5436 25.2952L93.8975 25.6491L94.251 25.2948L101.862 17.6692C122.869 -3.36748 154.897 -5.02212 173.695 13.8046C192.493 32.6323 190.867 64.7201 169.86 85.7566L162.264 93.3526L162.264 93.3528L93.8971 161.793L25.5158 93.3527L25.5157 93.3526L17.9195 85.7564C17.9195 85.7564 17.9195 85.7564 17.9194 85.7563C-3.08746 64.7347 -4.71388 32.6324 14.0847 13.8046C23.4886 4.38611 36.1784 0.0924208 49.1635 0.77892Z" />
            </svg>
            <h5 className={styles.msgLikeNumber}>{msgLikes > 0 ? msgLikes : null}</h5>
        </div>
    )
}

export default LikeIcon