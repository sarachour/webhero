
chrome.runtime.onMessage.addListener(function(msg, sender) {
    /* First, validate the message's structure */
    if ((msg.from === 'content') && (msg.subject === 'send_level')) {
        /* Enable the page-action for the requesting tab */
        console.log(msg);
    }
});