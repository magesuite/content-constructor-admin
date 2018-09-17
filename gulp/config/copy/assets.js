import path from 'path';

/**
 * Returns configuration for copying assets that don't need any processing.
 */
export default {
    watch: [
        // Images
        'src/**/*.{gif,png,jpg,webp,svg}',
        '!src/sprites/**/*.{png,svg}',
        // Fonts
        'src/**/*.{ttf,woff,woff2,eot}',
        // JSON
        'src/**/*.json',
        '!src/**/*.data.json',
        // JavaScript and CSS from vendors directory
        'src/vendors/**/*.{js,css}',
    ],

    src: [
        // Images
        path.join( 'src', '**/*.{gif,png,jpg,webp,svg}' ),
        '!' + path.join( 'src/sprites', '**/*.{png,svg}' ),
        // Fonts
        path.join( 'src', '**/*.{ttf,woff,woff2,eot}' ),
        // JSON
        path.join('src', '**/*.json' ),
        '!' + path.join( 'src', '**/*.data.json' ),
    ],
    dest: 'dist',
};
