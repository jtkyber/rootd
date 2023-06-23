export function getFormattedDateFromISO(isoDate): string {
	const isToday = someDate => {
		const today = new Date()
		return (
			someDate.getDate() == today.getDate() &&
			someDate.getMonth() == today.getMonth() &&
			someDate.getFullYear() == today.getFullYear()
		)
	}

	const dateObj = new Date(isoDate)
	const date = dateObj.toLocaleDateString()
	const time = dateObj
		.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		.replace(/\s+/g, '')
		.toLocaleLowerCase()

	return `${isToday(dateObj) ? '' : date + ' '}${time}`
}
