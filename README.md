# Persistent Service worker in Manifest V3 extension

Extension service workers stop working 30 seconds after the last event. Starting with Chrome 109 you can use [offscreen API](https://developer.chrome.com/docs/extensions/reference/offscreen/) to create an offscreen document and send some message from it every 30 second or less, to keep service worker running. This extension, for example, updates the badge text every second.

 - manifest.json
 
```"permissions": ["offscreen"]```

 - offscreen.html
 
```<script src="offscreen.js"></script>```

 - offscreen.js
 
```
// Send a message to the service worker every 20 seconds
setInterval(() => {
	chrome.runtime.sendMessage({ keepAlive: true });
}, 20000);
```

 - background.js
 
```
// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
	if (await chrome.offscreen.hasDocument()) return;
	await chrome.offscreen.createDocument({
		url: 'offscreen.html',
		reasons: [ 'BLOBS' ],
		justification: 'keep service worker running'
	});
}

// It will be run when we disable/enable the extension or install it for the first time
createOffscreen();

// But not in the case when we close/open the browser because the service worker
// will be in an inactive state and only the handler of the fired event will be started
chrome.runtime.onStartup.addListener(createOffscreen);

// Receive a message from an offscreen document to reset the inactivity timer
chrome.runtime.onMessage.addListener((msg) => {
	console.log('keepAlive');
});
```
