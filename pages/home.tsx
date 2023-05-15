import { NextPage } from 'next'
import { useSession, getSession } from 'next-auth/react'
import axios from 'axios'
import { IGroup } from '../models/groupModel'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { initialSelectedGroupState, setSelectedGroup, setUserGroups } from '../redux/groupSlice'
import ChatBox from '../components/ChatBox'
import { IUserState, setUser } from '../redux/userSlice'
import getUser from '../utils/getUser'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { PresenceChannel } from 'pusher-js'
import NotAuthorizedScreen from '../components/NotAuthorizedScreen'
import { useRouter } from 'next/router'

const Home: NextPage = ({ channels }: {channels: PresenceChannel[] | []}) => {
  const dispatch = useAppDispatch()

  const router = useRouter()

  const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)
  const userGroups: IGroup[] = useAppSelector(state => state.group.userGroups)
  const user: IUserState = useAppSelector(state => state.user)
  
  const { data: session }: any = useSession()

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
  
  useEffect(() => { if (userGroups[0] && !selectedGroup._id) dispatch(setSelectedGroup(userGroups[0])) }, [userGroups])

  return (
    <div className={`${styles.container}  ${user?.darkMode === true ? styles.darkMode : ''}`}>
      {
        session ?
        <>
          <div className={styles.userGroups}>
            <h3 className={styles.title}>My Groups</h3>
            {
              userGroups.length ?
                userGroups?.map((group, i) => (
                  <div 
                  onClick={()=> {dispatch(setSelectedGroup(group))}} 
                  key={i} 
                  className={`${styles.singleGroup} ${group._id === selectedGroup._id ? styles.selected : null}`}>
                    <h4 className={styles.groupName}>{group.name}</h4>
                  </div>
                ))
              : <Link href='/group-search'>Find Group</Link>
            }
          </div>
         <ChatBox channels={channels} />
        </>
        : <NotAuthorizedScreen />
      }
    </div>
  )
}

export default Home

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