import $ from 'jquery';

/**
 * Single component information interface.
 */
interface IComponentInformation {
    category_id: string;
};

/**
 * Brand carousel preview component.
 * This component is responsible for displaying preview of brand carousel component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const brandCarouselPreview: vuejs.ComponentOption = {
    template: `<div class="cc-brand-carousel-preview">
        <svg class="cc-brand-carousel-preview__arrow cc-brand-carousel-preview__arrow--left">
            <use xlink:href="#icon_dashboard-arrow-left"></use>
        </svg>

        <ul class="cc-brand-carousel-preview__list">
            <template v-for="item in 6">
                <li class="cc-brand-carousel-preview__list-item">
                    <div class="cc-brand-carousel-preview__brand-wrapper">
                        <svg class="cc-brand-carousel-preview__brand">
                            <use xlink:href="#icon_component-cc-brand-logo"></use>
                        </svg>
                    </div>
                </li>
            </template>
        </ul>

        <svg class="cc-brand-carousel-preview__arrow cc-brand-carousel-preview__arrow--right">
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

export default brandCarouselPreview;
