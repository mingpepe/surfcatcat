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

document.addEventListener('DOMContentLoaded', function() {
    const a = document.getElementById('js-article-body');
    console.log(a);
    var paragraphs = a.querySelectorAll('p');
    console.log(paragraphs);
    paragraphs.forEach((p) => {
        const btn = document.createElement('button');
        btn.textContent = 'Read';
        btn.addEventListener('click', function() {
            var textToSpeak = p.textContent.trim();
            var utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'ja-JP';
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        });
        p.parentElement.insertBefore(btn, p);
    });    
});
