
$(document).ready(() => {

	var toggle = $('.toggle');
	const milestone_parent = $('.create-milestone-parent');
	const project_parent = $('.create-project-parent');

	toggle.click(function() {
		const $this = $(this);

		if($this.hasClass('project')) {
			milestone_parent.removeClass('block').addClass('hidden');
			project_parent.removeClass('hidden').addClass('block');
		}
		else {
			project_parent.removeClass('block').addClass('hidden');
			milestone_parent.removeClass('hidden').addClass('block');
		}
	})
})