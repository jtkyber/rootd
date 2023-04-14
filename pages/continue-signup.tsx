import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { useSession, getSession } from 'next-auth/react'
import NotAuthorizedScreen from '../components/NotAuthorizedScreen'
import { useRouter } from 'next/router'
import axios from 'axios'
import LoadingAnimation from '../components/LoadingAnimation'
import styles from '../styles/LogReg.module.css'

const FinishRegister: NextPage = () => {
  const { data: session }: any = useSession()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errMessage, setErrMessage] = useState('')

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    try {
        setIsLoading(true)
        setErrMessage('')
        const form = e.target as HTMLFormElement

        const username: HTMLInputElement | null = form.querySelector('#username')
        const password= 'Signed Up With Google'
        const email = session?.user?.email
        const gender: HTMLInputElement | null = form.querySelector('#gender')
        const bVersion: HTMLInputElement | null = form.querySelector('#bVersion')
        
        if (!(username?.value && password && email && gender?.value && bVersion?.value)) {
          throw new Error ('Please fill out all fields')
        }
        console.log(username?.value, password, email, gender?.value, bVersion?.value)

        const res = await axios.post('/api/auth/register', {
            username: username.value,
            password: password,
            email: email,
            gender: gender.value,
            bVersion: bVersion.value,
        })
        
        if (res?.data?.error) {
            setErrMessage(res.data.error)
        }

        const newUser = res.data
        if (newUser?._id?.length) {
            router.replace('/login')
        } else throw new Error('Could not Register')
    } catch (err) {
        console.log(err.message)
        setIsLoading(false)
        if (err?.response?.data) setErrMessage(err.response.data)
    }
}

  return (
    <div className={styles.container}>
      {
        session ?
           <form onSubmit={handleSubmit}>
                <h1>Finish Singing Up</h1>
                <h5 className={styles.errorMessage}>{errMessage}</h5>
                <input minLength={3} maxLength={20} disabled={isLoading} id="username" type="text" placeholder='username' autoComplete='off' required />
                <div className={styles.genderAndVersion}>
                    <select disabled={isLoading} id="gender" name='gender' defaultValue='Gender' required>
                        <option value="Gender" disabled hidden>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select disabled={isLoading} id="bVersion" name='bVersion' defaultValue='Prefered Bible Version' required>
                        <option value="Prefered Bible Version" disabled hidden>Prefered Bible Version</option>
                        <option value="NIV">NIV</option>
                        <option value="ESV">ESV</option>
                    </select>
                </div>
                {
                    isLoading
                    ? <div className={styles.loading}><LoadingAnimation /></div>
                    : <button type="submit">Submit</button>
                }
            </form>
        : <NotAuthorizedScreen />
      }
    </div>
  )
}

export default FinishRegister

export async function getServerSideProps({req}) {
  const session: any = await getSession({req})

  if (!session) return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }

  return {
    props: { 
      session
    }
  }
}