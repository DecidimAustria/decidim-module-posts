const newFeed = document.getElementById('posts__post_newElement');
const newFeedOpener = document.querySelectorAll(
	'.posts__post_newElement-opener'
);
const newFeedCloser = newFeed.querySelector('.posts__post_newElement-closer');
let lastFocusedButton = null;

newFeedOpener.forEach(function (opener) {
	opener.addEventListener('click', function () {
		let isExpanded = opener.getAttribute('aria-expanded') === 'true';
		opener.setAttribute('aria-expanded', !isExpanded);
		const activeFilter = newFeed.getAttribute('data-active-filter');
		const buttonToActivate = activeFilter
			? Array.from(categoryButtons).find(
					(button) => button.getAttribute('data-category') === activeFilter
			  )
			: categoryButtons[0];
		activateCategory(buttonToActivate || categoryButtons[0]);
		newFeed.classList.toggle('open');
		lastFocusedButton = this;
		document.getElementById('post_body').focus();
		document.body.style.overflow = 'hidden';
	});
});

newFeed.addEventListener('click', function (event) {
	if (event.target === newFeed) {
		closeDialog();
	}
});

newFeedCloser.addEventListener('click', closeDialog);

document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape') {
		closeDialog();
	}
});

const categoryButtons = document.querySelectorAll('.category-selection button');
const meetingForm = document.querySelector('.meetings_form');
const postForm = document.querySelector('.posts_form');
const surveyDiv = document.getElementById('extraFieldsForSurvey');
const newFeedLiveRegion = document.getElementById(
	'posts__post_newElement_Form-LiveRegion'
);

categoryButtons.forEach((button) => {
	button.addEventListener('click', function () {
		activateCategory(this);
	});
});

function hideAllForms() {
	meetingForm.classList.remove('open');
	postForm.classList.remove('open');
	surveyDiv.classList.remove('open');
	newFeedLiveRegion.innerHTML = '';
	categoryButtons.forEach(function (button) {
		button.classList.remove('active');
		button.setAttribute('aria-pressed', 'false');
	});
}

function closeDialog() {
	newFeedOpener.forEach(function (opener) {
		opener.setAttribute('aria-expanded', 'false');
		newFeed.classList.remove('open');
		lastFocusedButton.focus();
		document.body.style.overflow = 'auto';
	});
}

function activateCategory(button) {
	hideAllForms();
	button.classList.add('active');
	button.setAttribute('aria-pressed', 'true');
	const category = button.getAttribute('data-category');
	newFeedLiveRegion.innerHTML = window.translations.newFeedLiveRegion[category];

	const postBody = document.getElementById('post_body');
	const meetingTitle = document.getElementById('meeting_title');
	if (category === 'calendar') {
		meetingForm.classList.add('open');
		meetingForm.querySelector('.form-error').classList.remove('is-visible');
		meetingTitle.classList.remove('is-invalid-input');
		document.getElementById('meeting_title').focus();
	} else {
		postForm.classList.add('open');
		postForm.querySelector('.form-error').classList.remove('is-visible');
		postBody.classList.remove('is-invalid-input');
		postBody.focus();
		document.getElementById('post_category').value = category;
		if (category === 'survey') surveyDiv.classList.add('open');
	}
}

export { closeDialog, activateCategory, hideAllForms };
