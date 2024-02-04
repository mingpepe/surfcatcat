function clickToggleButton() {
    const button = document.querySelector(
        '.tool-buttons__item.btn.toggle-ruby.js-toggle-ruby.hide-sp',
    );
    if (button) {
        button.click();
    } else {
        console.log('button not found');
    }
}

var rate = 1;

function readRateControl(key) {
    switch (key) {
        case 'q':
            rate = Math.max(0.1, rate - 0.1);
            break;
        case 'w':
            rate = Math.min(1, rate + 0.1);
            break;
        case 'o':
            rate = Math.max(0.1, rate - 0.5);
            break;
        case 'p':
            rate = Math.min(1, rate + 0.5);
            break;
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'c':
            if (!event.ctrlKey) {
                clickToggleButton();
            }
            break;
        case 'q':
        case 'w':
        case 'o':
        case 'p':
            readRateControl(event.key);
            break;
        default:
            break;
    }
    if (event.key === 'c' && !event.ctrlKey) {
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const a = document.getElementById('js-article-body');
    console.log(a);
    var paragraphs = a.querySelectorAll('p');
    console.log(paragraphs);
    paragraphs.forEach((p) => {
        const btn = document.createElement('button');
        btn.textContent = 'Read';
        btn.addEventListener('click', function () {
            var textToSpeak = p.textContent.trim();
            var utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'ja-JP';
            utterance.rate = rate;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        });
        p.parentElement.insertBefore(btn, p);
    });
});
