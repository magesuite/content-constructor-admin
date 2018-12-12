/**
 * Single component information interface.
 */
interface IComponentInformation {
    title: string;
    markup: string;
}

/**
 * Custom html preview component.
 * This component is responsible for displaying preview of custom-html component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 *
 */
const customHtmlPreview: vuejs.ComponentOption = {
    template: `<div class="cc-custom-html-preview">
        <div class="cc-custom-html-preview__content">
            <svg class="cc-custom-html-preview__bg">
                <use xlink:href="#icon_component-custom-html-bg"></use>
            </svg>
            <h2 class="cc-custom-html-preview__title">{{ configuration.title }}</h2>
        </div>
    </div>`,
    props: {
        /**
         * Single's component configuration
         */
        configuration: {
            type: Object,
        },
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: [String, Object, Array],
            default: '',
        },
    },
};

export default customHtmlPreview;
