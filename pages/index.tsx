import { NextPage } from 'next'
import styles from '../styles/Index.module.css'

const Index: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.chunk1}></div>
      <div className={styles.chunk2}></div>
      <div className={styles.chunk3}></div>
      <div className={styles.chunk4}></div>
    </div>
  )
}

export default Index