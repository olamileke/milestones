
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

exports.getDateString = timestamp => {
	const dt = new Date(timestamp);
	const day = days[dt.getDay()];
	const date = dt.getDate();
	const month = months[dt.getMonth()];
	const hours = dt.getHours();
	const minutes = dt.getMinutes();

	return `${day} ${date} ${month}, ${hours}:${minutes}`;
}