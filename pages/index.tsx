import React from 'react'
import { NextPage } from 'next'
import SectionOne from '../components/indexSections/sectionOne'
import styles from '../styles/Index.module.css'
import { getSession } from 'next-auth/react'

const Index: NextPage = () => {
  return (
    <div className={styles.container}>
      <SectionOne />
    </div>
  )
}

export default Index

// export async function getServerSideProps({req}) {
//   const session: any = await getSession({req})

//   if (session) return {
//     props: { 
//       session
//     }
//   }
//   return null
// }