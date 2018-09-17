import stylefmt from 'gulp-stylefmt';

import settings from '../../config/lint/stylefmt';

/**
 * Lints given files with lint SASS.
 * @return {Promise} Gulp promise for proper task completion timing.
 */
module.exports = function() {
    return this.gulp.src( settings.src )
        .pipe( stylefmt() )
        .pipe( this.gulp.dest( settings.dest ) );
};
