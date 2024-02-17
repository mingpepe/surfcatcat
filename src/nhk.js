class RateWrapper {
    constructor() {
        this._rate = 1;
        this._listeners = [];
    }

    init() {
        let self = this;
        chrome.runtime.sendMessage('GET_NHK_SPEECH_RATE', function (response) {
            if (response.data && typeof response.data === 'number') {
                self._rate = response.data;
                console.log(`Get speech rate: ${response.data}`);
                self._notifyListeners();
            } else {
                console.log('Get incorrect speech rate');
            }
        });
    }

    addListener(listener) {
        this._listeners.push(listener);
    }

    get rate() {
        return this._rate;
    }

    set rate(rate) {
        chrome.runtime.sendMessage({
            key: 'SET_NHK_SPEECH_RATE',
            value: rate,
        });
        this._rate = rate;
        this._notifyListeners();
    }

    _notifyListeners() {
        this._listeners.forEach((listener) => {
            listener(this._rate);
        });
    }
}

const wrapper = new RateWrapper();
wrapper.init();

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

function readRateControl(key) {
    switch (key) {
        case 'q':
            wrapper.rate = Math.max(0.1, wrapper.rate - 0.1);
            break;
        case 'w':
            wrapper.rate = Math.min(1, wrapper.rate + 0.1);
            break;
        case 'o':
            wrapper.rate = Math.max(0.1, wrapper.rate - 0.5);
            break;
        case 'p':
            wrapper.rate = Math.min(1, wrapper.rate + 0.5);
            break;
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
        case 'x':
            window.speechSynthesis.cancel();
        default:
            break;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const a = document.getElementById('js-article-body');
    if (!a) {
        console.log('js-article-body not found');
        return;
    }
    var paragraphs = a.querySelectorAll('p');
    paragraphs.forEach((p) => {
        // Do not include the last <p>
        if (p.parentElement.style.background == 'rgb(245, 245, 220)') {
            return;
        }

        const content = extractTextWithoutRt(p);
        const readBtn = document.createElement('button');
        readBtn.textContent = 'Read';
        readBtn.addEventListener('click', function () {
            var utterance = new SpeechSynthesisUtterance(content);
            utterance.lang = 'ja-JP';
            utterance.rate = wrapper.rate;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        });
        readBtn.style.width = '70px';
        readBtn.style.height = '30px';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', function () {
            copyToClipboard(content);
        });
        copyBtn.style.width = '70px';
        copyBtn.style.height = '30px';

        const label = document.createElement('p');
        label.textContent = `rate: ${wrapper.rate.toFixed(1)}`;
        wrapper.addListener((rate) => {
            label.textContent = `rate: ${rate.toFixed(1)}`;
        });
        label.style.width = '100px';
        label.style.height = '30px';

        var container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = '80px 80px 80px';
        container.style.gap = '10px';
        container.appendChild(readBtn);

        container.appendChild(copyBtn);
        container.appendChild(label);
        p.parentElement.insertBefore(container, p);

        wholeTextContent += content;
    });
});
