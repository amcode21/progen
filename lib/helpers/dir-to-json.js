 'use strict';

const fs = require('fs');
const path = require('path');

const logger = require(path.join(__dirname, 'log.js'))();

const { DEFAULT_IGNORE_ARRAY } = require(path.join(__dirname, '..', 'constants.js'));

const convertToJSON = (dirPath, item, options, jsonTemplate) => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    if (!options.ignore.includes(item)) {
        if (stats.isFile()) {
            const templateItem = { name: item, type: 'file' };

            if (options.useExistingContent) {
                const contents = fs.readFileSync(itemPath, 'utf8').toString();

                templateItem.contents = contents;
            }

            jsonTemplate.contents.push(templateItem);
        }
        else if (stats.isDirectory()) {
            const templateItem = { name: item, type: 'folder', contents: [] };
            const dirContents = fs.readdirSync(itemPath, 'utf8');

            jsonTemplate.contents.push(templateItem);
            dirContents.forEach((item) => convertToJSON(itemPath, item, options, jsonTemplate.contents[jsonTemplate.contents.length - 1]));
        }
    }
}

module.exports = (directoryPath, options) => {
    const dirPath = path.resolve(directoryPath);
    const jsonTemplate = { lang: options.lang, contents: [] };

    const dirContents = fs.readdirSync(dirPath, 'utf8');

    // configuring options
    if (!options.ignore) options.ignore = DEFAULT_IGNORE_ARRAY;
    else options.ignore = options.ignore.concat(DEFAULT_IGNORE_ARRAY);

    dirContents.forEach((item) => {
        convertToJSON(dirPath, item, options, jsonTemplate);
    });

    jsonTemplate.created_at = new Date().toISOString();

    return jsonTemplate;
};