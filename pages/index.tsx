import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Nav from '../components/Nav'
import styles from '../styles/Index.module.css'

const Index: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/home')
  }, [])

  return (
    <div className={styles.container}>
      <Nav />
      <div className={styles.chunk1}></div>
      <div className={styles.chunk2}></div>
      <div className={styles.chunk3}></div>
      <div className={styles.chunk4}></div>
    </div>
  )
}

export default Index