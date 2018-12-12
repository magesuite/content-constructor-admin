import path from 'path';
import typescript from 'rollup-plugin-typescript';
import html from 'rollup-plugin-html';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import uglify from 'rollup-plugin-uglify';
import util from 'gulp-util';

import environment from '../../environment';

let cache;

/**
 * Returns information for scripts building.
 */
export default {
    /**
     * Paths to watch for this task.
     */
    watch: [
        'view/adminhtml/src/**/*.ts',
        'view/adminhtml/src/**/*.{phtml,html,tpl}',
    ],

    /**
     * Rollup configuration.
     * @see https://github.com/rollup/rollup/wiki/JavaScript-API#bundlegenerate-options-
     */
    rollup: {
        entry: path.join( 'view/adminhtml/src', 'content-constructor.ts' ),
        cache: cache,
        plugins: [
            /**
             * Rollup typescript plugin configuration.
             * @see https://github.com/rollup/rollup-plugin-typescript
             */
            typescript(),
            commonjs(),
            globals(),
            html( {
                // Required to be specified
                include: '**/*.{phtml,html,tpl}',
                // htmlMinifierOptions: {
                //     collapseWhitespace: true,
                //     conservativeCollapse: true,
                // },
            } ),
            ...(environment.production ? [uglify()] : []),
        ],
        onwarn: ( message ) => {
            // Log rollup messages only if "--verbose" flag was used.
            if ( util.env.verbose ) {
                util.log( message );
            }
        },
    },
    bundle: {
        /**
         * JavaScript bundle destination directory.
         */
        dest: path.join( 'view/adminhtml/web/js', 'content-constructor.js' ),
        format: 'umd',
        moduleName: 'contentConstructor',
        amd: {
            id: 'contentConstructor',
        },
        globals: {
            'jQuery': 'jQuery',
            'jquery': 'jQuery',
            '$': 'jQuery',
            'Swiper': 'Swiper',
            'Vue': 'Vue',
        },
        sourceMap: true,
    },
};
