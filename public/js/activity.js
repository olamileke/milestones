$(document).ready(() => {

	const allowedExtensions = ['image/png', 'image/jpg', 'image/jpeg'];

	// opening/closing the add milestone dialog

	const body = $('body');
	const addMilestone = $('.add__milestone');
	const addMilestoneContainer = $('.add__milestone__container');
	const addClose = addMilestoneContainer.find('.close');

	addMilestone.click(function() {

		if(addMilestoneContainer.hasClass('z--9999')) {
			body.addClass('overflow-y-hidden');
			addMilestoneContainer.removeClass('z--9999 opacity-0').addClass('z-50 opacity-100');
			return;  
		}

		addMilestoneContainer.removeClass('z-50 opacity-100').addClass('z--9999 opacity-0');
	})

	addClose.click(function() {

		addMilestoneContainer.removeClass('z-50 opacity-100').addClass('z--9999 opacity-0');
		body.removeClass('overflow-y-hidden');
	})


	// previewing the milestone image

	const addTrigger = addMilestoneContainer.find('.milestone__trigger')
	const addMilestoneFileInput = addMilestoneContainer.find('.milestone__file__input');
	const addMilestonePreview= addMilestoneContainer.find('.milestone__preview');

	addTrigger.click(function() {

		addMilestoneFileInput.click();
	})

	addMilestoneFileInput.change(() => {

		previewImage(addMilestoneFileInput, addMilestonePreview);
	})

	const previewImage = (fileInput, image) => {

		if(validateFile(fileInput, image)) {
			const reader = new FileReader();

			reader.onload = e => {

				image.removeClass('w-0 h-6').addClass('w-12 h-12  mr-3').attr('src', e.target.result);
			}

			reader.readAsDataURL(fileInput.prop('files')[0]);
		}
	}

	const validateFile = (fileInput, image) => {

		const files = fileInput.prop('files');

		if(files.length == 0) {
			return false;
		}

		if(!allowedExtensions.includes(files[0].type.toLowerCase())) {
			fileInput.val('');
			image.addClass('w-0 h-6').removeClass('w-12 h-12  mr-3');
			return false;
		}

		if(files[0].size > 6000000) {
			fileInput.val('');
			image.addClass('w-0 h-6').removeClass('w-12 h-12  mr-3');
			return false;
		}

		return true;
	}


	// add milestone validation logic

	const addForm = addMilestoneContainer.find('form');

	const validateForm = (form, edit=false) => {

		$('.textarea__notif').remove();
		$('.image__notif').remove();
		let error = false;
		const textarea = form.find('textarea');
		const fileInput = form.find('.milestone__file__input');
		const fileTrigger = form.find('.milestone__trigger');

		if(textarea.val().length < 20) {
			textarea.after("<p class='textarea__notif text-gray-600 text-xs m-0 my-1 baloo-bhaina' style='color:#EA3C53;'>Must be at least 20 characters in length</p>");
			error = true;
		}

		if(!edit) {

			if(!validateFile(fileInput)) {
				fileTrigger.after("<p class='image__notif text-gray-600 text-xs my-1 baloo-bhaina' style='color:#EA3C53;'>Image is required</p>");
				error = true;
			}
		}
		
		if(!error) {
			return true;
		}

		return false;
	}

	addForm.submit(function(e) {

		if(!validateForm($(this))) {
			e.preventDefault();
		}

	})

	// edit milestone logic

	const editBtn = $('.edit');
	const editMilestoneContainer = $('.edit__milestone__container');	
	const editClose = editMilestoneContainer.find('.close');	
	const editForm = editMilestoneContainer.find('form');
	const editTrigger = editMilestoneContainer.find('.milestone__trigger')
	const editMilestoneFileInput = editMilestoneContainer.find('.milestone__file__input');
	const editMilestonePreview= editMilestoneContainer.find('.milestone__preview');

	const setMilestoneDetails = element => {

		const milestone = element.parent().parent();
		const milestoneId = milestone.find('.milestone__id').text();
		const csrfToken = $('.csrf__token').text();
		const action = 	`/edit/milestone/${milestoneId}?_csrf=${csrfToken}`;
		let description;
		screen.width <= 576 ?  description = milestone.find('.milestone__description__sm').text().trim() : description = milestone.find('.milestone__description').text().trim() 
		const imageUrl =  milestone.find('.milestone__image').attr('src');

		editMilestoneContainer.find('textarea').val(description);
		editMilestoneContainer.find('img').attr('src', imageUrl);
		editMilestoneContainer.find('form').attr('action', action);
	}

	editBtn.click(function() {

		setMilestoneDetails($(this));

		if(editMilestoneContainer.hasClass('z--9999')) {
			body.addClass('overflow-y-hidden');
			editMilestoneContainer.removeClass('z--9999 opacity-0').addClass('z-50 opacity-100');
			return;
		}

		editMilestoneContainer.removeClass('z-50 opacity-100').addClass('z--9999 opacity-0');
	})

	editClose.click(function() {

		editMilestoneContainer.removeClass('z-50 opacity-100').addClass('z--9999 opacity-0');
		body.removeClass('overflow-y-hidden');
	})

	editTrigger.click(function() {

		editMilestoneFileInput.click();
	})

	editMilestoneFileInput.change(() => {

		previewImage(editMilestoneFileInput, editMilestonePreview);
	})

	editForm.submit(function(e) {

		if(!validateForm($(this), true)) {
			e.preventDefault();
		}
	})


	// confirm delete activity

	const deleteActivity= $('.delete__activity');

	deleteActivity.submit(function(e) {
		
		const proceed = confirm('Are you sure you want to delete ?');

		if(!proceed) {
			e.preventDefault();
		}
	})


	// confirm delete milestone

	const deleteMilestoneForm = $('.delete__milestone__form');

	deleteMilestoneForm.submit(function(e) {

		const proceed = confirm('Are you sure you want to delete ?');

		if(!proceed) {
			e.preventDefault();
		}
	})

})