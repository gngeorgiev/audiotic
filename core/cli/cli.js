#!/usr/bin/env node

const { promisify } = require('util');

const googl = require('goo.gl');
googl.setKey('AIzaSyAtZQSxV1nRM6xAY-w8_Ucbczhuz2nq-Go');

const download = promisify(require('download-file'));

const path = require('path');
const lib = require('../');
const argv = require('minimist')(process.argv.slice(2), {
    boolean: ['short'],
    alias: {
        o: 'output',
        s: 'short'
    }
});

if (!argv._.length) {
    return console.log(
        `Please specify a url from one of the following websites: ${Object.keys(
            lib.resolvers
        ).join(', ')}`
    );
}

(async function() {
    const urls = argv._;
    let resolved;

    try {
        resolved = await Promise.all(
            urls.map(async url => {
                const r = lib.parseUrl(url);
                if (r === 'Unknown') {
                    console.log(`Unknown url origin: ${url}`);
                }

                const resolver = lib.resolvers[r];
                const resolved = await resolver.resolve(url);
                return resolved;
            })
        );
    } catch (e) {
        console.error(`Error while resolving some urls: ${e}`);
    }

    if (argv.short && !argv.output) {
        try {
            resolved = await Promise.all(
                resolved.map(async r => {
                    const shortUrl = await googl.shorten(r.url);
                    r.shortUrl = shortUrl;
                    return r;
                })
            );
        } catch (e) {
            console.error(`Error while shortening links: ${e}`);
        }
    }

    if (argv.output) {
        try {
            const downloadPath = path.resolve(process.cwd(), argv.output);
            await Promise.all(
                resolved.map(async r => {
                    await download(r.url, {
                        directory: downloadPath,
                        filename: r.title
                    });

                    console.log(`Downloaded: ${r.title} at ${downloadPath}`);
                })
            );
        } catch (e) {
            console.error(`Error while downloading some tracks: ${e}`);
        }
    } else {
        resolved.forEach(r => console.log(r.shortUrl || r.url));
    }
})();
