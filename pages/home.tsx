import { NextPage } from 'next'
import { useSession, getSession } from 'next-auth/react'
import axios from 'axios'
import { IGroup } from '../models/groupModel'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setSelectedGroup, setUserGroups } from '../redux/groupSlice'
import ChatBox from '../components/ChatBox'
import { IUserState, setUser } from '../redux/userSlice'
import getUser from '../utils/getUser'
import styles from '../styles/Home.module.css'

const Home: NextPage = ({ socket }: { socket: any }) => {
  const dispatch = useAppDispatch()

  const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)
  const userGroups: IGroup[] = useAppSelector(state => state.group.userGroups)
  const user: IUserState = useAppSelector(state => state.user.user)
  
  const { data: session }: any = useSession()

  useEffect(() => {
    if (session.user) {
      (async () => {
        const updatedUser: IUserState = await getUser(session.user.email)
        if (!user?.bVersion) {
          if (updatedUser) dispatch(setUser(updatedUser))
        }

        const userGroups = await axios.get(`${process.env.CURRENT_BASE_URL}/api/getUserGroups?groupIds=${JSON.stringify(updatedUser.groups)}`)
        if (userGroups.data[0]) dispatch(setUserGroups(userGroups.data))
      })()
    }
  }, [])

  useEffect(() => {
    if (userGroups[0]) {
      dispatch(setSelectedGroup(userGroups[0]))
      const rooms = userGroups.map(group => group._id)
      // socket.emit('join groups', rooms)
    }
  }, [userGroups])

  return (
    <div className={styles.container}>
      {
        session ?
        <>
          <div className={styles.userGroups}>
            {
              userGroups?.map((group, i) => (
                <div 
                onClick={()=> {dispatch(setSelectedGroup(group))}} 
                key={i} 
                className={`${styles.singleGroup} ${group._id === selectedGroup._id ? styles.selected : null}`}>
                  <h4 className={styles.groupName}>{group.name}</h4>
                </div>
              ))
            }
          </div>
         <ChatBox socket={socket}/>
        </>
        : <h1>Not Authorized</h1>
      }
    </div>
  )
}

export default Home

export async function getServerSideProps({req}) {
  const session: any = await getSession({req})

  if (!session) return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }

  // let userGroups: any = []
  
  // if (session?.user?.groups) {
  //   userGroups = await axios.get(`${process.env.CURRENT_BASE_URL}/api/getUserGroups?groupIds=${JSON.stringify(session.user.groups)}`)
  // }

  return {
    props: { 
      session
    }
  }
}