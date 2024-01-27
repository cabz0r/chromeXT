chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'extractInformation') {
    const regexPattern = /"mp4","videoUrl":"(.*?)","quality":\[(.*?)\],"remote":true}/;
    const match = document.body.innerHTML.match(regexPattern);

    if (match && match[1]) {
      const cleanedInformation = match[1].replace(/\\/g, ''); // Remove backslashes

      // Fetch data from the URL
      fetch(cleanedInformation)
        .then(response => response.json()) // Assuming the data is in JSON format
        .then(data => {
          // Extract videoUrl and quality values for each entry
          const formattedData = data.map(entry => {
            return {
              videoUrl: entry.videoUrl,
              quality: entry.quality
            };
          });

          // Convert the array to a formatted string with clickable URLs
          const formattedString = formattedData.map(entry => {
            return `videoUrl: <a href="${entry.videoUrl}" target="_blank">${entry.videoUrl}</a><h3>quality: ${entry.quality}</h3>`;
          }).join('</br></br>');

          // Send the formatted string back to popup.js
          chrome.runtime.sendMessage({ action: 'updatePopup', information: formattedString });
        })
        .catch(error => {
          console.error('Error fetching or parsing data:', error);
          chrome.runtime.sendMessage({ action: 'updatePopup', information: 'Error fetching or parsing data from the URL' });
        });
    }
  }
});
