export const dateToStr = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export const displayDate = (date: Date): string => {
	const recievedDate = new Date(date);
	const isoDate = recievedDate.toISOString();
	const [year, month, day] = isoDate.substr(0, 10).split("-");
	return `${year}. ${month}. ${day}.`;
};

export const displayShortDate = (date: Date): string => {
	const recievedDate = new Date(date);
	const isoDate = recievedDate.toISOString();
	const [, month, day] = isoDate.substr(0, 10).split("-");
	return `${month}. ${day}.`;
};
