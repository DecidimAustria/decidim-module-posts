export function initSurvey() {
	// Add event listener to the new survey button
	const liveRegion = document.getElementById(
		'posts__post_newSurvey_liveRegion'
	);
	const newSurveyButton = document.querySelector('.posts__post_newSurvey-btn');
	if (newSurveyButton)
		newSurveyButton.addEventListener('click', () => {
			const questionContainer = document.getElementById(
				'posts__post_newSurvey_questionsContainer'
			);

			// copy content from question_template to questionContainer
			const template = document.getElementById('question_template');
			var content = template.innerHTML.replace(
				/NEW_RECORD/g,
				new Date().getTime()
			);
			questionContainer.insertAdjacentHTML('beforeend', content);
			liveRegion.textContent =
				window.translations.newSurvey.newQuestionResponse;
		});

	// TODO: this does not work as the button does not exist yet and there will be multiple buttons
	document.addEventListener('click', (event) => {
		if (event.target.classList.contains('posts__post_newAnswer-btn')) {
			const questionId = event.target.dataset.questionId;
			// get div with class posts__post_newSurvey_answersContainer inside the same container as the clicked button
			const answerContainer = document.getElementById(
				`posts__post_newSurvey_answersContainer-${questionId}`
			);

			const questionAnswers = answerContainer.children.length + 1;
			// answerContainer.dataset.questionAnswers = questionAnswers;

			// copy content from question_template to questionContainer
			const template = document.getElementById('answer_template');
			var content = template.innerHTML.replace(
				/NEW_RECORD/g,
				new Date().getTime()
			);
			content = content.replace(/QUESTION_RECORD/g, questionId);
			content = content.replace(/ANSWER_NR/g, questionAnswers);

			answerContainer.insertAdjacentHTML('beforeend', content);
			liveRegion.textContent = window.translations.newSurvey.newAnswerResponse;
		}
	});

	document.querySelectorAll('.survey-answer-checkbox').forEach((checkbox) => {
		checkbox.addEventListener('change', (event) => {
			const questionId = event.target.dataset.questionId;
			const answerId = event.target.dataset.answerId;
			const checked = event.target.checked;
			console.log(questionId, answerId, checked);
			Rails.ajax({
				url: 'user_answers/',
				type: 'GET',
				data: new URLSearchParams({
					question_id: questionId,
					answer_id: answerId,
					checked: checked,
				}),
				success: function (response) {
					console.log(response);
					for (const [answerId, counter] of Object.entries(
						response.user_answers
					)) {
						// for each user_answer, change the width of the progress bar
						const progressBar = document.getElementById(
							`answer-${answerId}-progressbar`
						);
						const percentage =
							response.survey_responses_count > 0
								? (counter / response.survey_responses_count) * 100
								: 0;
						progressBar.style.width = `${percentage}%`;
						const counterSpan = document.getElementById(
							`answer-${answerId}-counter`
						);
						counterSpan.textContent = counter;
						const totalSpan = document.getElementById(
							`answer-${answerId}-total`
						);
						totalSpan.textContent = `${response.survey_responses_count}`;
					}
				},
				error: function (xhr, status, error) {
					console.log(xhr, status, error);
				},
			});
		});
	});
}
