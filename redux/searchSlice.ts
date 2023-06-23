import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ICurSort {
	name: string
	dir: string
}

export interface ISearchState {
	currentSort: ICurSort
}

const initialState: ISearchState = {
	currentSort: {
		name: 'name',
		dir: 'down',
	},
}

export const searchSlice = createSlice({
	name: 'serach',
	initialState,
	reducers: {
		setCurrentSort: (state, action: PayloadAction<string>) => {
			if (state.currentSort.name === action.payload)
				state.currentSort.dir = state.currentSort.dir === 'down' ? 'up' : 'down'
			else {
				state.currentSort.name = action.payload
				state.currentSort.dir = 'down'
			}
		},
	},
})

export const { setCurrentSort } = searchSlice.actions

export default searchSlice.reducer
