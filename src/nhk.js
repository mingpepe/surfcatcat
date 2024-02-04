function clickToggleButton() {
    const button = document.querySelector('.tool-buttons__item.btn.toggle-ruby.js-toggle-ruby.hide-sp');
    if (button) {
        button.click();
    }
    else {
        console.log('button not found');
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'c' && !event.ctrlKey) {
        clickToggleButton();
    }
});
