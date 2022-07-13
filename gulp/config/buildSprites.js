/**
 * Config for building SVG sprites
 */
module.exports = {
    watch: 'view/adminhtml/src/**/*.svg',
    src: [
        'view/adminhtml/src/images/sprites/*.svg',
        'view/adminhtml/src/custom-components/images/*.svg'
    ],
    dest: 'view/adminhtml/web/images/',
    /**
     * Gulp-svg-sprite configuration.
     * @see https://github.com/jkphl/gulp-svg-sprite#api
     */
    svgSprite: {
        mode: {
            css: false,
            view: false,
            defs: {
                dest: '',
                sprite: 'sprites.svg'
            },
            symbol: false,
            stack: false
        }
    }
};
