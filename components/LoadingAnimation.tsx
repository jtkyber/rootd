import React from 'react'

const LoadingAnimation: React.FC = () => {
    return <div className='loadingAnimation'>{ [...Array(8)].map((e, i) => <div key={i}></div>) }</div>
}

export default LoadingAnimation