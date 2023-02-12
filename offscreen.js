'use strict';

// Send a message to the service worker every 20 seconds
setInterval(() => {
	chrome.runtime.sendMessage({ keepAlive: true });
}, 20000);
