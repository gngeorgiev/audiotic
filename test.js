const audiotic = require('./core/audiotic-node');

(async function() {
    try {
        const video = await audiotic.YouTube.search('ariana grande')
        console.log(video);
    } catch (ex) {
        console.error(ex);
    }
}());
