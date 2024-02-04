document.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
        chrome.runtime.sendMessage('REDIRECT_MS');
    }
});
