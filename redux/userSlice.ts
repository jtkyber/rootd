import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IDm, ILastSeenMsg } from "../models/userModel"
import { ObjectId } from "mongodb"

export interface IUserState {
    _id: ObjectId | null
    username: string
    bVersion: string
    groups: string[]
    notifications: any[]
    dmPeople: IDm[]
    strikes: any[]
    directMsgs: any[]
    lastSeenMsgs: ILastSeenMsg[],
    currentDmPerson: string | null
    isAdmin: boolean
    darkMode: boolean
}

const initialState: IUserState = {
    _id: null,
    username: '',
    bVersion: '',
    groups: [],
    notifications: [],
    dmPeople: [],
    strikes: [],
    directMsgs: [],
    lastSeenMsgs: [],
    currentDmPerson: null,
    isAdmin: false,
    darkMode: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUserState>) => {
            state._id = action.payload._id,
            state.username = action.payload.username,
            state.bVersion = action.payload.bVersion,
            state.groups = action.payload.groups,
            state.notifications = action.payload.notifications,
            state.dmPeople = action.payload.dmPeople,
            state.strikes = action.payload.strikes,
            state.directMsgs = action.payload.directMsgs,
            state.lastSeenMsgs = action.payload.lastSeenMsgs,
            state.isAdmin = action.payload.isAdmin,
            state.darkMode = action.payload.darkMode
        }
    }
})

export const { setUser } = userSlice.actions

export default userSlice.reducer