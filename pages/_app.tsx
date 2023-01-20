import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import store from '../redux/store'
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react'
import { myApi } from '../redux/apiSlice'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import Layout from '../components/Layout'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <> 
      <Head><title>Bible Study App</title></Head>
      <Provider store={store}>
        <ApiProvider api={myApi}>
          <SessionProvider session={pageProps.session}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SessionProvider>
        </ApiProvider>
      </Provider>
    </>
  )
}

export default MyApp
