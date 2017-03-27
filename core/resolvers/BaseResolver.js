class BaseResolver {
    constructor(platformSettings, name, url) {
        this.platformSettings = platformSettings;
        this.name = name;
        this.url = url;
    }

    resolve(url) {
        throw new Error('Override!');
    }

    suggest(substring) {
        throw new Error('Override!');
    }
}

module.exports = BaseResolver;