import environment from '../../environment';

/**
 * Settingf for TypeScript linting task.
 * @type {Object}
 */
export default {
    src: [
        /**
         * Lint all TypeScript files.
         */
        'view/adminhtml/src/**/*.ts',
    ],
    dest: 'view/adminhtml/web/src',
    tslint: {
        formatter: 'verbose',
        fix: true,
    },
    tslintReport: {
        emitError: !environment.watch,
        summarizeFailureOutput: true,
    },
};
