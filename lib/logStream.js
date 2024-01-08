'use strict';
const stream = require('stream');
const util = require('util');
const Writable = stream.Writable;

/**
 * the LogStream constructor.
 * it inherits all methods of a writable stream
 * the constructor takes a options object. A important field is the model, the model will
 * be used for saving the log entry to the mongo db instance.
 * @param options
 * @constructor
 */
function LogStream(options) {

    this.model = options.model || false;

    if (!this.model) {
        throw new Error('[LogStream] - Fatal Error - No mongoose model provided!');
    }

    Writable.call(this, options);
}

/**
 * inherits all Writable Stream methods
 */
util.inherits(LogStream, Writable);

/**
 * the _write method must be overridden by this implementation.
 * This method will be called on every write event on this stream.
 * @param chunk
 * @param enc
 * @param cb
 * @returns {*}
 */
LogStream.prototype._write = async function (chunk, enc, cb) {

    if (this.model === false) {
        return cb();
    }

    const newLogEntry = new this.model(JSON.parse(chunk.toString()));

    await newLogEntry
        .save()
        .then(_ => cb())
        .catch(err => {
            throw err
        })
};

/**
 * export the logStream
 * @param options
 * @returns {LogStream}
 */
module.exports = function (options) {

    if (!options) {
        options = {};
    }

    return new LogStream(options);
};

