 let define = (obj, name, value) => {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false,
        configurable: true
    });
}

exports.responseFlags = {};
exports.responseMessages = {};

define(exports.responseMessages, 'PARAMETER_MISSING','Some parameter missing.');
define(exports.responseMessages, 'INVALID_ACCESS_TOKEN','Invalid access token.');


define(exports.responseFlags, 'PARAMETER_MISSING',                   422);
define(exports.responseFlags, 'INVALID_ACCESS_TOKEN',                401);
