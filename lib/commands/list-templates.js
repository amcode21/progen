'use strict';

const Table = require('cli-table');
const path = require('path');

const templates = require(path.join(__dirname, '..', '..', 'templates.json'));

const { 
    ALLOWED_TEMPLATE_LANGS, 
    ALLOWED_TEMPLATE_SORT_OPTIONS
} = require(path.join(__dirname, '..', 'constants.js'));

exports.command = 'list-templates [options]';
exports.describe = 'List available templates';

exports.builder = (yargs) => {
    return yargs.options({
        'lang': {
            alias: 'l',
            choices: ALLOWED_TEMPLATE_LANGS,
            describe: 'Language the template is for',
            type: 'string'
        },
        'sortBy': {
            alias: 's',
            choices: ALLOWED_TEMPLATE_SORT_OPTIONS,
            describe: 'Sort templates in specific way',
            type: 'string'
        },
        'reverse': {
            alias: 'r',
            describe: 'Reverse sort order (newest last by default)',
            type: 'boolean'
        }
    });
};

exports.handler = (options) => {
    const table = new Table({ head: ['Name', 'Language', 'Created At']});

    Object.keys(templates).forEach((t) => {
        table.push([
            t,
            templates[t].lang,
            templates[t].created_at
        ]);
    });

    if (options.lang) {
        table.filter((t) => t['Language'] === options.lang);
    }
    
    if (options.sortBy) {
        if (options.sortBy === 'date') {
            table.sort((a, b) => {
                a = new Date(a.created_at);
                b = new Date(b.created_at);

                return (a > b) ? -1 : ((a < b) ? 1 : 0);
            });
        }
        else if (options.sortBy === 'alphabetical') {
            table.sort();
        }

        if (options.reverse) {
            table.reverse();
        }
    }

    console.log(table.toString());
};