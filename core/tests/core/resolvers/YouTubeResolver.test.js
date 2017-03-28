const test = require('ava');
const request = require('request');

const common = require('../../common');
const { YouTube } = common.rootRequire('core/audiotic-node');

test('resolving video by link', async t => {
    const video = await YouTube.resolve('https://www.youtube.com/watch?v=0zGcUoRlhmw');

    t.is(video.id, '0zGcUoRlhmw');
    t.not(video.url, undefined);
    t.true(video.title.includes('Chainsmokers'));
    t.not(video.thumbnail, undefined);
    t.is(+video.length, 247);

    const statusCode = await new Promise((resolve, reject) => {
        request.head(video.url, {}, (err, res) => resolve(res.statusCode));
    });

    t.is(statusCode, 200);
});

test('resolving video by id', async t => {
    const video = await YouTube.resolve('0zGcUoRlhmw');

    t.is(video.id, '0zGcUoRlhmw');
    t.not(video.url, undefined);
    t.true(video.title.includes('Chainsmokers'));
    t.not(video.thumbnail, undefined);
    t.is(+video.length, 247);

    const statusCode = await new Promise((resolve, reject) => {
        request.head(video.url, {}, (err, res) => resolve(res.statusCode));
    });

    t.is(statusCode, 200);
});

test('suggesting', async t => {
    const suggestions = await YouTube.suggest('ariana grande');

    t.is(suggestions.length, 10);
    t.is(suggestions[0], 'ariana grande');
    suggestions.forEach(s => t.is(typeof s, 'string'));
});

test('search', async t => {
    const results = await YouTube.search('ariana grande');

    results.forEach(r => {
        t.is(typeof r.id, 'string');
        t.is(r.thumbnail, `https://i.ytimg.com/vi/${r.id}/hqdefault.jpg`);
        t.is(typeof r.thumbnail, 'string');
        t.is(typeof r.title, 'string');
    });
});