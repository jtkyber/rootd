import { configureStore } from '@reduxjs/toolkit'
import group from './groupSlice'

export const store = configureStore({
    reducer: {
        group: group
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch