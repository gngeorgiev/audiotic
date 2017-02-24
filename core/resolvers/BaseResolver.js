class BaseResolver {
    constructor(name, url) {
        this.name = name;
        this.url = url;
    }

    resolve(url) {
        throw new Error('Override!');
    }
}

module.exports = BaseResolver;