const environment = require('../environment');

/**
 * Config for linting scripts task
 */
module.exports = {
    src: 'view/adminhtml/src/**/*.ts',
    dest: 'view/adminhtml/src',
    tslint: {
        formatter: 'verbose',
        fix: true
    },
    tslintReport: {
        emitError: !environment.watch,
        summarizeFailureOutput: true
    }
};
