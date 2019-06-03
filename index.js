#!/usr/bin/env node

const inquirer = require('inquirer');
const path = require('path');

const buildTemplateDirectory = require(path.join(__dirname, 'dir-from-json.js'));
const templates = require(path.join(__dirname, 'templates.json'));

const choices = Object.keys(templates);

const PROJECT_NAME_IDENTIFIER = '<PROJ_NAME>';

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


inquirer.prompt(questions)
    .then((answers) => {
        const template = templates[answers.projectChoice];
        template.name = answers.projectName || answers.projectChoice;

        template.contents.map((c) => {
            if (c.name === 'package.json') {
                c.contents = c.contents.replace(PROJECT_NAME_IDENTIFIER, template.name);
            }

            return c;
        });

        buildTemplateDirectory(process.cwd(), template, (err) => {
            if (err) {
                throw err;
            }
            else {
                console.log('Finished generating a directory.');
            }
        });
    });