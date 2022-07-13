const gulp = require('gulp');
const scss = require('postcss-scss');
const postcss = require('gulp-postcss');

const settings = require('../config/lintStyles');

/**
 * Task function for linting styles
 */
module.exports = function lintStyles() {
    return gulp.src(settings.src)
        .pipe(postcss(settings.processors, {
            syntax: scss
        }));
};
