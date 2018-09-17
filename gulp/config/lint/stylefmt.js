/* eslint-env node */

/**
 * Settings for SASS linting fixing task.
 */
const settings = {
    src: [
        /**
         * Lint everything inside components and layouts directories.
         */
        'src/**/*.{css,scss,sass}',
        '!src/vendors/**/*.{css,scss,sass}',
    ],
    dest: 'src',
};

export default settings;
