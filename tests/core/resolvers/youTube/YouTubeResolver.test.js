const test = require('ava');
const YouTubeResolver =  require('../../../../core/resolvers/youTube/YouTubeResolver');

const resolver = new YouTubeResolver();

test('t', async t => {
    const video = await resolver.resolve('https://www.youtube.com/watch?v=0zGcUoRlhmw');

    t.is(video.id, '0zGcUoRlhmw');
    t.not(video.url, undefined);
    t.true(video.title.includes('Chainsmokers'));
    t.not(video.thumbnail, undefined);
    t.is(+video.length, 247);

    console.log(video.url);
});