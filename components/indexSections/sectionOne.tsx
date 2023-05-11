import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import HomePageSample from '../HomePageSample'
import bgImage from '../../public/neil-mark-thomas-dGyshquBzOc-unsplash.jpg'
import styles from '../../styles/indexStyles/sectionOne.module.css'

const SectionOne = () => {
    return (
        <section className={styles.container}>
            <Image priority fill src={bgImage} alt='Background image'/>
            <div className={`${styles.content}`}>
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
    )
}

export default SectionOne