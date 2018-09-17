/* eslint-env node */
import browserSync from 'browser-sync';

import environment from '../../environment';
import settings from '../../config/copy/assets';

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
                'copy:assets',
                browserSync.reload,
            ]
        );
    }

    return this.gulp.src( settings.src )
        .pipe( this.gulp.dest( settings.dest ) );
};
