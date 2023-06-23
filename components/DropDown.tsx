import React, { useEffect, useRef } from 'react'
import styles from '../styles/DropDown.module.css'

interface IParams {
	idEnd: string
	name: string
	optionArray: string[]
	onSelection: (any) => void
	selectedValues?: string[]
}

const DropDown = ({ idEnd, name, optionArray, onSelection, selectedValues }: IParams) => {
	useEffect(() => {
		if (selectedValues) applySelectedValues()
	}, [])

	const selectorRef: React.MutableRefObject<any> = useRef(null)

	const applySelectedValues = () => {
		for (let option of selectorRef?.current?.children) {
			if (selectedValues?.includes(option.children[0].value)) option.children[0].checked = 'true'
		}
	}

	const toggleList = (e): void => {
		e.preventDefault()
		selectorRef.current.classList.toggle(styles.show)
	}

	return (
		<div className={`${styles.selector}`}>
			<button
				onClick={toggleList}
				className={styles.selectorBtn}>
				{name}
			</button>
			<div
				ref={selectorRef}
				className={styles.options}>
				{optionArray.map((option, i) => (
					<div
						key={i}
						className={styles.checkboxChunk}>
						<input
							type='checkbox'
							onChange={onSelection}
							id={option + `-${idEnd}`}
							name={option}
							value={option}
						/>
						<label htmlFor={option + `-${idEnd}`}>{option}</label>
					</div>
				))}
			</div>
		</div>
	)
}

export default DropDown
