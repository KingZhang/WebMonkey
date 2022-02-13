export function addPageScript(jsPath) {
    var pageScript = document.createElement('script');
    pageScript.setAttribute('type', 'text/javascript');
    pageScript.src = chrome.extension.getURL(jsPath);
    pageScript.onload = function() {
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(pageScript);
}

export function sendChromeMessage(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
            if (callback) callback(response);
        });
    });
}