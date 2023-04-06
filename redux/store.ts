import { configureStore } from '@reduxjs/toolkit'
import group from './groupSlice'
import search from './searchSlice'
import user from './userSlice'
import app from './appSlice'

export const store = configureStore({
    reducer: {
        group,
        search,
        user,
        app
    }
})



export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch