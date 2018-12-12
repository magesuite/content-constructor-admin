import $ from 'jquery';

/**
 * Separator preview component.
 * This component is responsible for displaying preview of separator component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const separatorPreview: vuejs.ComponentOption = {
    template: `<div class="cc-separator-preview">
        <hr class="cc-separator-preview__separator">
    </div>`,
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: [String, Object, Array],
            default: '',
        },
    },
};

export default separatorPreview;
