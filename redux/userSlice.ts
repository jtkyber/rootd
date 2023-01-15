import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IUserState {
    _id: string,
    username: string,
    email: string,
    gender: string,
    bVersion: string,
}

const initialState: IUserState = {
    _id: '',
    username: '',
    email: '',
    gender: '',
    bVersion: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUserState>) => {
            state._id = action.payload._id
            state.username = action.payload.username
            state.email = action.payload.email
            state.gender = action.payload.gender
            state.bVersion = action.payload.bVersion
        }
    }
})

export const { setUser } = userSlice.actions

export default userSlice.reducer