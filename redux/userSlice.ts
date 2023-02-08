import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IDm } from "../models/userModel"

export interface IUserState {
    bVersion: string,
    groups: string[],
    notifications: any[],
    dmPeople: IDm[],
    strikes: any[],
    directMsgs: any[]
}

interface IState {
    user: IUserState
}

const initialState: IState = {
    user: {
        bVersion: '',
        groups: [],
        notifications: [],
        dmPeople: [],
        strikes: [],
        directMsgs: []
    }
    
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUserState>) => {
            state.user = action.payload
        },
    }
})

export const { setUser } = userSlice.actions

export default userSlice.reducer