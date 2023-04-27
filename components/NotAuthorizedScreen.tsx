import React from 'react'

const NotAuthorizedScreen = () => {
    const style:React.CSSProperties = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        color: '#1b0d09',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    return (
        <div style={style}>
            <h1 style={{ fontWeight: '600' }}>Not Authorized</h1>
        </div>
    )
}

export default NotAuthorizedScreen