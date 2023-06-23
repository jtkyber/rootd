import React from 'react'
import { useAppSelector } from '../redux/hooks'
import { IUserState } from '../redux/userSlice'

const NotAuthorizedScreen = () => {
	const user: IUserState = useAppSelector(state => state.user)

	const style: React.CSSProperties = {
		position: 'absolute',
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}

	return (
		<div style={style}>
			<h1 style={{ fontWeight: '600', color: user?.darkMode === true ? 'rgb(206, 204, 204' : '#1b0d09' }}>
				Not Authorized
			</h1>
		</div>
	)
}

export default NotAuthorizedScreen
