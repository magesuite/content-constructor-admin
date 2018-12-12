/**
 * Single component information interface.
 */
interface IComponentInformation {
    identifier: string;
    title: string;
    resetstyles: boolean;
}

/**
 * CMS block preview component.
 * This component is responsible for displaying preview of CMS block component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const staticBlockPreview: vuejs.ComponentOption = {
    template: `<div class="cc-static-block-preview">
        <div class="cc-static-block-preview__content">
            <svg class="cc-static-block-preview__bg">
                <use xlink:href="#icon_component-cms-block-preview"></use>
            </svg>
            <h2 class="cc-static-block-preview__title">{{ configuration.title }}</h2>
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

export default staticBlockPreview;
