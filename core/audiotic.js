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

function createLib() {
    const audiotic = {};
    Object.keys(resolvers).forEach(r => audiotic[r] = new resolvers[r](platformSettings));
    return audiotic;
}

module.exports = function(globals, platformSettings = {}) {
    extendGlobalScope(globals);
    
    return createLib();
}