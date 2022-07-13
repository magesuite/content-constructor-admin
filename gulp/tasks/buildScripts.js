const gulp = require('gulp');
const { rollup } = require('rollup');

const environment = require('../environment');
const settings = require('../config/buildScripts');

// Indicate if we are running the task the first time in watch mode
let firstRun = true;

/**
 * Task function for building scripts
 */
module.exports = function buildScripts() {
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, buildScripts);
    }

    return rollup(settings.rollup).then(bundle =>
        bundle.write(settings.bundle)
    ).catch((error) => {
        return Promise.reject(error);
    });
};
