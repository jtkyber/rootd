import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const myApi = createApi({
    reducerPath: 'myApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    endpoints: (builder) => ({
        removeCookie: builder.query({
            query: () => 'removeCookie'
        })
    })
})

export const { useRemoveCookieQuery } = myApi