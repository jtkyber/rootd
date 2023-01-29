import { useState } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import store from '../redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { myApi } from '../redux/apiSlice'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import Layout from '../components/Layout'
import socketInitializer from '../socketImport'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
      }
    }
  }))

  return (
    <> 
      <Head><title>Bible Study App</title></Head>
          <SessionProvider session={pageProps.session}>
            <Provider store={store}>
              <QueryClientProvider client={queryClient}>
                <Layout>
                  <Component socket={socketInitializer} {...pageProps} />
                </Layout>
                <ReactQueryDevtools initialIsOpen={false} />
              </QueryClientProvider>
            </Provider>
          </SessionProvider>
    </>
  )
}

export default MyApp
