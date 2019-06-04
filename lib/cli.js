'use strict';

const path = require('path');

module.exports = () => {
    require('yargs')
        .usage('Usage: $0 <command> [options]')
        .command(require(path.join(__dirname, 'commands', 'create.js')))
        .command(require(path.join(__dirname, 'commands', 'add-template.js')))
        .help()
        .argv
};