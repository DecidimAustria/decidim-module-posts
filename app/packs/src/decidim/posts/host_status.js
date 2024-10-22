export function host_status() {
	const changeStatusButtons = document.querySelectorAll('.changeStatusButton');

	changeStatusButtons.forEach(function (button) {
		button.addEventListener('click', handleStatusChange);
	});

	const cancelButton = document.getElementById(
		'confirmationModal__cancelButton'
	);
	cancelButton.addEventListener('click', function () {
		const confirmationModal = document.getElementById('confirmationModal');
		confirmationModal.close();
	});

	function handleStatusChange(event) {
		const button = event.currentTarget;
		const postId = button.dataset.postId;
		const newStatus = button.dataset.postStatus;
		const confirmationModalMsg = button.dataset.dialogmsg;

		const confirmationModal = document.getElementById('confirmationModal');
		const confirmButton = document.getElementById(
			'confirmationModal__confirmButton'
		);
		const confirmButtons = confirmationModal.querySelector(
			'.confirmationModal__buttons'
		);
		const confirmationModalResponse = confirmationModal.querySelector(
			'.confirmationModal__response'
		);

		confirmationModalResponse.innerHTML = confirmationModalMsg;
		confirmationModal.showModal();

		const confirmClickHandler = function () {
			confirmButtons.style.display = 'none';
			confirmationModalResponse.innerHTML =
				window.translations.dialog.dialogBodyResponse;
			const params = new URLSearchParams({
				id: postId,
				status: newStatus,
			});
			Rails.ajax({
				url: 'change_status/?' + params.toString(),
				type: 'GET',
				success: function (response) {
					confirmationModal.close();
					confirmButtons.style.display = 'flex';
					confirmationModalResponse.innerText =
						window.translations.dialog.dialogBodyMsg;

					const postElement = document.getElementById(`feeds_post-${postId}`);
					postElement.innerHTML = 'updating status...';
					postElement.innerHTML = response.new_content;

					const updatedButtons = postElement.querySelectorAll(
						'.changeStatusButton'
					);
					updatedButtons.forEach(function (updatedButton) {
						updatedButton.addEventListener('click', handleStatusChange);
					});
				},
				error: function (error) {
					console.error('Error changing status:', error);
				},
			});

			confirmButton.removeEventListener('click', confirmClickHandler);
		};

		confirmButton.removeEventListener('click', confirmClickHandler);
		confirmButton.addEventListener('click', confirmClickHandler);
	}
}
