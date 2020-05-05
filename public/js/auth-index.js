"use strict"

$(document).ready(() => {

	// toggling the options in the header, change picture, logout

	const navOptionsToggle = $('.nav__options__toggle');
	const navOptions = $('.nav__options');

	navOptionsToggle.click(function() {

		if(navOptions.hasClass('opacity-0')) {
			navOptions.removeClass('opacity-0 mt-20').addClass('opacity-100 mt-12');
			return;
		}

		navOptions.removeClass('opacity-100 mt-12').addClass('opacity-0 mt-20');
	})


	// Auto displaying the uploaded profile image in the browser

	const allowedExtensions = ['image/png', 'image/jpg', 'image/jpeg'];
	const fileTrigger = $('.file__trigger');
	const userImage = $('.user__image');
	const fileInput = $('.user__image__picker');
	const uploadImage = $('.upload__user__image');

	fileTrigger.click(() => {
		fileInput.click();
	});


	fileInput.change(function() {
		
		const files = fileInput.prop('files');

		if(files.length > 0 && validateFile(files[0])) {
			const reader = new FileReader();

			reader.onload = function(e) {
				userImage.attr('src', e.target.result);
				fileTrigger.addClass('hidden');
				uploadImage.removeClass('hidden').addClass('inline');
			}

			return reader.readAsDataURL(files[0]);
		}
	})

	const validateFile = file => {

		if(!allowedExtensions.includes(file.type.toLowerCase())) {
			return false;
		}

		if(file.size > 6000000) {
			return false;
		}

		return true;
	}


	// displaying the completed activity percentage

	const activityPercentage = $('.activity__percent');
	const completedCount = $('.completed__activity__count').text();
	const uncompletedCount = $('.uncompleted__activity__count').text();

	const setPercentage = () => {

		const total = Number(completedCount) + Number(uncompletedCount);
		let percent = (completedCount/total) * 100;
		percent = String(percent) + '%';
		activityPercentage.css('width', percent);
	}

	setPercentage();


	const navToggle = $('.nav__toggle');
	const navigation = $('.navigation__sm');

	navToggle.click(function() {

		if(navigation.hasClass('w-0')) {

			navigation.removeClass('w-0 h-0 hidden').addClass('w-screen h-screen fixed');
			return;
		}

		navigation.removeClass('w-screen h-screen fixed').addClass('w-0 h-0 hidden');
	})
})