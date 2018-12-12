/**
 * Returns configuration for SVG sprites.
 */
export default {
    watch: [
        'view/adminhtml/src/images/sprites/*.svg',
    ],
    src: 'view/adminhtml/src/images/sprites/*.svg',
    dest: 'view/adminhtml/web/images/',
    /**
     * Gulp-svg-sprite configuration.
     * @see https://github.com/jkphl/gulp-svg-sprite#api
     */
    svgSprite: {
        mode: {
            css: false,
            view: false,
            symbol: false,
            defs: {
                dest: '',
                sprite: 'sprites.svg',
            },
            stack: false,
        },
    },
};
