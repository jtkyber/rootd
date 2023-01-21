import { NextPage } from 'next'
import { useSession, getSession } from 'next-auth/react'
import axios from 'axios'
import { IGroup } from '../models/groupModel'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

const Home: NextPage = ({ userGroups }: { userGroups: IGroup[]}) => {
  const [selectedGroup, setSelectedGroup] = useState(userGroups[0])
  const { data: session }: any = useSession()

  return (
    <div className={styles.container}>
      {
        session ?
        <>
          <div className={styles.userGroups}>
            {
              userGroups.map((group, i) => {
                return <div onClick={()=> {setSelectedGroup(group)}} key={i} className={styles.singleGroup}>
                  <h4 className={styles.groupName}>{group.name}</h4>
                </div>
              })
            }
          </div>
          <div className={styles.selectedGroup}>
            <h2 className={styles.selectedGroupName}>{selectedGroup?.name}</h2>
            <div className={styles.chatBox}></div>
          </div>
        </>
        : <h1>Not Authorized</h1>
      }
    </div>
  )
}

export default Home

export async function getServerSideProps({req}) {
  const session: any = await getSession({req})

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  let userGroups: any = []
  console.log(JSON.stringify(session.user.groups))

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