const gulp = require('gulp');
const fse = require('fs-extra');
const glob = require('glob');
const log = require('fancy-log');
var path = require('path');

const environment = require('../environment');
const settings = require('../config/copyCustomComponents');

// Indicate if we are running the task the first time in watch mode
let firstRun = true;

module.exports = function copyCustomComponents() {
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, copyCustomComponents);
    }

    return glob(settings.sourcePath, function (err, folders) {
        if (err) {
            log.error(err);
        }

        if (folders.length > 0) {
            log.info('Custom content constructor components found.');

            folders.forEach(folder => {
                log.info(`Copying ${folder} directory`);

                fse.readdirSync(folder).forEach(element => {
                    const elementPath = path.join(folder, element);
                    const destinationPath = path.join(settings.destinationPath, element);
                    const isDirectory =  fse.lstatSync(elementPath).isDirectory();

                    if (isDirectory) {
                        fse.copySync(elementPath, destinationPath, { overwrite: true }, function (err) {
                            if (err) {
                                log.error(err);
                            }
                        });
                    } else {
                        if (path.extname(element) === '.scss') {
                            if (fse.existsSync(destinationPath)) {
                                const existingContent = fse.readFileSync(destinationPath, {encoding: 'utf8'});
                                const newContent = fse.readFileSync(elementPath, {encoding: 'utf8'});

                                fse.writeFileSync(destinationPath, existingContent + newContent, 'utf8', {encoding: 'utf8'});
                            } else {
                                fse.copyFileSync(elementPath, destinationPath);
                            }
                        } else if (path.extname(element) === '.ts') {
                            if (fse.existsSync(destinationPath)) {
                                const existingContent = fse.readFileSync(destinationPath, {encoding: 'utf8'});
                                const newContent = fse.readFileSync(elementPath, {encoding: 'utf8'});

                                let imports = newContent.split('export const customComponentsConfigurator = {')[0];

                                let configuratorImports = newContent.split('export const customComponentsConfigurator = {')[1];
                                configuratorImports = configuratorImports.split('};')[0];

                                let previewImports = newContent.split('export const customComponentsPreview = {')[1];
                                previewImports = previewImports.split('};')[0];

                                let combinedContent = existingContent.split('export const customComponentsConfigurator = {');
                                combinedContent = imports + combinedContent[0] + 'export const customComponentsConfigurator = {' + configuratorImports + combinedContent[1];
                                combinedContent = combinedContent.split('export const customComponentsPreview = {');
                                combinedContent = combinedContent[0] + 'export const customComponentsPreview = {' + previewImports + combinedContent[1];

                                fse.writeFileSync(destinationPath, combinedContent, 'utf8', {encoding: 'utf8'});
                            } else {
                                fse.copyFileSync(elementPath, destinationPath);
                            }
                        } else {
                            fse.copyFileSync(elementPath, destinationPath);
                        }
                    }
                });
            });
        } else {
            log.info('Custom content-constructor-components not found. Copying default entries instead...');

            fse.copySync(settings.defaultPath, settings.destinationPath, { overwrite: true }, function (err) {
                if (err) {
                    log.error(err);
                }
            });
        }
    });
};
