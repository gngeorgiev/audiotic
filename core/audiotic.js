const resolvers = require('./resolvers/index');

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
    const audiotic = {
        resolvers: {}
    };

    const registerCustomResolver = resolver => {
        audiotic[resolver.name] = resolver;
    };

    audiotic.registerCustomResolver = registerCustomResolver;

    Object.keys(resolvers).forEach(
        r => (audiotic.resolvers[r] = new resolvers[r](platformSettings))
    );
    return audiotic;
}

module.exports = function(globals, platformSettings = {}) {
    extendGlobalScope(globals);

    return createLib(platformSettings);
};
