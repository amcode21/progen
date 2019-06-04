'use strict';

const inquirer = require('inquirer');
const path = require('path');

const templates = require(path.join(__dirname, '..', 'templates.json'));

const options = require('yargs')
                .command('create <path> [options]', 'create new project template in directory', (yargs) => {
                    return yargs.options({
                        'verbose': {
                            alias: 'v',
                            describe: 'additional logging information',
                            default: false,
                            type: 'boolean'
                        },
                        'template': {
                            alias: 't',
                            describe: 'template to use',
                            choices: Object.keys(templates), // Object.entries(templates).map((t) => `${t[0]} (${t[1].lang})`),
                            type: 'string'
                        },
                        'name': {
                            alias: 'n',
                            describe: 'name of output directory',
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