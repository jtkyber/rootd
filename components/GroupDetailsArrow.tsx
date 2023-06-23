import React from 'react'

const GroupDetailsArrow = ({ clickFunction }) => {
	return (
		<svg
			onClick={clickFunction}
			width='468'
			height='236'
			viewBox='0 0 468 236'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<filter id='inset-shadow'>
				<feOffset
					dx='0'
					dy='0'
				/>

				<feGaussianBlur
					stdDeviation='3'
					result='offset-blur'
				/>

				<feComposite
					operator='out'
					in='SourceGraphic'
					in2='offset-blur'
					result='inverse'
				/>

				<feFlood
					floodColor='black'
					floodOpacity='.95'
					result='color'
				/>
				<feComposite
					operator='in'
					in='color'
					in2='inverse'
					result='shadow'
				/>

				<feComposite
					operator='over'
					in='shadow'
					in2='SourceGraphic'
				/>
			</filter>
			<g clipPath='url(#clip0_14_2)'>
				<path
					d='M160.917 0.196777H467.532V235.831H160.917V0.196777Z'
					fill='#D9D9D9'
				/>
				<path
					d='M0.235352 118L160.941 0.154297V235.846L0.235352 118Z'
					fill='#D9D9D9'
				/>
				<text
					fill='black'
					xmlSpace='preserve'>
					<tspan
						x='190'
						y='96.1884'>
						Group&#10;
					</tspan>
					<tspan
						x='180'
						y='186.188'>
						Details
					</tspan>
				</text>
			</g>
			<defs>
				<clipPath id='clip0_14_2'>
					<rect
						width='468'
						height='236'
						fill='white'
					/>
				</clipPath>
			</defs>
		</svg>
	)
}

export default GroupDetailsArrow
