/**
 * background.js can't access dom elements but it does have access to the chrome variable.
 * 
 * This allows it to create a new chrome window.
 */

// Create imgur link in context menu (right click menu)
var id = chrome.contextMenus.create({
    "title": "View User's Albums Privately",
    "onclick": genericOnClick,
    documentUrlPatterns: [
        "*://imgur.com/gallery*"
    ]
});

// Generic on click to tell content.js to get the username
function genericOnClick(info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "getUserName"
        }, function (response) {
            var username = response.response;
            viewImgurAlbum(username);
        });
    });
}

// Opens an incognito page of the user's albums
function viewImgurAlbum(username) {
    chrome.windows.create({
        url: "http://" + username + ".imgur.com",
        incognito: true
    });
}