const YouTubeResolver =  require('./core/resolvers/youTube/YouTubeResolver');
const dl = require('ytdl-core');

const resolver = new YouTubeResolver();

(async function test() {
    dl.getInfo('https://www.youtube.com/watch?v=1hquWtswX88')

    const video = await resolver.resolve('https://www.youtube.com/watch?v=1hquWtswX88');
    console.log(video);
})();


