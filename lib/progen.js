'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const templates = require(path.join(__dirname, '..', 'templates.json'));
const { AVAILABLE_SORT_OPTIONS } = require(path.join(__dirname, 'constants.js'));

const options = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('create <path> [options]', 'Creates new project template in directory indicated by path arg', (yargs) => {
        return yargs.positional('path', {
            describe: 'Indicates directory to create new template in (default: current directory)',
            type: 'string'
        }).options({
            'verbose': {
                alias: 'v',
                describe: 'Additional logging information',
                default: false,
                type: 'boolean'
            },
            'template': {
                alias: 't',
                describe: 'Template to use',
                choices: Object.keys(templates), // Object.entries(templates).map((t) => `${t[0]} (${t[1].lang})`),
                type: 'string'
            },
            'name': {
                alias: 'n',
                describe: 'Name of output directory',
                type: 'string'
            }
        });
    })
    .help('help')
    .argv

const logger = require(path.join(__dirname, 'helpers', 'log.js'))(options);
const buildTemplateDirectory = require(path.join(__dirname, 'helpers', 'dir-from-json.js'));

const choices = Object.keys(templates);

const questions = [];

if (!options.hasOwnProperty('template')) {
    questions.push({
        name: 'projectChoice',
        type: 'list',
        message: 'Which project template would you like to generate?',
        choices: choices
    })
}

if (!options.hasOwnProperty('name')) {
    console.log(options);

    questions.push({
        name: 'projectName',
        type: 'input',
        message: 'Project name:',
        validate: (input) => {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    });
}

module.exports = () => {
    if (questions.length > 0) {
        inquirer.prompt(questions)
            .then((answers) => {
                const template = templates[options.template] || templates[answers.projectChoice];
                template.name = options.name|| answers.projectName || answers.projectChoice;

                buildTemplateDirectory(options.path, null, template);

                logger.log('Finished generating template:', template.name);
            });
    }
    else {
        const template = templates[options.template];
        template.name = options.name;

        buildTemplateDirectory(options.path, null, template);

        logger.log('Finished generating template:', template.name);
    }
};