const gulp = require('gulp');
const tslint = require('gulp-tslint');

const settings = require('../config/lintScripts')

/**
 * Task function for linting scripts
 */
module.exports = function lintScripts() {
    return gulp.src(settings.src)
        .pipe(tslint(settings.tslint))
        .pipe(tslint.report(settings.tslintReport))
        .pipe(gulp.dest(settings.dest));
};

