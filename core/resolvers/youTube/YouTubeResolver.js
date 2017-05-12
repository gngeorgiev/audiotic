const getYouTubeId = require('get-youtube-id');
const _ = require('lodash');
const queryString = require('query-string');
const url = require('url');
const cheerio = require('cheerio');

const BaseResolver = require('../BaseResolver');
const formats = require('./formats');
const util = require('./util');
const sig = require('./sig');

const VIDEO_URL = 'https://www.youtube.com/watch?v=';
const EMBED_URL = 'https://www.youtube.com/embed/';
const VIDEO_EURL = 'https://youtube.googleapis.com/v/';
const INFO_HOST = 'www.youtube.com';
const INFO_PATH = '/get_video_info';
const KEYS_TO_SPLIT = ['keywords', 'fmt_list', 'fexp', 'watermark'];
const SUGGEST_URL =
    'http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=';
const SEARCH_URL = 'https://www.youtube.com/results?search_query=';
const VIDEO_CLASS = '.yt-lockup-video';
const VIDEO_ID_LENGTH = 11;

class YouTubeResolver extends BaseResolver {
    constructor(platformSettings) {
        super(platformSettings, 'YouTube', 'youtube.com');
    }

    async _getVideoInfo(id) {
        const videoUrl = `${VIDEO_URL}${id}`;
        const videoResponse = await fetch(videoUrl);
        const videoBody = await videoResponse.text();

        const additional = {
            author: util.getAuthor(videoBody),
            published: util.getPublished(videoBody),
            description: util.getVideoDescription(videoBody),
            relatedVideos: util.getRelatedVideos(videoBody),
            video_url: videoUrl
        };

        let jsonStr = util.between(
            videoBody,
            'ytplayer.config = ',
            '</script>'
        );
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
        const embedResponse = await fetch(embedUrl);
        const embedBody = await embedResponse.text();
        let config = util.between(
            embedBody,
            "t.setConfig({'PLAYER_CONFIG': ",
            "},'"
        );
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
        return url.replace(/\/s\/([a-fA-F0-9\.]+)/, function(_, s) {
            return '/signature/' + sig.decipher(tokens, s);
        });
    }

    async _parseConfig(id, additional, config) {
        if (config.status === 'fail') {
            throw new Error(
                config.errorcode && config.reason
                    ? 'Code ' + config.errorcode + ': ' + config.reason
                    : 'Video not found'
            );
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
                sts: config.sts
            }
        });

        const infoResponse = await fetch(infoUrl);
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

        info.fmt_list = info.fmt_list
            ? info.fmt_list.map(format => format.split('/'))
            : [];

        info.formats = util.parseFormats(info);

        info = util.objectAssign(info, additional, false);

        if (
            info.formats.some(f => !!f.s) ||
            config.args.dashmpd ||
            info.dashmpd ||
            info.hlsvp
        ) {
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
        return f.container === container && f.url && !f.resolution;
    }

    _getThumbnail(id) {
        return `http://img.youtube.com/vi/${id}/0.jpg`;
    }

    async resolve(urlOrId) {
        let id;
        if (urlOrId.length === VIDEO_ID_LENGTH) {
            id = urlOrId;
        } else {
            id = getYouTubeId(urlOrId);
        }

        const info = await this._getVideoInfo(id);
        const video = {
            id: id,
            source: this.name,
            title: info.title,
            thumbnail: this._getThumbnail(id),
            length: +info.length_seconds,
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
                    length: +v.length_seconds,
                    thumbnail: this._getThumbnail(v.id)
                };
            })
        };

        return video;
    }

    async suggest(substring) {
        const response = await fetch(
            `${SUGGEST_URL}${encodeURIComponent(substring)}`
        );
        const data = await response.json();
        data.source = this.name;
        return data[1];
    }

    async search(substring) {
        const url = `${SEARCH_URL}${encodeURIComponent(substring)}`;
        const response = await fetch(url);
        const $ = cheerio.load(await response.text());
        const videoElements = $(VIDEO_CLASS);
        const getIdSelector = id =>
            `${VIDEO_CLASS}[data-context-item-id=${id}]`;

        return Array.from(videoElements).map(videoEl => {
            const id = videoEl.attribs['data-context-item-id'];
            const idSelector = getIdSelector(id);

            return {
                id: id,
                source: this.name,
                thumbnail: this._getThumbnail(id),
                title: $(idSelector).find('.yt-lockup-title > a').attr('title')
            };
        });
    }
}

module.exports = YouTubeResolver;
