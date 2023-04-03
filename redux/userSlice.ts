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
    lastSeenMsgs: ILastSeenMsg[]
}

interface IState {
    user: IUserState
    pusher: any
    channel: any
}

const initialState: IState = {
    user: {
        _id: null,
        username: '',
        bVersion: '',
        groups: [],
        notifications: [],
        dmPeople: [],
        strikes: [],
        directMsgs: [],
        lastSeenMsgs: []
    },
    pusher: null,
    channel: null
    
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUserState>) => {
            state.user = action.payload
        },
        setPusher: (state, action: PayloadAction<any>) => {
            state.pusher = action.payload
        },
        setChannel: (state, action: PayloadAction<any>) => {
            state.channel = action.payload
        },
    }
})

export const { setUser, setPusher, setChannel } = userSlice.actions

export default userSlice.reducer