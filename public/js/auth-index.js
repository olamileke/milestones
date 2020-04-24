"use strict"

$(document).ready(() => {

	const allowedExtensions = ['image/png', 'image/jpg', 'image/jpeg'];
	const camera = $('.fa-camera');
	const userImage = $('.user__image');
	const fileInput = $('.user__image__picker');
	const uploadImage = $('.upload__user__image');

	camera.click(() => {
		fileInput.click();
	});


	fileInput.change(function() {
		
		const files = fileInput.prop('files');

		if(files.length > 0 && validateFile(files[0])) {
			const reader = new FileReader();

			reader.onload = function(e) {
				userImage.attr('src', e.target.result);
				camera.removeClass('fa-camera');
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

})