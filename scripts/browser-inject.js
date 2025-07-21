const browserScriptElement = document.createElement('script');
const browserScriptURL = chrome.runtime.getURL('browser.es.js');
browserScriptElement.src = browserScriptURL;
browserScriptElement.type = 'module';
(document.head || document.documentElement).appendChild(browserScriptElement);

console.log('io.CB is loaded!');