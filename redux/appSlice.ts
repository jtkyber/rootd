import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IDm, ILastSeenMsg } from "../models/userModel"
import { ObjectId } from "mongodb"

interface IAppState {
    activeDropdown: string
}

const initialState: IAppState = {
    activeDropdown: ''
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setActiveDropdown: (state, action: PayloadAction<string>) => {
            state.activeDropdown = action.payload
        }
    }
})

export const { setActiveDropdown } = appSlice.actions

export default appSlice.reducer