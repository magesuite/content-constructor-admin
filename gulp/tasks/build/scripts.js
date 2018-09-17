/* eslint-env node */
/* eslint no-sync: 0 */
import { rollup } from 'rollup';
import util from 'gulp-util';
import path from 'path';
import browserSync from 'browser-sync';

import environment from '../../environment';
import settings from '../../config/build/scripts';

let firstRun = true;

module.exports = function() {
    if ( firstRun && environment.watch === true ) {
        firstRun = false;
        this.gulp.watch(
            [
                settings.watch,
            ],
            [
                'build:scripts',
                browserSync.reload,
            ]
        );
    }

    return rollup( settings.rollup ).then( ( bundle ) =>
        bundle.write( settings.bundle )
    ).catch( ( error ) => {
        return Promise.reject( error );
    } );
};
