
$(document).ready(() => {

	const form = $('form');
	const email = form.find('input[type="email"]');
	const password = form.find('input[type="password"]');
	const passwordIcon = $('.password__icon');

	const validateEmail = (empty = false) => {
		$('.email-notif').remove();
		let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let text = email.val();

		if(text.length == 0) {
			empty == true ? email.after("<p class='mt-3 text-gray-600 text-xs email-notif' style='color:#EA3C53;'>enter a valid email address</p>") : '';
			return false;
		}

		if(!re.test(text)) {
			email.after("<p class='mt-3 text-gray-600 text-xs email-notif' style='color:#EA3C53;'>enter a valid email address</p>");
			return false;
		}

		return true;
	}

	const validatePassword = (empty = false) => {
		$('.password-notif').remove();
		let text = password.val();

		if(text.length == 0) {
			empty == true ? password.after("<p class='mt-3 text-gray-600 text-xs password-notif' style='color:#EA3C53;'>password must be at least 8 characters</p>") : '';
			passwordIcon.addClass('invisible'); 
			return false;
		}

		if(text.length < 8) {
			password.after("<p class='mt-3 text-gray-600 text-xs password-notif' style='color:#EA3C53;'>password must be at least 8 characters</p>");
			passwordIcon.removeClass('invisible'); 
			return false;
		}

		return true;
	}

	const togglePassword = () => {
		if(passwordIcon.hasClass('fa-unlock')) {
			passwordIcon.removeClass('fa-unlock').addClass('fa-lock');
			password.attr('type', 'text');
			return;
		}

		passwordIcon.removeClass('fa-lock').addClass('fa-unlock');
		password.attr('type', 'password');
	}

	email.keyup(validateEmail);
	password.keyup(validatePassword);
	passwordIcon.click(togglePassword);

	form.submit(function(e) {	

		if(document.URL.includes('confirm')) {

			if(!validateEmail(true)) {
				e.preventDefault();
			}
		}
		else {

			if(!validatePassword(true)) {
				e.preventDefault();
			}	
		}
	})


})