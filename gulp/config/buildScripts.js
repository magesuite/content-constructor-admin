const typescript = require('rollup-plugin-typescript');
const html = require('rollup-plugin-html');
const commonjs = require('rollup-plugin-commonjs');
const globals = require('rollup-plugin-node-globals');
const { terser } = require('rollup-plugin-terser');
const alias = require('@rollup/plugin-alias');
const path = require('path');
const log = require('fancy-log');

const environment = require('../environment');

let cache;

/**
 * Config for building scripts
 */
module.exports = {
    watch: 'view/adminhtml/src/**/*.ts',
    /**
     * Rollup configuration
     * @see https://rollupjs.org/guide/en/#rolluprollup
     */
    rollup: {
        input: 'view/adminhtml/src/content-constructor.ts',
        cache: cache,
        external: [
            'jquery',
            'Magento_Ui/js/modal/alert',
            'Magento_Ui/js/modal/modal',
            'Magento_Ui/js/modal/confirm',
            'mage/translate',
            'loadingPopup',
            'uiRegistry',
            'VueResource',
            'Vue'
        ],
        plugins: [
            /**
             * Rollup typescript plugin configuration.
             * @see https://github.com/rollup/rollup-plugin-typescript
             */
            typescript(),
            commonjs(),
            globals(),
            html({
                // Required to be specified
                include: '**/*.{phtml,html,tpl}',
                // htmlMinifierOptions: {
                //     collapseWhitespace: true,
                //     conservativeCollapse: true,
                // },
            } ),
            ...(environment.production ? [terser()] : []),
            alias({
                entries: {
                    'components': path.resolve('view/adminhtml/src/components')
                }
            })
        ],
        onwarn: message => {
            // Log rollup messages
            if (!environment.production) {
                log(message);
            }
        }
    },
    bundle: {
        output: {
            file: 'view/adminhtml/web/js/content-constructor.js',
            format: 'umd',
            name: 'contentConstructor',
            amd: {
                id: 'contentConstructor'
            },
            globals: {
                'jquery': 'jquery',
                '$': 'jquery',
                'Vue': 'Vue',
                'VueResource': 'VueResource',
                'mage/translate': 'mage/translate',
                'Magento_Ui/js/modal/modal': 'Magento_Ui/js/modal/modal',
                'Magento_Ui/js/modal/confirm': 'Magento_Ui/js/modal/confirm',
                'Magento_Ui/js/modal/alert': 'Magento_Ui/js/modal/alert',
                'uiRegistry': 'uiRegistry'
            }
        },
        sourceMap: true
    }
}
