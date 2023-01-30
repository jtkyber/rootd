import { NextPage } from 'next'
import { useSession, getSession } from 'next-auth/react'
import axios from 'axios'
import { IGroup } from '../models/groupModel'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setSelectedGroup } from '../redux/groupSlice'
import ChatBox from '../components/ChatBox'

const Home: NextPage = ({ userGroups, socket }: { userGroups: IGroup[], socket: any }) => {
  const dispatch = useAppDispatch()

  const selectedGroup: IGroup = useAppSelector(state => state.group.selectedGroup)
  
  const { data: session }: any = useSession()

  useEffect(() => {
    dispatch(setSelectedGroup(userGroups[0]))
    const rooms = userGroups.map(group => group._id)
    socket.emit('join groups', rooms)
  }, [])

  return (
    <div className={styles.container}>
      {
        session ?
        <>
          <div className={styles.userGroups}>
            {
              userGroups.map((group, i) => (
                <div 
                onClick={()=> {dispatch(setSelectedGroup(group))}} 
                key={i} 
                className={`${styles.singleGroup} ${group._id === selectedGroup._id ? styles.selectedGroup : null}`}>
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

  let userGroups: any = []
  
  if (session?.user?.groups) {
    userGroups = await axios.get(`${process.env.CURRENT_BASE_URL}/api/getUserGroups?groupIds=${JSON.stringify(session.user.groups)}`)
  }

  return {
    props: { 
      session,
      userGroups: userGroups.data
    }
  }
}