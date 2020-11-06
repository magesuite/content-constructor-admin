/**
 * Single component information interface.
 */
interface IComponentInformation {
    sku: string;
};

/**
 * Product teaser preview component.
 * This component is responsible for displaying preview of product teaser component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const productTeaserPreview: vuejs.ComponentOption = {
    template: `<div class="cc-product-teaser-preview">
        <div class="cc-product-teaser-preview__icon-wrapper">
            <svg class="cc-product-teaser-preview__icon">
                <use xlink:href="#icon_component-product-teaser-preview"></use>
            </svg>
        </div>
    </div>`,
    props: {
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

export default productTeaserPreview;
