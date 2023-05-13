import React, { useEffect, useRef } from 'react'
import styles from '../styles/Account.module.css'
import { getSession, useSession } from 'next-auth/react'
import { IUserState, setUser } from '../redux/userSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import getUser from '../utils/getUser'
import axios from 'axios'
import { setUserGroups } from '../redux/groupSlice'
import Image from 'next/image'
import getInitials from '../utils/getInitials'

const account = () => {
  const { data: session }: any = useSession()
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(state => state.user)
  const sliderRectRef: React.MutableRefObject<any> = useRef(null)

  useEffect(() => {
        if (session?.user) {
            (async () => {
            const updatedUser: IUserState = await getUser(session.user.email)
            if (!user?._id && updatedUser?._id) dispatch(setUser(updatedUser))
            
            if (updatedUser?.groups?.length) {
              const userGroups = await axios.get(`/api/getUserGroups?groupIds=${JSON.stringify(updatedUser.groups)}`)
              if (userGroups.data[0]) dispatch(setUserGroups(userGroups.data))
            }
          })()
        }
      }, [user._id])

    const handleDarkModeClick = (e) => {
        e.target.classList.toggle('active')
    }

    return (
        <div className={styles.container}>
            <div className={styles.accountContainer}>
                {
                    session?.user?.image ?
                    <Image className={styles.profileImg} width={90} height={90} src={session.user.image} alt='Profile photo' />
                    : <h1 className={`${styles.profileImg} ${styles.noImg}`}>{getInitials(user?.username) || ''}</h1>
                }

                <div className={styles.basicInfo}>
                    <div className={`${styles.basicInfoSection} ${styles.username}`}>
                        <h5>Name:</h5>
                        <h5>{user?.username}</h5>
                        <button>Edit</button>
                    </div>
                    <div className={`${styles.basicInfoSection} ${styles.email}`}>
                        <h5>Email:</h5>
                        <h5>{session?.user?.email}</h5>
                        <button>Edit</button>
                    </div>
                    {
                        session?.user?._id ?
                        <div className={`${styles.basicInfoSection} ${styles.password}`}>
                            <h5>Password:</h5>
                            <h5>********</h5>
                            <button>Edit</button>
                        </div>
                        : null
                    }
                </div>

                <div className={styles.profileSettings}>
                    <div className={`${styles.bibleVersion}`}>
                        <h5>Prefered Bible Version:</h5>
                        <h5>{user?.bVersion}</h5>
                        <button>Edit</button>
                    </div>
                </div>

                <div className={styles.appSettings}>
                    <div className={`${styles.darkMode}`}>
                        <h5>Dark Mode:</h5>
                        <div onClick={handleDarkModeClick} className={`sliderBtn`}>
                            <div className='slider'>
                                <div className='sliderRect'></div>
                                <div className='sliderBall'></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.deleteAccount}>
                    <h5 className={styles.deleteAccountBtn}>Delete Account</h5>
                </div>
            </div>
        </div>
    )
}

export default account

export async function getServerSideProps({req}) {
    const session: any = await getSession({req})
  
    if (!session) return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    }
  
    return {
      props: { 
        session
      }
    }
  }