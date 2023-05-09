import { NextPage } from 'next'
import styles from '../styles/Index.module.css'

const Index: NextPage = () => {
  return (
    <div className={styles.container}>
      <section className={`${styles.section} ${styles.section1}`}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h1 className={styles.slogan}>{`Connect,\n through meaningful\n conversations`}</h1>
            <p className={styles.shortDescription}>The best platform to discuss biblical topics and grow in your Faith.</p>
          </div>
          <div className={styles.visual}>
            <h1>Test</h1>
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.section2}`}></section>
      <section className={`${styles.section} ${styles.section3}`}></section>
      <section className={`${styles.section} ${styles.section4}`}></section>
    </div>
  )
}

export default Index