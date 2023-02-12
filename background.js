'use strict';

let count = 0;
let timerId = 0;

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
	if (await chrome.offscreen.hasDocument()) return;
	await chrome.offscreen.createDocument({
		url: 'offscreen.html',
		reasons: [ 'BLOBS' ],
		justification: 'keep service worker alive'
	});
}

// On startup or when Chrome stops the service worker for some reasons
function onStartup() {
	if (timerId) return;

	createOffscreen();
	timerId = setInterval(() => {
		chrome.action.setBadgeText({ text: String(++count) });
	}, 1000);
}

// It will be run when we disable/enable the extension or install it for the first time
onStartup();

// But not in the case when we close/open the browser because the service worker
// will be in an inactive state and only the handler of the fired event will be started
chrome.runtime.onStartup.addListener(onStartup);

// Receive a message from the offscreen document to reset the inactivity timer
chrome.runtime.onMessage.addListener(onStartup);

