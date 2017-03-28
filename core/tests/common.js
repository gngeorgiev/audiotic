const path = require('path');

module.exports = {
    rootRequire(module) {
        return require(path.join('..', module));
    }
}