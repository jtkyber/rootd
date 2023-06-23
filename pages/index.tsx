import { NextPage } from 'next'
import React from 'react'
import SectionOne from '../components/indexSections/sectionOne'
import styles from '../styles/Index.module.css'

const Index: NextPage = () => {
	return (
		<div className={styles.container}>
			<SectionOne />
		</div>
	)
}

export default Index

// 112 ts/css filesi
