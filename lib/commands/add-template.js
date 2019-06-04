'use strict';

const fs = require('fs');
const path = require('path');

const templates = require(path.join(__dirname, '..', '..', 'templates.json'));
const buildTemplateFromDirectory = require(path.join(__dirname, '..', 'helpers', 'dir-to-json.js'));

const { ALLOWED_TEMPLATE_LANGS } = require(path.join(__dirname, '..', 'constants.js'));

exports.command = 'add-template <path> [options]';
exports.describe = 'Add new template';

exports.builder = (yargs) => {
    return yargs.positional('path', {
        describe: 'Path to file/directory specifying template',
        type: 'string'
    }).options({
        'name': {
            alias: 'n',
            describe: 'Template name',
            demandOption: true,
            type: 'string'
        },
        'lang': {
            alias: 'l',
            choices: ALLOWED_TEMPLATE_LANGS,
            describe: 'Language the template is for',
            demandOption: true,
            type: 'string'
        },
        'ignore': {
            alias: 'i',
            describe: 'Files/directories to ignore when making template',
            type: 'array'
        },
        'useExistingContent': {
            alias: 'u',
            describe: 'If files have content, store content in template',
            type: 'boolean'
        }
    });
};

exports.handler = (options) => {
    const stats = fs.statSync(path.resolve(options.path));

    if (stats.isFile()) {
        if (options.format === 'json') {
            const template = require(options.path);

            templates[options.name] = template;
            templates[options.name].created_at = new Date().toISOString();
        }
    }
    else if (stats.isDirectory()) {
        const template = buildTemplateFromDirectory(path.resolve(options.path), options);

        templates[options.name] = template;
    }

    fs.writeFileSync(path.join(__dirname, '..', '..', 'templates.json'), JSON.stringify(templates, null, 4), 'utf8');
};