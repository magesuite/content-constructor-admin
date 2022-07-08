const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const gulpif = require('gulp-if');
const cleanCSS = require('gulp-clean-css');

const environment = require('../environment');
const settings = require('../config/buildStyles');

// Indicate if we are running the task the first time in watch mode
let firstRun = true;

/**
 * Task function for building styles
 */
module.exports = function buildStyles() {
    if (firstRun && environment.watch === true) {
        firstRun = false;
        gulp.watch(settings.watch, buildStyles);
    }

    return gulp.src(settings.src)
        .pipe(gulpif(!environment.production, sourcemaps.init()))
        .pipe(sass(settings.sass)
            .on('error', sass.logError)
        )
        .pipe(postcss(settings.postcss, {
            grid: false
        }))
        .pipe(gulpif(environment.production, cleanCSS(settings.cleancss)))
        .pipe(gulpif(!environment.production, sourcemaps.write('.')))
        .pipe(gulp.dest(settings.dest));
};
