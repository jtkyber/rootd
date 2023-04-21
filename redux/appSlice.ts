import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IDm, ILastSeenMsg } from "../models/userModel"
import { ObjectId } from "mongodb"

interface IAppState {
    activeDropdown: string
    showDMs: boolean
}

const initialState: IAppState = {
    activeDropdown: '',
    showDMs: false
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setActiveDropdown: (state, action: PayloadAction<string>) => {
            state.activeDropdown = action.payload
        },
        setShowDMs: (state, action: PayloadAction<boolean>) => {
            state.showDMs = action.payload
        }
    }
})

export const { setActiveDropdown, setShowDMs } = appSlice.actions

export default appSlice.reducer