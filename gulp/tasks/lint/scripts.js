/*eslint-env node */
import tslint from 'gulp-tslint';

import settings from '../../config/lint/scripts';

/**
 * Lints given files with eslint.
 * @return {Promise} Promise used to properly time task execution completion
 */
module.exports = function() {
    return this.gulp.src( settings.src )
        .pipe( tslint( settings.tslint ) )
        .pipe( tslint.report( settings.tslintReport ) )
        .pipe( this.gulp.dest( settings.dest ) );
};

