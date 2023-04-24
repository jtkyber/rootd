import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IDm, ILastSeenMsg } from "../models/userModel"
import { ObjectId } from "mongodb"

export interface ISelectedDmPerson {
    _id: string,
    username: string
}

interface IAppState {
    activeDropdown: string
    showDMs: boolean
    selectedDmPerson: ISelectedDmPerson
}


const initialState: IAppState = {
    activeDropdown: '',
    showDMs: false,
    selectedDmPerson: {
        _id: '',
        username: ''
    }
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
        },
        setSelectedDmPerson: (state, action: PayloadAction<ISelectedDmPerson>) => {
            state.selectedDmPerson = action.payload
        }
    }
})

export const { setActiveDropdown, setShowDMs, setSelectedDmPerson } = appSlice.actions

export default appSlice.reducer