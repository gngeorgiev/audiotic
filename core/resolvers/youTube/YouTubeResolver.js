const getYouTubeId = require('get-youtube-id');
const _ = require('lodash');
const queryString = require('query-string');
const url = require('url');

const BaseResolver = require('../BaseResolver');
const formats = require('./formats');
const util = require('./util');
const sig = require('./sig');

const VIDEO_URL = 'https://www.youtube.com/watch?v=';
const EMBED_URL = 'https://www.youtube.com/embed/';
const VIDEO_EURL = 'https://youtube.googleapis.com/v/';
const INFO_HOST = 'www.youtube.com';
const INFO_PATH = '/get_video_info';
const KEYS_TO_SPLIT = [
    'keywords',
    'fmt_list',
    'fexp',
    'watermark'
];

class YouTubeResolver extends BaseResolver {
    constructor(platformSettings) {
        super(platformSettings, 'YouTube', 'youtube.com');
    }

    async _getVideoInfo(id) {
        const videoUrl = `${VIDEO_URL}${id}`;
        const videoResponse = await global.fetch(videoUrl);
        const videoBody = await videoResponse.text();

        const additional = {
            author: util.getAuthor(videoBody),
            published: util.getPublished(videoBody),
            description: util.getVideoDescription(videoBody),
            relatedVideos: util.getRelatedVideos(videoBody),
            video_url: videoUrl,
        };

        let jsonStr = util.between(videoBody, 'ytplayer.config = ', '</script>');
        if (jsonStr) {
            jsonStr = jsonStr.slice(0, jsonStr.lastIndexOf(';ytplayer.load'));
            let config;
            try {
                config = JSON.parse(jsonStr);
            } catch (err) {
                throw new Error('Error parsing config: ' + err.message);
            }
            if (!config) {
                throw new Error('Could not parse video page config');
            }

            return await this._parseConfig(id, additional, config);

        }

        const embedUrl = `${EMBED_URL}${id}`;
        const embedResponse = await global.fetch(embedUrl);
        const embedBody = await embedResponse.text();
        let config = util.between(embedBody, 't.setConfig({\'PLAYER_CONFIG\': ', '},\'');
        if (!config) {
            throw new Error('Could not find `player config`');
        }

        try {
            config = JSON.parse(config + '}');
        } catch (err) {
            throw new Error('Error parsing config: ' + err.message);
        }

        return await this._parseConfig(id, additional, config);
    }

    _decipherURL(url, tokens) {
        return url.replace(/\/s\/([a-fA-F0-9\.]+)/, function (_, s) {
            return '/signature/' + sig.decipher(tokens, s);
        });
    }

    async _parseConfig(id, additional, config) {
        if (config.status === 'fail') {
            throw new Error(config.errorcode && config.reason ?
                'Code ' + config.errorcode + ': ' + config.reason : 'Video not found');
        }

        const infoUrl = url.format({
            protocol: 'https',
            host: INFO_HOST,
            pathname: INFO_PATH,
            query: {
                video_id: id,
                eurl: VIDEO_EURL + id,
                ps: 'default',
                gl: 'US',
                hl: 'en',
                sts: config.sts,
            },
        });

        const infoResponse = await global.fetch(infoUrl);
        const infoBody = await infoResponse.text();
        let info = queryString.parse(infoBody);

        if (info.status === 'fail') {
            info = config.args;
        } else if (info.requires_purchase === '1') {
            throw new Error(info.ypc_video_rental_bar_text);
        }

        KEYS_TO_SPLIT.forEach(key => {
            if (!info[key]) {
                return;
            }

            info[key] = info[key].split(',').filter(v => v !== '');
        });

        info.fmt_list = info.fmt_list ?
            info.fmt_list.map(format => format.split('/')) : [];

        info.formats = util.parseFormats(info);

        info = util.objectAssign(info, additional, false);

        if (info.formats.some(f => !!f.s) || config.args.dashmpd || info.dashmpd || info.hlsvp) {
            const html5playerfile = url.resolve(VIDEO_URL, config.assets.js);
            const tokens = await sig.getTokens(html5playerfile);
            sig.decipherFormats(info.formats, tokens);

            info.formats.sort(util.sortFormats);
            return info;
        }

        if (!info.formats.length) {
            throw new Error('This video is unavailable');
        }

        sig.decipherFormats(info.formats, null);
        info.formats.sort(util.sortFormats);
        return info;
    }

    _filterFormat(f, container) {
        return f.container === container && f.url;
    }

    async resolve(url) {
        const id = getYouTubeId(url);
        try {
            const info = await this._getVideoInfo(id);

            const video = {
                id: id,
                title: info.title,
                thumbnail: info.thumbnail_url,
                length: info.length_seconds,
                stream: _.find(info.formats, f => this._filterFormat(f, 'webm')) ||
                    _.find(info.formats, f => this._filterFormat(f, 'mp4')) ||
                    _.find(info.formats, f => this._filterFormat(f, 'mp3')) || {
                        url: 'unknown',
                        signature: 'unknown'
                    },
                get url() {
                    return this.stream.url;
                },
                related: info.relatedVideos.map(v => {
                    return {
                        id: v.id,
                        title: v.title,
                        length: v.length_seconds,
                        thumbnail: v.iurlhq
                    }
                })

            };

            return video;
        } catch (ex) {
            throw ex;
        }
    }
}

module.exports = YouTubeResolver;