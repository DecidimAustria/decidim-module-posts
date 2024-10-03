import { initSurvey } from './survey.js';
import carousel from './carousel.js';
import { host_status } from './host_status.js';

document.addEventListener('DOMContentLoaded', function () {
	const spinner = "<span class='loading-spinner'></span>";

	// Implement infinite scroll
	const observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting) {
			loadMore(entries[0].target);
		}
	});

	function loadMoreButtonClicked(event) {
		event.preventDefault();

		loadMore(event.target);
	}

	function loadMore(button) {
		// remove event listener to prevent multiple clicks
		button.removeEventListener('click', loadMoreButtonClicked);
		const oldBtn = button.innerHTML;
		button.innerHTML = spinner;

		// get url from data-url attribute
		const url = button.getAttribute('data-url');

		// get html from url and add page as query parameter
		fetch(url)
			.then((response) => {
				if (!response.ok) {
					// enable the button again
					button.addEventListener('click', loadMoreButtonClicked);
					// reset the button text
					button.innerHTML = oldBtn;
					throw new Error('Network response was not ok');
				}
				return response.text();
			})
			.then((html) => {
				// replace the button with the new html
				button.outerHTML = html;
				// add event listener to new button
				const newButton = document.getElementById('loadMoreBtn');
				if (newButton) {
					newButton.addEventListener('click', loadMoreButtonClicked);
					observer.observe(newButton);
				}
			})
			.catch((error) => {
				// enable the button again
				button.addEventListener('click', loadMoreButtonClicked);
				// reset the button text
				button.innerHTML = oldBtn;
				console.error('Error:', error);
			});
	}

	const loadMoreBtn = document.getElementById('loadMoreBtn');
	if (loadMoreBtn) {
		loadMoreBtn.addEventListener('click', loadMoreButtonClicked);
		observer.observe(loadMoreBtn);
	}

	const newFeed = document.getElementById('feeds__feed_newElement');
	const newFeedOpener = document.querySelectorAll(
		'.feeds__feed_newElement-opener'
	);
	const newFeedCloser = newFeed.querySelector('.feeds__feed_newElement-closer');
	let lastFocusedButton = null;
	newFeedOpener.forEach(function (opener) {
		opener.addEventListener('click', function () {
			let isExpanded = opener.getAttribute('aria-expanded') === 'true';
			opener.setAttribute('aria-expanded', !isExpanded);
			activateCategory(categoryButtons[0]);
			newFeed.classList.toggle('open');
			lastFocusedButton = this;
			document.getElementById('post_body').focus();
			document.body.style.overflow = 'hidden';
		});
	});

	function closeDialog() {
		// newFeed.close();
		newFeedOpener.forEach(function (opener) {
			opener.setAttribute('aria-expanded', 'false');
			newFeed.classList.remove('open');
			lastFocusedButton.focus();
			document.body.style.overflow = 'auto';
		});
	}

	// Close the dialog when clicking outside the content
	newFeed.addEventListener('click', function (event) {
		if (event.target === newFeed) {
			closeDialog();
		}
	});

	newFeedCloser.addEventListener('click', closeDialog);

	// Close the dialog when pressing ESC
	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape') {
			closeDialog();
		}
	});

	const categoryButtons = document.querySelectorAll(
		'.category-selection button'
	);
	const meetingForm = document.querySelector('.meetings_form');
	const postForm = document.querySelector('.posts_form');
	const surveyDiv = document.getElementById('extraFieldsForSurvey');
	const newFeedLiveRegion = document.getElementById(
		'feeds__feed_newElement_Form-LiveRegion'
	);

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

	function activateCategory(button) {
		hideAllForms(); // Clear active states before setting the new one
		button.classList.add('active'); // Mark the clicked button as active
		button.setAttribute('aria-pressed', 'true');
		const category = button.getAttribute('data-category');
		newFeedLiveRegion.innerHTML =
			window.translations.newFeedLiveRegion[category];

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

	categoryButtons.forEach((button) => {
		button.addEventListener('click', function () {
			activateCategory(this);
		});
	});

	document
		.querySelectorAll('.feeds__feed_actions_submenu > button')
		.forEach(function (button) {
			button.addEventListener('click', function () {
				var submenuId = this.getAttribute('aria-controls');
				var submenu = document.getElementById(submenuId);
				var isHidden = submenu.classList.contains('hidden');
				submenu.classList.toggle('hidden', !isHidden);
				this.setAttribute('aria-expanded', !isHidden);
			});
		});

	// comments

	// Select all comments__header h2 elements
	const commentsHeaders = document.querySelectorAll('.comments__header h2');
	// Loop over all h2 elements
	commentsHeaders.forEach((commentsHeader) => {
		// Find the parent container with "data-decidim-comments"
		const parentContainer = commentsHeader.closest('[data-decidim-comments]');
		// Get the ID of the parent container
		const parentId = parentContainer.getAttribute('id');
		// Set the aria-controls attribute to the h2 element
		commentsHeader.setAttribute('aria-controls', `${parentId}-threads`);
		// Set the aria-expanded attribute to false initially
		commentsHeader.setAttribute('aria-expanded', 'false');
	});

	const newCommentBtns = document.querySelectorAll('.newCommentBtn');
	const showCommentsBtns = document.querySelectorAll('.comments__header h2');

	newCommentBtns.forEach((newCommentBtn) => {
		newCommentBtn.addEventListener('click', function () {
			const postId = newCommentBtn.getAttribute('data-post-id');
			const modelType = newCommentBtn.getAttribute('data-model-type');
			const showCommentBtnId = `comments-for-${modelType}-${postId}`;
			const controlledDivId = `new_comment_for_${modelType}_${postId}`;
			const commentsDivId = `comments-for-${modelType}-${postId}-threads`;
			const showCommentBtn = document.getElementById(showCommentBtnId);

			const wasExpanded =
				newCommentBtn.getAttribute('aria-expanded') === 'true';
			const showCommentsWasExpanded =
				showCommentBtn.getAttribute('aria-expanded') === 'true';
			const controlledDivIds = newCommentBtn
				.getAttribute('aria-controls')
				.split(' ');

			const controlledDiv = document.getElementById(controlledDivId);
			newCommentBtn.setAttribute('aria-expanded', !wasExpanded);
			showCommentBtn.setAttribute('aria-expanded', !showCommentsWasExpanded);

			toggleCommentsVisibility(controlledDivId);

			if (!wasExpanded) {
				showDiv(commentsDivId);
				controlledDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
			} else {
				hideDiv(commentsDivId);
			}
		});
	});

	showCommentsBtns.forEach((showCommentsBtn) => {
		showCommentsBtn.addEventListener('click', function () {
			const controlledDivIds = showCommentsBtn
				.getAttribute('aria-controls')
				.split(' ');
			controlledDivIds.forEach((controlledDivId) => {
				const isExpanded =
					showCommentsBtn.getAttribute('aria-expanded') === 'true';
				showCommentsBtn.setAttribute('aria-expanded', !isExpanded);
				toggleCommentsVisibility(controlledDivId);
			});
		});
	});

	function toggleCommentsVisibility(controlledDivId) {
		const controlledDiv = document.getElementById(controlledDivId);

		if (controlledDiv.style.visibility === 'visible') {
			hideDiv(controlledDivId);
		} else {
			showDiv(controlledDivId);
		}
	}

	function showDiv(id) {
		const div = document.getElementById(id);
		div.style.height = 'auto';
		div.style.visibility = 'visible';
		div.style.marginTop = '8px';
	}

	function hideDiv(id) {
		const div = document.getElementById(id);
		div.style.height = '0';
		div.style.visibility = 'hidden';
		div.style.marginTop = '0';
	}

	initSurvey();
	carousel.init();
	host_status();
});
