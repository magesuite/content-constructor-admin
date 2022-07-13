const reporter = require('postcss-reporter');
const stylelint = require('stylelint');

const environment = require('../environment');

/**
 * Config for linting styles task
 */
module.exports = {
    src: 'view/adminhtml/src/**/*.{css,scss,sass}',
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
