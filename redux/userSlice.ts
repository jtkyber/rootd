import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IDm } from "../models/userModel"

export interface IUserState {
    username: string
    bVersion: string
    groups: string[]
    notifications: any[]
    dmPeople: IDm[]
    strikes: any[]
    directMsgs: any[]
}

interface IState {
    user: IUserState
    pusher: any
    channel: any
}

const initialState: IState = {
    user: {
        username: '',
        bVersion: '',
        groups: [],
        notifications: [],
        dmPeople: [],
        strikes: [],
        directMsgs: [],
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