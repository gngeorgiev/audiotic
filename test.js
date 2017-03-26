const audiotic = require('./core/audiotic-node');

(async function() {
    try {
        const video = await audiotic.YouTube.resolve('https://www.youtube.com/watch?v=1hquWtswX88')
        console.log(video);
    } catch (ex) {
        console.error(ex);
    }
}());
