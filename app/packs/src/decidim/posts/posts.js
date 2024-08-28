import { initSurvey } from './survey.js';
import carousel from './carousel.js';
import { hv_status } from './hv_status.js';

document.addEventListener('DOMContentLoaded', function () {
	console.log('js loaded');

	const newFeed = document.getElementById('feeds__feed_newElement');
	const newFeedOpener = document.querySelectorAll(
		'.feeds__feed_newElement-opener'
	);

	newFeedOpener.forEach(function (opener) {
		opener.addEventListener('click', function () {
			// Scroll to the top if not already at the top and the feed is not already open
			if (window.scrollY > 0) {
				window.scrollTo({
					top: 0,
				});
			}
			let isExpanded = opener.getAttribute('aria-expanded') === 'true';
			opener.setAttribute('aria-expanded', !isExpanded);
			newFeed.classList.toggle('open');
			if (!isExpanded) {
				newFeed.showModal(); // Open newFeed as a dialog
			} else {
				newFeed.close(); // Close the dialog if it's already open
			}
		});
	});

	function closeDialog() {
		newFeed.close();
		newFeedOpener.forEach(function (opener) {
			opener.setAttribute('aria-expanded', 'false');
			newFeed.classList.remove('open');
		});
	}

	document
		.querySelectorAll('#feeds__feed_newElement .close-button button')
		.forEach(function (closeBtn) {
			closeBtn.addEventListener('click', function () {
				closeDialog();
			});
		});

	const categoryButtons = document.querySelectorAll(
		'.category-selection button'
	);
	const meetingForm = document.querySelector('.meetings_form');
	const postForm = document.querySelector('.posts_form');
	const surveyDiv = document.getElementById('extraFieldsForSurvey');

	function hideAllForms() {
		meetingForm.classList.remove('open');
		postForm.classList.remove('open');
		surveyDiv.classList.remove('open');
		categoryButtons.forEach((button) => button.classList.remove('active'));
	}

	function activateCategory(button) {
		hideAllForms(); // Clear active states before setting the new one
		button.classList.add('active'); // Mark the clicked button as active

		const category = button.getAttribute('data-category');

		if (category === 'calendar') {
			meetingForm.classList.add('open');
		} else if (category === 'survey') {
			postForm.classList.add('open');
			surveyDiv.classList.add('open');
			document.getElementById('post_category').value = category;
		} else {
			postForm.classList.add('open');
			document.getElementById('post_category').value = category;
		}
	}

	categoryButtons.forEach((button) => {
		button.addEventListener('click', function () {
			activateCategory(this);
		});
	});

	activateCategory(categoryButtons[0]);

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
			const showCommentBtnId = `comments-for-Post-${postId}`;
			const modelType = newCommentBtn.getAttribute('data-model-type');
			const controlledDivId = `new_comment_for_${modelType}_${postId}`;
			const commentsDivId = `comments-for-Post-${postId}-threads`;
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
	hv_status();
});