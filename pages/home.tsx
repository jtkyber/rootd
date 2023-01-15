import { NextPage } from 'next'
import Nav from '../components/Nav'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
        <Nav />
        <h1>Home</h1>
    </div>
  )
}

export default Home