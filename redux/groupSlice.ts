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
    memberCount: 0,
    isPrivate: false,
    description: '',
    tags: [],
    characters: [],
    books: [],
    date: Date.now(),
    lastActive: Date.now(),
    groupAdmin: null,
    membersWithGroupMuted: []
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
        setSingleGroup: (state, action: PayloadAction<any>) => {
            state.userGroups[action.payload.index] = action.payload.group
        },
        setSelectedGroup: (state, action: PayloadAction<IGroup>) => {
            state.selectedGroup = action.payload
        },
    }
})

export const { setUserGroups, setSelectedGroup, setSingleGroup } = groupSlice.actions

export default groupSlice.reducer