import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import store from '../redux/store'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient()

  return (
    <> 
      <Head><title>Bible Study App</title></Head>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </Provider>
    </>
  )
}

export default MyApp
