'use strict';

const options = require('yargs')
                .command('create <path>', 'create new project template in directory', (yargs) => {
                    return yargs.options({
                        'verbose': {
                            alias: 'v',
                            demandOption: true,
                            describe: 'verbose logging',
                            default: false,
                            type: 'boolean'
                        }
                    });
                })
                .help('help')
                .argv

const inquirer = require('inquirer');
const path = require('path');

const logger = require(path.join(__dirname, 'helpers', 'log.js'))(options);
const buildTemplateDirectory = require(path.join(__dirname, 'helpers', 'dir-from-json.js'));
const templates = require(path.join(__dirname, '..', 'templates.json'));

const choices = Object.keys(templates);

const questions = [
    {
        name: 'projectChoice',
        type: 'list',
        message: 'Which project template would you like to generate?',
        choices: choices
    },
    {
        name: 'projectName',
        type: 'input',
        message: 'Project name:',
        validate: (input) => {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    }
];


module.exports = () => {
    inquirer.prompt(questions)
        .then((answers) => {
            const template = templates[answers.projectChoice];
            template.name = answers.projectName || answers.projectChoice;

            buildTemplateDirectory(options.path, null, template);

            logger.log('Finished generating template:', template.name)
        });
};