/* eslint-env node */
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import browserSync from 'browser-sync';
import gulpif from 'gulp-if';
import cleanCSS from 'gulp-clean-css';

import environment from '../../environment';
import settings from '../../config/build/styles';
let firstRun = true;

/**
 * Returns task function for compiling components' Sass files.
 * This function does following things:
 * - Generate sourcemaps,
 * - Compile with SASS,
 * - Autroprefix,
 * - Minify with cleanCSS.
 *
 * @param {Gulp} gulp Gulp instance.
 * @param {object} environment Environment information object.
 * @param {string[]} packages Array of packages' paths.
 * @return {Promise} Promise used to properly time task execution completition.
 */
module.exports = function() {
    if ( firstRun && environment.watch === true ) {
        firstRun = false;
        this.gulp.watch(
            [
                settings.watch,
            ],
            [
                'build:styles',
                browserSync.reload,
            ]
        );
    }

    return this.gulp.src( settings.src )
        .pipe( gulpif( !environment.production, sourcemaps.init() ) )
        .pipe( sass( settings.sass )
            .on( 'error', sass.logError )
        )
        .pipe( postcss( settings.postcss, { grid: false } ) )
        .pipe( gulpif( environment.production, cleanCSS( settings.cleancss ) ) )
        .pipe( gulpif( !environment.production, sourcemaps.write( '.' ) ) )
        .pipe( this.gulp.dest( settings.dest ) );
};
