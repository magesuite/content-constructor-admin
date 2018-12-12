import path from 'path';

/**
 * Returns configuration for copying assets that don't need any processing.
 */
export default {
    watch: 'view/adminhtml/src/components/**/*.{twig,phtml,tpl,html}',
    src: 'view/adminhtml/src/components/**/*.{twig,phtml,tpl,html}',
    dest: 'view/adminhtml/templates/components',
};
