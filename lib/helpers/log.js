'use strict';

const getLogFunction = (type) => {
    const logFunction = function(...args) {
        let forceLog = args[args.length - 1];

        if (typeof forceLog !== 'boolean') forceLog = false;
        if (this.options.verbose || forceLog) console[type](...args)
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
    if ((typeof opts === 'object') && opts.hasOwnProperty('_')) logger.options = opts;

    Object.keys(logger).forEach((logFunc) => {
        logger[logFunc] = (typeof logger[logFunc] === 'function') ? logger[logFunc].bind(logger) : logger[logFunc];
    });

    return logger;
};