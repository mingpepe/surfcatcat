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
var callbacks = [];
var wholeTextContent = '';

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
    for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](rate);
    }
}

function copyToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
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
        case 's':
            copyToClipboard(wholeTextContent);
            break;
        default:
            break;
    }
});

function registerRateEvent(f) {
    callbacks.push(f);
}

document.addEventListener('DOMContentLoaded', function () {
    clickToggleButton();
    const a = document.getElementById('js-article-body');
    var paragraphs = a.querySelectorAll('p');
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

        const label = document.createElement('p');
        label.textContent = `rate: ${rate}`;
        registerRateEvent((rate) => {
            label.textContent = `rate: ${rate.toFixed(1)}`;
        });

        p.parentElement.insertBefore(btn, p);
        p.parentElement.insertBefore(label, p);

        wholeTextContent += p.textContent;
    });
    clickToggleButton();
});
