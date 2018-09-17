import path from 'path';

/**
 * Returns configuration for SVG sprites.
 */
export default {
    watch: [
        'src/sprites/svg/*.svg',
    ],
    src: path.join( 'src', 'sprites/svg/*.svg' ),
    dest: path.join( 'dist', 'images/' ),
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
