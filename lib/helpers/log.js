'use strict';

let options = {};

const getLogFunction = (type) => {
    const logFunction = (...args) => {
        let forceLog = args[args.length - 1];

        if (typeof forceLog !== 'boolean') forceLog = false;
        if (options.verbose || forceLog) console[type](...args)
    };

    return logFunction;
}

const logger = {
    log: getLogFunction('log'),
    info: getLogFunction('info'),
    debug: getLogFunction('debug'),
    dir: getLogFunction('dir'),
    error: getLogFunction('error')
};

module.exports = (opts) => {
    if (opts !== null) options = Object.assign({}, opts);

    return logger;
};