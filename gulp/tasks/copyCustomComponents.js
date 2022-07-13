const fse = require('fs-extra');
const glob = require('glob');
const log = require('fancy-log');

const settings = require('../config/copyCustomComponents');

module.exports = function copyCustomComponents() {
    return glob(settings.sourcePath, function (err, files) {
        if (err) {
            log.error(err);
        }

        if (files.length && files.length === 1) {
            log.info('Custom content constructor components found. Copying...');

            files.forEach(file => {
                fse.copySync(file, settings.destinationPath, { overwrite: true }, function (err) {
                    if (err) {
                        log.error(err);
                    }
                });
            });
        } else {
            if (files.length > 1) {
                log.error('Found more content-constructor-components. Only one entry is allowed.')
            }

            if (files.length === 0) {
                log.error('Custom content-constructor-components not found.')
            }

            log.info('Copying default entries instead...');

            fse.copySync(settings.defaultPath, settings.destinationPath, { overwrite: true }, function (err) {
                if (err) {
                    log.error(err);
                }
            });
        }
    });
};
