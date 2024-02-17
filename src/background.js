function redirect_zh2us() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var url = tabs[0].url;
        if (url.includes('zh-tw')) {
            var new_url = url.replace('zh-tw', 'en-us');
            chrome.tabs.update(tabs[0].id, { url: new_url });
        } else if (url.includes('zh-TW')) {
            var new_url = url.replace('zh-TW', 'en-us');
            chrome.tabs.update(tabs[0].id, { url: new_url });
        } else {
            console.log('Do not need to redirect this page');
        }
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (typeof message === 'string') {
        switch (message) {
            case 'REDIRECT_MS':
            case 'REDIRECT_MOZILLA':
                redirect_zh2us();
                break;
            case 'GET_NHK_SPEECH_RATE':
                chrome.storage.local.get('nhk_speech_rate', function (data) {
                    console.log(`Get nhk_speech_rate from local storage`);
                    console.log(data);
                    if (data.nhk_speech_rate) {
                        sendResponse({ data: data.nhk_speech_rate });
                    } else {
                        sendResponse({ data: 1 });
                    }
                });
                return true; // Indicate that the response will be sent asynchronously
            default:
                console.log(`Unknown message: ${message}`);
                break;
        }
    } else if (message.key) {
        switch (message.key) {
            case 'SET_NHK_SPEECH_RATE':
                console.log(`Set nhk speech rate: ${message.value}`);
                chrome.storage.local.set({ nhk_speech_rate: message.value });
                break;
            default:
                console.log(`Unknown message key: ${message.key}`);
                break;
        }
    } else {
        console.log(`Unknown message`);
        console.log(message);
    }
});
