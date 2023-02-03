import { configureStore } from '@reduxjs/toolkit'
import group from './groupSlice'
import search from './searchSlice';

export const store = configureStore({
    reducer: {
        group: group,
        search: search
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch