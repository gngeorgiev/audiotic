const process = require('process');
const buffer = require('buffer').Buffer;

module.exports = require('./audiotic')({
    process,
    Buffer: buffer
});