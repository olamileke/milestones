$(document).ready(() => {

	const name = $('#name');
	const email = $('#email');
	const password = $('#password');
	const form = $('form');
	const auth_action = $('#auth-action').val();

	const validateName = () => {
		let text = name.val();
		$('.name-notif').remove();
		const [fname, lname] = text.split(' ');

		if(text.length == 0) {
			return false;
		}

		if(!lname && text.length < 5) {
			name.after("<p class='mt-3 text-gray-600 text-xs name-notif' style='color:#EA3C53;'>first and last names are required. must also be more than 5 characters</p>");
			return false;
		}

		if(!lname) {
			name.after("<p class='mt-3 text-gray-600 text-xs name-notif' style='color:#EA3C53;'>first and last names are required</p>");
			return false;
		}

		if(text.length < 5) {
			name.after("<p class='mt-3 text-gray-600 text-xs name-notif' style='color:#EA3C53;'>name must be greater than 5 characters</p>");
			return false;
		}

		return true;
	}

	const validateEmail = () => {
		$('.email-notif').remove();
		let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let text = email.val();

		if(text.length == 0) {
			return false;
		}

		if(!re.test(text)) {
			email.after("<p class='mt-3 text-gray-600 text-xs email-notif' style='color:#EA3C53;'>enter a valid email address</p>");
			return false;
		}

		return true;
	}

	const validatePassword = () => {
		$('.password-notif').remove();
		let text = password.val();

		if(text.length == 0) {
			return false;
		}

		if(text.length < 8) {
			password.after("<p class='mt-3 text-gray-600 text-xs password-notif' style='color:#EA3C53;'>password must be at least 8 characters</p>");
			return false;
		}

		return true;
	}

	name.keyup(validateName);
	password.keyup(validatePassword);
	email.keyup(validateEmail);

	form.submit(function(e) {
		if(auth_action == 'signup') {
			if(!validateName() || !validateEmail() || !validatePassword()) {
				e.preventDefault();
			} 
		}
		else {
			if(!validateEmail() || !validatePassword()) {
				e.preventDefault();
			} 
		}
	})
})