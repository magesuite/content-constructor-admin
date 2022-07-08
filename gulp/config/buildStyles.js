const autoprefixer = require('autoprefixer');
const flexbugs = require('postcss-flexbugs-fixes');
const reporter = require('postcss-reporter');
const stylelint = require('stylelint');

const environment = require('../environment');

/**
 * Config for building styles
 */
module.exports = {
    watch: 'view/adminhtml/src/**/*.{scss,sass,css}',
    src: [
        'view/adminhtml/src/*.{css,scss,sass}'
    ],
    dest: 'view/adminhtml/web/css',
    postcss: [
        flexbugs(),
        autoprefixer()
    ],
    cleancss: {},
    sass: {
        precision: 10,
        errLogToConsole: true
    },
    processors: [
        stylelint({
            syntax: 'scss'
        }),
        reporter({
            clearMessages: true,
            throwError: !environment.watch
        })
    ]
};
