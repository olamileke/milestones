"use strict"

$(document).ready(() => {

	const form = $('form');
	const name = $('.name');
	const link = $('.link');
	const description = $('.description');
	const image = $('.project-image-picker');

	const validateName = (notif = false) => {

		$('.name-notif').remove();
		const text = name.val();

		if(text.length == 0) {
			notif === true ? name.after("<p class='name-notif text-gray-600 text-xs mt-2 baloo-bhaina' style='color:#EA3C53;'>must be at least 5 characters</p>") : '';
			return false;
		}

		if(text.length < 5) {
			name.after("<p class='name-notif text-gray-600 text-xs mt-2 baloo-bhaina' style='color:#EA3C53;'>must be at least 5 characters</p>");
			return false;
		}

		return true;
	}

	const validateDescription = (notif = false) => {

		$('.description-notif').remove();
		const text = description.val();

		console.log(notif);
		if(text.length == 0) {
			notif === true ? description.after("<p class='description-notif text-gray-600 text-xs mt-2 baloo-bhaina' style='color:#EA3C53;'>must be at least 30 characters</p>") : '';
			return false;
		}

		if(text.length < 30) {
			description.after("<p class='description-notif text-gray-600 text-xs mt-2 baloo-bhaina' style='color:#EA3C53;'>must be at least 30 characters</p>");
			return false;
		}

		return true;
	}

	const validateFile = () => {

		$('.image-notif').remove();

		if(image.prop('files').length == 0) {
			image.after("<p class='image-notif text-gray-600 text-xs mt-2 baloo-bhaina' style='color:#EA3C53;'>select a valid image</p>");
			return false;
		}

		return true;
	}

	name.keyup(validateName);
	description.keyup(validateDescription);

	form.submit(function(e) {

		if(document.URL.includes('create')) {

			if(!(validateName(true) * validateFile() * validateDescription(true))) {
				e.preventDefault();
			}
		}
		else {
			if(!(validateName(true) * validateDescription(true))) {
				e.preventDefault();
			}
		}
	})
})