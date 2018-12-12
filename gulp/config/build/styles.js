import path from 'path';
import autoprefixer from 'autoprefixer';
import flexbugs from 'postcss-flexbugs-fixes';

/**
 * Returns information for styles building.
 * @returns {object} Styles building task information.
 */
export default {
    watch: [
        'view/adminhtml/src/*.{scss,sass,css}',
        'view/adminhtml/src/vendors/**/*.{scss,sass,css}',
    ],
    /**
     * Generates configuration for styles building based on package directory path.
     * @param {string} packageDir Path to the package directory.
     * @returns {object} Styles building task configuration.
     */

    src: [
        'view/adminhtml/src/*.{css,scss,sass}',
        'view/adminhtml/src/vendors/**/*.{css,scss,sass}',
    ],
    dest: 'view/adminhtml/web/css',
    postcss: [
        flexbugs(),
        autoprefixer(
            {
                browsers: [
                    'IE>=10',
                    '>1%',
                    'last 2 versions',
                ],
            }
        ),
    ],
    cleancss: {},
    sass: {
        precision: 10,
        errLogToConsole: true,
    },
};
