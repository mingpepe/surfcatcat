var rate = 1;
var callbacks = [];
var wholeTextContent = '';

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

function registerRateUpdateEvent(f) {
    callbacks.push(f);
}

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

function extractTextWithoutRt(element) {
    let text = '';
    element.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            text += child.textContent;
        } else if (
            child.nodeType === Node.ELEMENT_NODE &&
            child.tagName.toLowerCase() !== 'rt'
        ) {
            text += extractTextWithoutRt(child);
        }
    });
    return text;
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

document.addEventListener('DOMContentLoaded', function () {
    const a = document.getElementById('js-article-body');
    var paragraphs = a.querySelectorAll('p');
    paragraphs.forEach((p) => {
        // Do not include the last <p>
        if (p.parentElement.style.background == 'rgb(245, 245, 220)') {
            return;
        }

        const content = extractTextWithoutRt(p);
        const btn = document.createElement('button');
        btn.textContent = 'Read';
        btn.addEventListener('click', function () {
            var utterance = new SpeechSynthesisUtterance(content);
            utterance.lang = 'ja-JP';
            utterance.rate = rate;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        });
        p.parentElement.insertBefore(btn, p);

        const label = document.createElement('p');
        label.textContent = `rate: ${rate}`;
        registerRateUpdateEvent((rate) => {
            label.textContent = `rate: ${rate.toFixed(1)}`;
        });
        p.parentElement.insertBefore(label, p);

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', function () {
            copyToClipboard(content);
        });
        p.parentElement.insertBefore(copyBtn, p);

        wholeTextContent += content;
    });
});
