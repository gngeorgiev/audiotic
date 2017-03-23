const getYouTubeId = require('get-youtube-id');
const fetch = require('node-fetch');
const _ = require('lodash');
const queryString = require('query-string');

const BaseResolver = require('../BaseResolver');
const formats = require('./youTubeFormats');

class YouTubeResolver extends BaseResolver {
    constructor() {
        super('YouTube', 'youtube.com');
    }

    async _getVideoInfo(id) {
        const infoUrl = `http://youtube.com/get_video_info?video_id=${id}`;
        const res = await fetch(infoUrl);
        const infoText = await res.text();
        const parsedInfo = queryString.parse(infoText);
        if (!parsedInfo.status) {
            throw new Error('Invalid video url');
        } else if (parsedInfo.status === 'fail') {
            throw new Error(`Invalid video: ${parsedInfo.reason}`);
        }

        return parsedInfo;
    }

    _parseVideoFormats(info) {
        const formatsList = info.url_encoded_fmt_stream_map.split(',');
        return formatsList.map(f => {
            const format = queryString.parse(f);
            format.container = formats[format.itag].container;
            format.signature = format.s;
            delete format.s;
            return format;
        });
    }

    async resolve(url) {
        const id = getYouTubeId(url);
        try {
            const info = await this._getVideoInfo(id);
            const formats = this._parseVideoFormats(info); 

            const video = {
                id: id,
                title: info.title,
                thumbnail: info.thumbnail_url,
                length: info.length_seconds,
                stream: _.find(formats, f => f.container === 'webm') || 
                    _.find(formats, f => f.container === 'mp4') ||
                    _.find(formats, f => f.container === 'mp3') || 
                    {url: 'unknown', signature: 'unknown'},
                get url() {
                    return `${this.stream.url}&signature=${this.stream.signature}`;
                }
                
            };

            return video;
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}

module.exports = YouTubeResolver;