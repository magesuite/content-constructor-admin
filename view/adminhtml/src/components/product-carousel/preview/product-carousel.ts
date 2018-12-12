/**
 * Single component information interface.
 */
interface IComponentInformation {
    category_id: string;
    sort_by: string;
    limit: number;
};

/**
 * Product carousel preview component.
 * This component is responsible for displaying preview of product carousel component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const productCarouselPreview: vuejs.ComponentOption = {
    template: `<div class="cc-product-carousel-preview">
        <svg class="cc-product-carousel-preview__arrow cc-product-carousel-preview__arrow--left">
            <use xlink:href="#icon_dashboard-arrow-left"></use>
        </svg>

        <ul class="cc-product-carousel-preview__list">
            <template v-for="item in 4">
                <li class="cc-product-carousel-preview__list-item">
                    <div class="cc-product-carousel-preview__product-wrapper">
                        <svg class="cc-product-carousel-preview__product">
                            <use xlink:href="#icon_component-cc-product-teaser-item"></use>
                        </svg>
                    </div>
                </li>
            </template>
        </ul>

        <svg class="cc-product-carousel-preview__arrow cc-product-carousel-preview__arrow--right">
            <use xlink:href="#icon_dashboard-arrow-right"></use>
        </svg>
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
        /**
         * Assets (icons) source path.
         */
        assetsSrc: {
            type: String,
            default: '',
        },
    },
};

export default productCarouselPreview;
