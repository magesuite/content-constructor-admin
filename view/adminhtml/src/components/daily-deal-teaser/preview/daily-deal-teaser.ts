import $ from 'jquery';

/**
 * Single component information interface.
 */
interface IComponentInformation {
    category_id: string;
    skus: string;
};

/**
 * Daily deal teaser preview component.
 * This component is responsible for displaying preview of daily deal teaser component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const dailyDealTeaserPreview: vuejs.ComponentOption = {
    template: `<div class="cc-daily-deal-teaser-preview">
        <div class="cc-daily-deal-teaser-preview__container">
            <div class="cc-daily-deal-teaser-preview__main">
                <div class="cc-daily-deal-teaser-preview__photo-mockup">
                    <svg class="cc-daily-deal-teaser-preview__cart-icon">
                        <use xlink:href="#cart" href="#cart"/>
                    </svg>
                </div>
                <div class="cc-daily-deal-teaser-preview__product-info">
                    <div class="cc-daily-deal-teaser-preview__product-info-container">
                        <p class="cc-daily-deal-teaser-preview__product-data" v-if="configuration.category_id">category ID: {{{ configuration.category_id }}}</p>
                        <p class="cc-daily-deal-teaser-preview__product-data" v-if="configuration.skus">SKU: {{{ configuration.skus }}}</p>
                    </div>
                    <div class="cc-daily-deal-teaser-preview__product-info-container">
                        <div class="cc-daily-deal-teaser-preview__countdown-mockup">
                            <div class="cc-daily-deal-teaser-preview__clock">
                                <svg class="cc-daily-deal-teaser-preview__clock-icon">
                                    <use xlink:href="#clock" href="#clock"/>
                                </svg>
                            </div>
                            <div>
                                <span class="cc-daily-deal-teaser-preview__countdown-digits">12</span> :
                                <span class="cc-daily-deal-teaser-preview__countdown-digits">34</span> :
                                <span class="cc-daily-deal-teaser-preview__countdown-digits">56</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cc-daily-deal-teaser-preview__buttons-mockup">
                <div class="cc-daily-deal-teaser-preview__button-mockup-1st"></div>
                <div class="cc-daily-deal-teaser-preview__button-mockup-2nd"></div>
                <div class="cc-daily-deal-teaser-preview__button-mockup-3rd"></div>
            </div>
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
        }
    },
};

export default dailyDealTeaserPreview;
