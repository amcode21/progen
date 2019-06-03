'use strict';

const fs = require('fs');
const path = require('path');

const buildFileFromJSON = (directoryPath, file, callback) => {
    const filePath = path.join(directoryPath, file.name);

    fs.open(filePath, 'w', (err) => {
        if (err) return callback(err);

        console.log('Created file:', filePath);

        if (file.contents) {
            fs.writeFile(filePath, file.contents, 'utf8', (err) => {
                if (err) return callback(err);

                return callback(null)
            });
        }
    });
};

const buildDirectoryFromJSON = (directoryPath, directory, callback) => {
    const dirPath = path.join(directoryPath, directory.name);

    fs.mkdir(dirPath, (err) => {
        if (err) return callback(err);

        console.log('Created directory:', dirPath);

        if (directory.contents) {
            const dirsInside = [];

            directory.contents.forEach((item) => {
                if (item.type === 'folder') {
                    dirsInside.push(item);
                }
                else if (item.type === 'file') {
                    buildFileFromJSON(dirPath, item, (err) => {
                        if (err) return callback(err);
                    });
                }
            });

            if (dirsInside.length > 0) {
                dirsInside.forEach((dir) => buildDirectoryFromJSON(dirPath, dir, callback));
            }   
            else {
                return callback(null);
            }         
        }
    });
};

module.exports = buildDirectoryFromJSON;