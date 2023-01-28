import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IGroup, IMsg } from "../models/groupModel"

export interface IGroupState {
    socket: any,
    selectedGroup: IGroup,
    selectedGroupMsgs: IMsg[]
}

const initialState: IGroupState = {
    socket: '',
    selectedGroup: {
        _id: '',
        name: '',
        members: [],
        isPrivate: false,
        summary: '',
        tags: [],
        characters: [],
        books: [],
        date: new Date()
    },
    selectedGroupMsgs: []
}

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setSocket: (state, action: PayloadAction<any>) => {
            state.socket = action.payload
        },
        setSelectedGroup: (state, action: PayloadAction<IGroup>) => {
            state.selectedGroup = action.payload
        },
        setSelectedGroupMsgs: (state, action: PayloadAction<IMsg[]>) => {
            state.selectedGroupMsgs = action.payload
        }
    }
})

export const { setSocket, setSelectedGroup, setSelectedGroupMsgs } = groupSlice.actions

export default groupSlice.reducer