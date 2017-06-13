const libResolvers = require('./resolvers');
const parseUrl = require('./lib/parseUrl');

//I don't like it either, but this is the only good way to have
//cross platform code
function extendGlobalScope(globals) {
    const globalScope = typeof global !== 'undefined' ? global : window;
    Object.keys(globals).forEach(k => {
        if (!globalScope[k]) {
            globalScope[k] = globals[k];
        }
    });
}

function createLib(platformSettings) {
    const resolvers = {};
    const registerCustomResolver = resolver => {
        audiotic[resolver.name] = resolver;
    };

    Object.keys(libResolvers).forEach(
        r => (resolvers[r] = new libResolvers[r](platformSettings))
    );

    return {
        resolvers,
        registerCustomResolver,
        parseUrl
    };
}

module.exports = function(globals, platformSettings = {}) {
    extendGlobalScope(globals);

    return createLib(platformSettings);
};
