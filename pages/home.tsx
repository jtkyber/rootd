import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useSession, getSession } from 'next-auth/react'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const { data: session }: any = useSession()

  useEffect(() => {
    console.log(session.user)
  }, [])

  return (
    <div className={styles.container}>
      {
        session ?
        <>
          <div className={styles.userGroups}>
            <h1>Welcome Authorized User</h1>
            <h5>{session?.user?.username}</h5>
            <h5>{session?.user?.email}</h5>
          </div>
          <div className={styles.selectedGroup}>

          </div>
        </>
        : <h1>Not Authorized</h1>
      }
    </div>
  )
}

export default Home

export async function getServerSideProps({req}) {
  const session = await getSession({req})

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: { session }
  }
}