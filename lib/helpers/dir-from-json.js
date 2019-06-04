'use strict';

const fs = require('fs');
const path = require('path');

const logger = require(path.join(__dirname, 'log.js'))();

const buildFileFromJSON = (directoryPath, options, file) => {
    const filePath = path.join(directoryPath, file.name);

    fs.openSync(filePath, 'w');
    logger.log('Created file:', filePath);

    if (file.contents) {
        fs.writeFileSync(filePath, file.contents, 'utf8');
    }
};

const buildDirectoryFromJSON = (directoryPath, options, directory) => {
    const dirPath = path.join(directoryPath, directory.name);

    fs.mkdirSync(dirPath);

    logger.log('Created directory:', dirPath);

    if (directory.contents) {
        const dirsInside = [];

        directory.contents.forEach((item) => {
            if (item.type === 'folder') {
                dirsInside.push(item);
            }
            else if (item.type === 'file') {
                buildFileFromJSON(dirPath, null, item);
            }
        });

        if (dirsInside.length > 0) {
            dirsInside.forEach((dir) => buildDirectoryFromJSON(dirPath, null, dir));
        }    
    }

    return;
};

module.exports = buildDirectoryFromJSON;