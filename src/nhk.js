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
    let button = document.querySelector(
        '.tool-buttons__item.btn.toggle-ruby.js-toggle-ruby.hide-sp',
    );
    if (!button) {
        button = document.querySelector(
            '.article-buttons__ruby.js-toggle-ruby.--sp',
        );
    }
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
    return text.trim();
}

const helpMsg = `
    c: toggle<br>
    q: rate - 0.1<br>
    w: rate + 0.1<br>
    o: rate - 0.5<br>
    p: rate + 0.5<br>
    s: copy content to clipboard<br>
    x: force stop speech<br>
    t: toggle image display<br>
    1~6: select voice source
`;

const helperPanel = new MessagePanel(helpMsg);
let voicePtr = 0;

function pressBtnOnVoicePanel(selector) {
    const iframes = document.querySelectorAll('iframe');
    if (!iframes) {
        console.log('No iframe exist');
        return;
    }

    const targetIframe =
        iframes[iframes.length - 1].contentWindow.document.getElementById(
            '_apIfr0',
        );
    if (!targetIframe) {
        console.log('target iframe not found');
        return;
    }

    const btn = targetIframe.contentWindow.document.querySelector(selector);
    if (!btn) {
        console.log('btn not found');
        return;
    }
    btn.click();
}

let showImage = false;

function toggleImageDisplay() {
    var images = document.getElementsByTagName('img');

    for (var i = 0; i < images.length; i++) {
        if (showImage) {
            images[i].style.display = '';
        } else {
            images[i].style.display = 'none';
        }
    }
    showImage = !showImage;
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
            break;
        case 'h':
            helperPanel.show();
            break;
        case 'ArrowLeft':
            pressBtnOnVoicePanel('.vjs-skip.vjs-skip-bwd');
            break;
        case 'ArrowRight':
            pressBtnOnVoicePanel('.vjs-skip.vjs-skip-fwd');
            break;
        case 'k':
            pressBtnOnVoicePanel('.vjs-play-control.vjs-control.vjs-button');
            break;
        case 't':
            toggleImageDisplay();
            break;
        default:
            if ('1' <= event.key && event.key <= 6) {
                voicePtr = event.key - '1';
                console.log(`Set voicePtr to ${voicePtr}`);
            }
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'h':
            helperPanel.hide();
            break;
    }
});

function handle(element) {
    const content = extractTextWithoutRt(element);
    const readBtn = document.createElement('button');
    readBtn.textContent = 'Read';
    readBtn.addEventListener('click', function () {
        const voices = window.speechSynthesis.getVoices();
        const japaneseVoices = voices.filter((voice) => {
            return voice.voiceURI.includes('Japan');
        });

        var utterance = new SpeechSynthesisUtterance(content);
        utterance.lang = 'ja-JP';
        utterance.rate = wrapper.rate;
        if (japaneseVoices.length - 1 >= voicePtr) {
            utterance.voice = japaneseVoices[voicePtr];
        }
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
    label.style.margin = '0px';
    label.style.lineHeight = '30px';

    var container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '80px 80px 80px';
    container.style.gap = '10px';
    container.appendChild(readBtn);

    container.appendChild(copyBtn);
    container.appendChild(label);
    element.parentElement.insertBefore(container, element);

    wholeTextContent += content;
}

document.addEventListener('DOMContentLoaded', function () {
    let title = document.querySelector('.article-title');
    if (!title) {
        title = document.querySelector('.article-main__title');
    }
    if (title) {
        handle(title);
        wholeTextContent += '\n';
    } else {
        console.log('class article-main__title not found');
    }

    const body = document.getElementById('js-article-body');
    if (!body) {
        console.log('js-article-body not found');
        return;
    }
    var paragraphs = body.querySelectorAll('p');
    paragraphs.forEach((p) => {
        // Do not include the last <p>
        if (p.parentElement.style.background == 'rgb(245, 245, 220)') {
            return;
        }
        handle(p);
    });
});
