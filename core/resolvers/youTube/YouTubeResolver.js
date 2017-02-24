const getYouTubeId = require('get-youtube-id');
const fetch = require('node-fetch');
const _ = require('lodash');

const BaseResolver = require('../BaseResolver');
const formats = require('./youTubeFormats');

class YouTubeResolver extends BaseResolver {
    constructor() {
        super('YouTube', 'youtube.com');
        this.infoUrl = 'http://www.youtube.com/get_video_info?video_id=';
    }

    _buildInfoUrl(id) {
        return `${this.infoUrl}${id}&eurl=https://youtube.googleapis.com/v/${id}&ps=default&gl=US&hl=en`;
    }

    _infoToJson(infoText) {
        const res = {};
        const pars = infoText.split('&');
        for (const i in pars) {
            const kv = pars[i].split('=');
            const k = kv[0];
            const v = kv[1];
            res[k] = decodeURIComponent(v);
        }

        return res;
    }

    _mapUrls(info) {
        var tmp = info.url_encoded_fmt_stream_map;
        if (tmp) {
            tmp = tmp.split(',');
            for (const i in tmp) {
                tmp[i] = this._infoToJson(tmp[i]);
            }
            info.formats = tmp;
        } else {
            info.formats = info.url_encoded_fmt_stream_map
        }

        delete info.url_encoded_fmt_stream_map;

        _.forEach(info.formats, f => {
            f.format = formats[f.itag].container;
        });

        return info;
    }

    async resolve(url) {
        const id = getYouTubeId(url);
        const infoUrl = this._buildInfoUrl(id);
        try {
            const res = await fetch(infoUrl);
            const infoText = await res.text();
            const videoInfo = this._mapUrls(this._infoToJson(infoText));
            const video = {
                id: id,
                title: videoInfo.title,
                thumbnail: videoInfo.thumbnail_url,
                length: videoInfo.length_seconds,
                url: (_.find(videoInfo.formats, f => f.format === 'webm') || 
                    _.find(videoInfo.formats, f => f.format === 'mp4') ||
                    _.find(videoInfo.formats, f => f.format === 'mp3') || 
                    {url: 'unknown'}).url
            };

            return video;
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}

module.exports = YouTubeResolver;