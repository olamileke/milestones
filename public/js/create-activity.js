
$(document).ready(() => {

	const allowedExtensions = ['image/png', 'image/jpg', 'image/jpeg'];
	
	// opening the select file dialog

	const fileTrigger = $('.trigger-file');
	const fileInput = $('.project-image-picker');
	const projectImage = $('.project-image');
	const fileNotification = $('.file__notif');

	fileTrigger.click(function() {

		fileInput.click();
	});

	fileInput.change(function() {
		
		const files = fileInput.prop('files');

		if(files.length > 0 && validateFile(files[0])) {
			const reader = new FileReader();

			reader.onload = function(e) {
				projectImage.removeClass('w-0').addClass('w-full').attr('src', e.target.result);
				projectImage.next().removeClass('w-0').addClass('w-full');
			}

			return reader.readAsDataURL(files[0]);
		}
	})

	const validateFile = file => {

		if(!allowedExtensions.includes(file.type.toLowerCase())) {
			fileInput.val('');
			fileNotification.removeClass('w-0').addClass('visible').text('Invalid file format');
			projectImage.removeClass('w-full').addClass('w-0');
			projectImage.next().removeClass('w-full').addClass('w-0');
			return false;
		}

		if(file.size > 6000000) {
			fileInput.val('');
			fileNotification.removeClass('w-0').addClass('visible').text('Image too large');
			projectImage.removeClass('w-full').addClass('w-0');
			projectImage.next().removeClass('w-full').addClass('w-0');
			return false;
		}

		fileNotification.removeClass('visible').addClass('w-0');
		return true;

	}
})