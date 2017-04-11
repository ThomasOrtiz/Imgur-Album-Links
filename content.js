/**
 * content.js can access dom elements and manipulate them whereas background.js cannot.
 * 
 * As such, content.js is able to get the username with jquery without any highlighting needed.
 */


/**
 * When the document is ready run
 */
$(function () {
    generateAlbumSpan();
    checkIfOnUserPage(); 
});

/**
 * Creates an album link underneath the header.
 * 
 * It removes any previous headers that were there (since Imgur doesn't reload pages) 
 * and then adds the new album link in its place.
 */
var generateAlbumSpan = function(){
    var username = getUserName();
    $("#albumSpan").remove();
    $("div.post-title-meta.font-opensans-semibold").append("<span id='albumSpan'><a href='http://imgur.com/user/" + username + "'>Albums</a></span>");
}

/**
 * Checks if we are on a user gallery page.
 * 
 * If we are it adds a Albums link.
 */
var checkIfOnUserPage = function(){
    if( currentPage.match("/[^%]imgur.com\/user\/*/") ){
        var username = getUserNameFromUrl();
        $(".right").prepend("<div class='panel menu'><div class='textbox button'><a href='http://" + username + ".imgur.com'><h2>Albums</h2></a></div></div>")
    }
}

/**
 * This listens for changes in the url and will regenerate the album link when needed.
 */
var currentPage = window.location.href;   
setInterval(function(){
    // Check if the page has changed and we need to update information
    if (currentPage != window.location.href){
        currentPage = window.location.href;
        generateAlbumSpan();
    }
}, 500);

/**
 * Retrieves the username from the URL
 * 
 * @return username
 */
var getUserNameFromUrl = function(){
    var url = window.location.href;
    username = url.split('user/')[1]; // gets <username></potentially junk>
    username = username.split('/')[0]; // gets <username>'
    return username;
}

// Get the username
var getUserName = function () {
    // Get the username of the person that create the picture in the gallery
    var imgurUserName = $(".post-title-meta.font-opensans-semibold a").html();

    // Default to the current user's albums
    if(!imgurUserName){
        imgurUserName = $('a[href^="//imgur.com/user"]').html()
    }

    return imgurUserName;
};

// Get message from background.js to retrieve the username.
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // Get the username and return it as a response
    if (message.functiontoInvoke == "getUserName"){
        var username = getUserName();
        sendResponse({
            response: username
        });
    }
});