console.log("popup");
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'extractInformation' });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updatePopup') {
    document.getElementById('information').innerHTML = request.information;
  }
});
