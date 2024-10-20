import { initSurvey } from './survey.js';
import carousel from './carousel.js';
import { host_status } from './host_status.js';
import { closeDialog, activateCategory, hideAllForms } from './newFeeds.js';
import Submenu from './submenu.js';
import CommentsComponent from "src/decidim/comments/comments.component"

document.addEventListener('DOMContentLoaded', function () {
	function addEventListeners(rootElement) {
		rootElement.querySelectorAll("[data-decidim-posts-comments]").forEach((el) => {
			const $el = $(el);
			let comments = $(el).data("comments");
			if (!comments) {
				comments = new CommentsComponent($el, $el.data("decidim-posts-comments"));
			}
			comments.mountComponent();
			$(el).data("comments", comments);
		});

		const loadMoreBtn = rootElement.querySelector('#loadMoreBtn');
		if (loadMoreBtn) {
			loadMoreBtn.addEventListener('click', loadMoreButtonClicked);
			observer.observe(loadMoreBtn);
		}

		rootElement
			.querySelectorAll('.posts__post_actions_submenu > button')
			.forEach((button) => {
				const submenuId = button.getAttribute('aria-controls');
				const submenu = rootElement.querySelector(`#${submenuId}`);
				if (submenu) {
					new Submenu(button, submenu);
				}
			});

		rootElement
			.querySelectorAll('.posts__post_reactions_submenu > button')
			.forEach((button) => {
				const submenuId = button.getAttribute('aria-controls');
				const submenu = rootElement.querySelector(`#${submenuId}`);
				if (submenu) {
					new Submenu(button, submenu);
				}
			});

		rootElement.querySelectorAll('.reaction_btn').forEach((button) => {
			const reactionTypeId = button.getAttribute('data-reaction-id');
			const reactionableGlobalId = button.getAttribute('data-reactionable-id');
			const url = button.getAttribute('data-reaction-url');
			if (reactionTypeId && url) {
				button.addEventListener('click', function (event) {
					let reaction = button.getAttribute('data-reaction');
					event.preventDefault();
					fetch(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')
								.content,
							Accept: 'text/html',
						},
						body: JSON.stringify({
							reaction_type_id: reactionTypeId,
							resource_id: reactionableGlobalId,
						}),
					})
						.then((response) => {
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.text();
						})
						.then((response) => {
							var resourceId = reactionableGlobalId.split('/').pop();
							var reactionsBlock = document.getElementById(
								`feeds_post-${resourceId}_reactions`
							);
							var submenuId = `post_${resourceId}_posts__post_reactions_submenu`;
							var submenu = document.querySelector(`#${submenuId}`);
							var submenuButtonId = `post_${resourceId}_posts__post_reactions_submenuButton`;
							var submenuButton = document.querySelector(
								`#${submenuButtonId}`
							);
							if (submenuButton.getAttribute('data-reaction') === reaction) {
								reaction = '';
							}
							submenuButton.setAttribute('data-reaction', reaction);
							// replace the reactions block with the new one
							reactionsBlock.innerHTML = response;
							submenuButton.setAttribute('aria-expanded', false);
							submenu.classList.toggle('hidden', true);
						})
						.catch((error) => {
							console.error(
								'There was a problem while updating the reactions:',
								error
							);
						});
				});
			}
		});

		// Select all comments__header h2 elements
		const commentsHeaders = rootElement.querySelectorAll(
			'.comments__header h2'
		);
		commentsHeaders.forEach((commentsHeader) => {
			const parentContainer = commentsHeader.closest('[data-decidim-posts-comments]');
			const parentId = parentContainer.getAttribute('id');
			commentsHeader.setAttribute('aria-controls', `${parentId}-threads`);
			commentsHeader.setAttribute('aria-expanded', 'false');
		});

		const newCommentBtns = rootElement.querySelectorAll('.newCommentBtn');
		const showCommentsBtns = rootElement.querySelectorAll(
			'.comments__header h2'
		);

		newCommentBtns.forEach((newCommentBtn) => {
			addActionToNewCommentBtn(newCommentBtn);
		});

		showCommentsBtns.forEach((showCommentsBtn) => {
			addActionToShowCommentsBtn(showCommentsBtn);
		});
	}

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
				// activate all buttons in the new html
				const tempContainer = document.createElement('div');
				tempContainer.innerHTML = html;
				const fragment = document.createDocumentFragment();
				addEventListeners(tempContainer);
				Array.from(tempContainer.children).forEach((element) => {
					fragment.appendChild(element);
				});

				// replace the button with the new html
				button.parentNode.replaceChild(fragment, button);
				// alternative:
				// button.parentNode.insertAfter(fragment, button);
				// button.remove();

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

	// add event listeners to all the buttons found in the document
	addEventListeners(document);

	function addActionToNewCommentBtn(newCommentBtn) {
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
	}

	function addActionToShowCommentsBtn(showCommentsBtn) {
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
	}

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
