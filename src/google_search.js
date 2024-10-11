document.addEventListener('keydown', function (event) {
    if (event.key === 'm' && event.ctrlKey) {
        chrome.runtime.sendMessage('SHOW_MORE_GOOGLE_RESULT');
    }
});
