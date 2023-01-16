import { GetServerSideProps, NextPage } from 'next'
import Nav from '../components/Nav'
import { getCookie } from 'cookies-next'
import styles from '../styles/Home.module.css'

const Home: NextPage = ({ cookie }: any) => {
  return (
    <div className={styles.container}>
        <Nav />
        <h1>cookie: {cookie}</h1>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookie = getCookie('server-key', { req, res })
  if (!cookie) {
    return {
      redirect: {
        permanent: false,
        destination: '/register'
      }
    } 
  }

  return { 
    props: {
      cookie: cookie
    }
 }
}