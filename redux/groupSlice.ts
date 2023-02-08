import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IGroup } from "../models/groupModel"

export interface IGroupState {
    socket: any,
    userGroups: IGroup[]
    selectedGroup: IGroup
}

const initialState: IGroupState = {
    socket: '',
    userGroups: [],
    selectedGroup: {
        _id: '',
        name: '',
        members: [],
        isPrivate: false,
        summary: '',
        tags: [],
        characters: [],
        books: [],
        date: Date.now(),
        lastActive: Date.now(),
        groupAdmin: null
    }
}

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setSocket: (state, action: PayloadAction<any>) => {
            state.socket = action.payload
        },
        setUserGroups: (state, action: PayloadAction<IGroup[]>) => {
            state.userGroups = action.payload
        },
        setSelectedGroup: (state, action: PayloadAction<IGroup>) => {
            state.selectedGroup = action.payload
        },
    }
})

export const { setSocket, setUserGroups, setSelectedGroup } = groupSlice.actions

export default groupSlice.reducer