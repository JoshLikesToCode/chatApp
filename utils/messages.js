const moment = require('moment'); // for time stamps

// we want to turn out msgs into objects with usernames attached
function formatMessage(username, text)
{
    return {
        username,
        text,
        time: moment().format('h:mm a') // hour : minutes : am or pm
    }
}

module.exports = formatMessage;