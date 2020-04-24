
$(document).ready(() => {

	const allowedExtensions = ['image/png', 'image/jpg', 'image/jpeg'];
	
	// opening the select file dialog

	const fileTrigger = $('.trigger-file');
	const fileInput = $('.project-image-picker');
	const projectImage = $('.project-image');

	fileTrigger.click(function() {

		const $this = $(this);
		$this.next().click();
	});

	fileInput.change(function() {
		
		const files = fileInput.prop('files');

		if(files.length > 0 && validateFile(files[0])) {
			const reader = new FileReader();

			reader.onload = function(e) {
				projectImage.attr('src', e.target.result).removeClass('opacity-0').addClass('opacity-100');
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