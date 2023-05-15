import React, { useEffect, useState, useRef } from 'react'
import styles from '../styles/Account.module.css'
import { getSession, useSession } from 'next-auth/react'
import { IUserState, setUser } from '../redux/userSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import getUser from '../utils/getUser'
import axios from 'axios'
import { setUserGroups } from '../redux/groupSlice'
import Image from 'next/image'
import getInitials from '../utils/getInitials'
import NotAuthorizedScreen from '../components/NotAuthorizedScreen'
import bibleVersions from '../bibleVersions.json'
import { useRouter } from 'next/router'

const account = () => {
  const { data: session }: any = useSession()

  const dispatch = useAppDispatch()

  const router = useRouter()

  const user: IUserState = useAppSelector(state => state.user)

  const [currentEdit, setCurrentEdit] = useState<string>('')

  useEffect(() => {
        if (session?.user) {
            (async () => {
            const updatedUser: IUserState = await getUser(session.user.email)
            if (!user?._id) {
                if (updatedUser?._id) dispatch(setUser(updatedUser))
                else router.replace('/signin')
            }
            if (updatedUser?.groups?.length) {
              const userGroups = await axios.get(`/api/getUserGroups?groupIds=${JSON.stringify(updatedUser.groups)}`)
              if (userGroups.data[0]) dispatch(setUserGroups(userGroups.data))
            }
          })()
        }
      }, [user._id])

    const handleDarkModeClick = async (e) => {
        const res = await axios.put('/api/toggleDarkMode', {
            userId: user._id
        })
        if (typeof res?.data === 'boolean') {
            dispatch(setUser({ ...user, darkMode: res.data }))
        }
    }

    const handleBversionChange = async (e) => {
        if (!e?.target?.value || !user?._id) return
        if (user?.bVersion === e.target.value) return

        const res = await axios.put('/api/changeBibleVersion', {
            userId: user._id,
            bibleVersion: e.target.value
        })

        if (res?.data) {
            dispatch(setUser({ ...user, bVersion: e.target.value}))
            setCurrentEdit('')
        }
    }

    return (
        <div className={`${styles.container} ${user?.darkMode === true ? styles.darkMode : ''}`}>
            {
                session ?
                <>
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
                            </div>
                            <div className={`${styles.basicInfoSection} ${styles.email}`}>
                                <h5>Email:</h5>
                                <h5>{session?.user?.email}</h5>
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
                                {
                                    currentEdit === 'bVersion' ?
                                    <select onChange={handleBversionChange} className={styles.bVersionEdit} id="bVersion" name='bVersion' defaultValue='Bible Version' required>
                                        <option value="Bible Version" disabled hidden>Bible Version</option>
                                        {
                                        bibleVersions.map((version, i) => (
                                            <option key={i} value={version}>{version}</option>
                                        ))
                                        }
                                    </select>
                                    : <button onClick={() => setCurrentEdit('bVersion')}>Edit</button>
                                }
                            </div>
                        </div>

                        <div className={styles.appSettings}>
                            <div className={`${styles.darkModeOption}`}>
                                <h5>Dark Mode:</h5>
                                <div onClick={handleDarkModeClick} className={`sliderBtn ${user?.darkMode ? 'active' : ''}`}>
                                    <div className={`slider`}>
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
                </>
                :  <NotAuthorizedScreen />
            }
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