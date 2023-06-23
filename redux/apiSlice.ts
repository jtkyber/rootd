import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const myApi = createApi({
	reducerPath: 'myApi',
	baseQuery: fetchBaseQuery({ baseUrl: `${process.env.CURRENT_BASE_URL}` }),
	endpoints: builder => ({
		removeCookie: builder.query({
			query: () => '/findGroups',
		}),
	}),
})

export const { useRemoveCookieQuery } = myApi
