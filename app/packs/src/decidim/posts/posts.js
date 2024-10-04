import { initSurvey } from './survey.js';
import carousel from './carousel.js';
import { host_status } from './host_status.js';
import { closeDialog, activateCategory, hideAllForms } from './newFeeds.js';
import Submenu from './reactions.js';

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

	document
		.querySelectorAll('.feeds__feed_reactions_submenu > button')
		.forEach((button) => {
			const submenuId = button.getAttribute('aria-controls');
			const submenu = document.getElementById(submenuId);
			if (submenu) {
				new Submenu(button, submenu);
			}
		});

	// comments

	// Select all comments__header h2 elements
	const commentsHeaders = document.querySelectorAll('.comments__header h2');
	commentsHeaders.forEach((commentsHeader) => {
		const parentContainer = commentsHeader.closest('[data-decidim-comments]');
		const parentId = parentContainer.getAttribute('id');
		commentsHeader.setAttribute('aria-controls', `${parentId}-threads`);
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
