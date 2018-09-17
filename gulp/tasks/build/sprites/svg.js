/*eslint-env node */

import browserSync from 'browser-sync';
import svgSprite from 'gulp-svg-sprite';
import util from 'gulp-util';
import path from 'path';

import environment from '../../../environment';
import settings from '../../../config/build/sprites/svg';

let firstRun = true;

module.exports = function() {
    if ( firstRun && environment.watch === true ) {
        firstRun = false;
        this.gulp.watch(
            [
                settings.watch,
            ],
            [
                'build:sprites:svg',
                browserSync.reload,
            ]
        );
    }


    return this.gulp.src( settings.src )
        .pipe( svgSprite( settings.svgSprite ) )
        .on( 'error', function( error ) {
            if ( environment.watch ) {
                util.log( error.message );
                this.emit( 'end' );
            } else {
                throw error;
            }
        } )
        .pipe( this.gulp.dest( settings.dest ) );
};

