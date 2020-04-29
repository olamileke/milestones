$(document).ready(() => {

	// opening/closing the add milestone dialog

	const addMilestone = $('.add__milestone');
	const addMilestoneContainer = $('.add__milestone__container');
	const close = addMilestoneContainer.find('.close');

	addMilestone.click(function() {

		if(addMilestoneContainer.hasClass('z--9999')) {
			addMilestoneContainer.removeClass('z--9999 opacity-0').addClass('z-50 opacity-100');
			return;
		}

		addMilestoneContainer.removeClass('z-50 opacity-100').addClass('z--9999 opacity-0');
	})

	close.click(function() {

		addMilestoneContainer.removeClass('z-50 opacity-100').addClass('z-0 opacity-0');
	})


	// previewing the milestone image

	const fileTrigger = $('.milestone__image__trigger');
	const fileInput = $('.milestone__image__picker');
	const imagePreview = $('.milestone__image__preview');
	const allowedExtensions = ['image/png', 'image/jpg', 'image/jpeg'];

	fileTrigger.click(function() {

		fileInput.click();
	})


	fileInput.change(function() {

		const files = fileInput.prop('files');

		if(validateFile(files)) {
			const reader = new FileReader();

			reader.onload = e => {

				imagePreview.removeClass('w-0').addClass('w-16 mr-3').attr('src', e.target.result);
			}

			reader.readAsDataURL(files[0]);
		}
	})

	const validateFile = files => {

		const file = files[0];

		if(files.length == 0) {
			return false;
		}

		if(!allowedExtensions.includes(file.type.toLowerCase())) {
			fileInput.val('');
			return false;
		}

		if(file.size > 6000000) {
			fileInput.val('');
			return false;
		}

		return true;
	}


	// add milestone validation logic

	const form = $('form');
	const textarea = $('textarea');

	const validateForm = () => {

		$('.text-area-notif').remove();
		$('.image-notif').remove();
		let error = false;

		if(textarea.val().length < 20) {
			textarea.after("<p class='text-area-notif text-gray-600 text-xs m-0 mt-1 baloo-bhaina' style='color:#EA3C53;'>Must be at least 20 characters in length</p>");
			error = true;
		}

		if(!validateFile(fileInput.prop('files'))) {
			fileTrigger.after("<p class='image-notif text-gray-600 text-xs mt-1 baloo-bhaina' style='color:#EA3C53;'>Image is required</p>");
			error = true;
		}
		
		if(!error) {
			return true;
		}

		return false;
	}


	form.submit(e => {

		if(!validateForm()) {
			e.preventDefault();
		}
	})

})