function redirect_zh2us() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var url = tabs[0].url;
        if (url.includes("zh-tw")) {
            var new_url = url.replace("zh-tw", "en-us");
            chrome.tabs.update(tabs[0].id, { url: new_url });
        }
        else if (url.includes("zh-TW")) {
            var new_url = url.replace("zh-TW", "en-us");
            chrome.tabs.update(tabs[0].id, { url: new_url });
        }
        else {
            console.log("Do not need to redirect this page");
        }
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message) {
        case "REDIRECT_MS":
        case "REDIRECT_MOZILLA":
            redirect_zh2us();
            break;
        default:
            console.log(`Unknown message: ${message}`);
            break;
    }
});
