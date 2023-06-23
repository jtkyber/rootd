import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useState } from 'react'
import { Provider } from 'react-redux'
import Layout from '../components/Layout'
import store from '../redux/store'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						refetchOnMount: false,
						refetchOnReconnect: false,
						retry: false,
					},
				},
			})
	)

	return (
		<>
			<Head>
				<title>Root'd - Biblical Discussion App</title>
				<link
					rel='icon'
					href='/book.ico'
				/>
			</Head>
			<SessionProvider session={pageProps.session}>
				<Provider store={store}>
					<QueryClientProvider client={queryClient}>
						<Layout>
							<Component {...pageProps} />
						</Layout>
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</Provider>
			</SessionProvider>
		</>
	)
}

export default MyApp
