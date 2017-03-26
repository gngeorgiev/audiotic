const resolvers = require('./resolvers/index');

module.exports = function(globals, platformSettings = {}) {
    Object.assign(global, globals);

    const audiotic = {};
    Object.keys(resolvers).forEach(r => audiotic[r] = new resolvers[r](platformSettings));

    return audiotic;
}