import React, { useEffect, useRef } from 'react'
import { NextPage } from 'next'
import styles from '../styles/Index.module.css'
import Image from 'next/image'
import Link from 'next/link'
import HomePageSample from '../components/HomePageSample'
import bgImage from '../public/neil-mark-thomas-dGyshquBzOc-unsplash.jpg'

const Index: NextPage = () => {
  const ref: React.MutableRefObject<any> = useRef()

  useEffect(() => {
    document.addEventListener('resize', handleResize)

    return () => document.removeEventListener('resize', handleResize)
  }, [ref.current])

  const handleResize = () => {
    console.log(ref.current)
  }

  return (
    <div className={styles.container}>
      <section className={`${styles.section} ${styles.section1}`}>
        <Image priority fill src={bgImage} alt='Background image'/>
        <div ref={ref} className={`${styles.content}`}>
          <div className={`${styles.text} text`}>
            <h1 className={styles.slogan}>{`Connect,\n through meaningful\n conversations`}</h1>
            <p className={styles.shortDescription}>The best platform to discuss biblical topics and grow in your Faith.</p>
            <div className={styles.register}>
              <Link href='/signup'>Sign Up Now</Link>
            </div>
          </div>
          <div className={styles.visual}>
              <HomePageSample />
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