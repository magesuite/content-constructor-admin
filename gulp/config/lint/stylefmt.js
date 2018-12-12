/* eslint-env node */

/**
 * Settings for SASS linting fixing task.
 */
const settings = {
    src: [
        /**
         * Lint everything inside components and layouts directories.
         */
        'view/adminhtml/src/**/*.{css,scss,sass}',
        '!view/adminhtml/src/vendors/**/*.{css,scss,sass}',
    ],
    dest: 'view/adminhtml/web/src',
};

export default settings;
