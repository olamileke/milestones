
days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

exports.getDateString = timestamp => {

	dt = new Date(timestamp);
	day = days[dt.getDay()];
	date = dt.getDate();
	month = months[dt.getMonth()];
	hours = dt.getHours();
	minutes = dt.getMinutes();

	if(String(hours).length == 1) {

		hours = '0' + String(hours);
	}

	if(String(minutes).length == 1) {

		minutes = '0' + String(minutes);
	}

	return `${day} ${date} ${month}, ${hours}:${minutes}`;
}