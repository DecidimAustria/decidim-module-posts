class Submenu {
	constructor(button, submenu) {
		this.button = button;
		this.submenu = submenu;
		this.init();
	}

	init() {
		this.button.addEventListener('click', () => this.toggleSubmenu());
		document.addEventListener('click', (event) =>
			this.handleClickOutside(event)
		);
		this.submenu.addEventListener('keydown', (event) =>
			this.handleKeydown(event)
		);
	}

	toggleSubmenu() {
		const isExpanded = this.button.getAttribute('aria-expanded') === 'true';
		this.button.setAttribute('aria-expanded', !isExpanded);
		this.submenu.classList.toggle('hidden', isExpanded);
	}

	handleClickOutside(event) {
		if (
			!this.button.contains(event.target) &&
			!this.submenu.contains(event.target)
		) {
			this.closeSubmenu();
		}
	}

	handleKeydown(event) {
		if (event.key === 'Escape') {
			this.closeSubmenu();
			this.button.focus();
		}
	}

	closeSubmenu() {
		this.button.setAttribute('aria-expanded', 'false');
		this.submenu.classList.add('hidden');
	}
}

export default Submenu;
