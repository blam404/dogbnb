export const xDateFromToday = (days, endDate) => {
	const newDate = new Date(new Date().setDate(new Date().getDate() + days));
	if (endDate) {
		return new Date(newDate.setHours(23, 59, 59, 999));
	} else {
		return new Date(newDate.setHours(0, 0, 0, 0));
	}
};

export const convertToUTC = (date, endDate) => {
	const month = date.getMonth();
	const day = date.getDate();
	const year = date.getFullYear();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	const ms = date.getMilliseconds();

	if (endDate) {
		return Date.UTC(year, month, day, 23, 59, 59, 999);
	} else {
		return Date.UTC(year, month, day, 0, 0, 0, 0);
	}
};
