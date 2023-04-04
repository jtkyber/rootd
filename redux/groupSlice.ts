import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IGroup } from "../models/groupModel"

export interface IGroupState {
    userGroups: IGroup[]
    selectedGroup: IGroup
}

export const initialSelectedGroupState = {
    _id: null,
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

const initialState: IGroupState = {
    userGroups: [],
    selectedGroup: initialSelectedGroupState
}

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setUserGroups: (state, action: PayloadAction<IGroup[]>) => {
            state.userGroups = action.payload
        },
        setSelectedGroup: (state, action: PayloadAction<IGroup>) => {
            state.selectedGroup = action.payload
        },
    }
})

export const { setUserGroups, setSelectedGroup } = groupSlice.actions

export default groupSlice.reducer