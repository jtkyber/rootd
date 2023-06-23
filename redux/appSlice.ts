import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ObjectId } from 'mongodb'
import { IDm, ILastSeenMsg } from '../models/userModel'

export interface ISelectedDmPerson {
	_id: string
	username: string
}

interface IAppState {
	activeDropdown: string
	showDMs: boolean
	selectedDmPerson: ISelectedDmPerson
	isMobile: boolean
}

const initialState: IAppState = {
	activeDropdown: '',
	showDMs: false,
	selectedDmPerson: {
		_id: '',
		username: '',
	},
	isMobile: false,
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
		},
		setIsMobile: (state, action: PayloadAction<boolean>) => {
			state.isMobile = action.payload
		},
	},
})

export const { setActiveDropdown, setShowDMs, setSelectedDmPerson, setIsMobile } = appSlice.actions

export default appSlice.reducer
