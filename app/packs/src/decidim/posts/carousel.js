const carousel = (() => {
	let startX;

	const setActiveItem = (galleryId, index, direction = null) => {
		const galleryItems = document.querySelectorAll(`#${galleryId} li`);
		const navDots = document.querySelectorAll(
			`.feeds__feed_gallery_nav_dot[data-target="${galleryId}"]`
		);
		let activeIndex = index;

		if (direction) {
			const currentIndex = Array.from(galleryItems).findIndex((item) =>
				item.classList.contains('active')
			);
			console.log(currentIndex);

			if (direction === 'left' && currentIndex < galleryItems.length - 1) {
				activeIndex = currentIndex + 1;
			} else if (direction === 'right' && currentIndex > 0) {
				activeIndex = currentIndex - 1;
			}
		}

		galleryItems.forEach((item, idx) => {
			if (idx === activeIndex) {
				item.classList.add('active');
			} else {
				item.classList.remove('active');
			}
		});

		navDots.forEach((dot, idx) => {
			const innerSpan = dot.querySelector('span');
			if (innerSpan) {
				innerSpan.classList.toggle('shadow-navDotInset', idx === activeIndex);
				innerSpan.classList.toggle('shadow-navDot', idx !== activeIndex);
			}
		});
	};

	const attachSwipeListeners = (galleryId) => {
		const gallery = document.getElementById(galleryId);

		gallery.addEventListener('touchstart', (e) => {
			startX = e.touches[0].clientX;
		});

		gallery.addEventListener('touchend', (e) => {
			const endX = e.changedTouches[0].clientX;
			const galleryItems = document.querySelectorAll(`#${galleryId} li`);
			const currentIndex = Array.from(galleryItems).findIndex((item) =>
				item.classList.contains('active')
			);

			if (startX - endX > 50 && currentIndex < galleryItems.length - 1) {
				setActiveItem(galleryId, null, 'left');
			} else if (startX - endX < -50 && currentIndex > 0) {
				setActiveItem(galleryId, null, 'right');
			}
		});
	};

	const attachEventListenersToDots = () => {
		document.querySelectorAll('.feeds__feed_gallery_nav_dot').forEach((dot) => {
			dot.addEventListener('click', function () {
				const targetGalleryId = this.getAttribute('data-target');
				const targetIndex = parseInt(this.getAttribute('data-index'), 10);
				setActiveItem(targetGalleryId, targetIndex);
			});
		});
	};

	const init = () => {
		attachEventListenersToDots();
		// Initialize swipe listeners for each gallery
		document.querySelectorAll('.feeds__feed_gallery').forEach((gallery) => {
			attachSwipeListeners(gallery.id);
		});
	};

	return { init };
})();

export default carousel;
