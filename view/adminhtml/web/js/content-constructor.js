(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery'), require('Vue'), require('VueResource'), require('loadingPopup'), require('mage/translate'), require('Magento_Ui/js/modal/modal'), require('Magento_Ui/js/modal/alert'), require('uiRegistry'), require('Magento_Ui/js/modal/confirm')) :
	typeof define === 'function' && define.amd ? define('contentConstructor', ['jquery', 'Vue', 'VueResource', 'loadingPopup', 'mage/translate', 'Magento_Ui/js/modal/modal', 'Magento_Ui/js/modal/alert', 'uiRegistry', 'Magento_Ui/js/modal/confirm'], factory) :
	(global.contentConstructor = factory(global.jQuery,global.Vue,global.vr,null,global.$t,global.modal,global.alert,global.uiRegistry,global.confirm));
}(this, (function ($,Vue,vr,loadingPopup,$t,modal,alert,uiRegistry,confirm) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
vr = vr && vr.hasOwnProperty('default') ? vr['default'] : vr;
$t = $t && $t.hasOwnProperty('default') ? $t['default'] : $t;
modal = modal && modal.hasOwnProperty('default') ? modal['default'] : modal;
alert = alert && alert.hasOwnProperty('default') ? alert['default'] : alert;
uiRegistry = uiRegistry && uiRegistry.hasOwnProperty('default') ? uiRegistry['default'] : uiRegistry;
confirm = confirm && confirm.hasOwnProperty('default') ? confirm['default'] : confirm;

/**
 * Componen picker.
 * Lists all types of components available in m2c in the grid/list mode
 * @type {vuejs.ComponentOption} Vue component object.
 */
var componentPicker = {
    template: "<section class=\"cc-component-picker | {{ class }}\">\n        <ul class=\"cc-component-picker__list\" v-if=\"availableComponents.length\">\n            <li class=\"cc-component-picker__list-item cc-component-picker__list-item--{{component.type}}\" v-for=\"component in availableComponents\">\n                <a class=\"cc-component-picker__component-link\" href=\"#\" @click.prevent=\"onPickComponent( component.type )\">\n                    <span class=\"cc-component-picker__component-figure\">\n                        <svg class=\"cc-component-picker__component-icon\">\n                            <use v-bind=\"{ 'xlink:href': '#icon_component-' + component.type }\"></use>\n                        </svg>\n                    </span>\n                    <span class=\"cc-component-picker__component-name\">{{ component.name }}</span>\n                    <span class=\"cc-component-picker__component-description\">{{ component.description }}</span>\n                </a>\n            </li>\n        </ul>\n        <p class=\"cc-component-picker__no-components\" v-if=\"!availableComponents.length\">\n            No components available.\n        </p>\n    </section>",
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: String,
            default: '',
            coerce: function (value) { return value.replace('cc-component-picker', ''); },
        },
        /**
         * Property containing callback triggered when user picks component.
         */
        pickComponent: {
            type: Function,
        },
        /**
         * JSON stringified array containing available components.
         */
        components: {
            type: String,
            default: '',
        },
        /**
         * URL for API returning JSON stringified array containing available components.
         */
        componentsEndpoint: {
            type: String,
            default: '',
        },
        /**
         * Assets src for icon
         */
        assetsSrc: {
            type: String,
            default: '',
        },
    },
    data: function () {
        return {
            availableComponents: [],
        };
    },
    ready: function () {
        // If inline JSON is provided then parse it.
        if (this.components) {
            this.availableComponents = JSON.parse(this.components);
        }
        else if (this.componentsEndpoint) {
            // Otherwise load from endpoint if URL provided.
            this.$http.get(this.componentsEndpoint).then(function (response) {
                this.availableComponents = response.json();
            });
        }
    },
    methods: {
        /**
         * Component pick click handler.
         * This handler triggers "cc-component-picker__pick" event up the DOM chain when called.
         * @param {Event} event Click event object.
         */
        onPickComponent: function (componentType) {
            this.$dispatch('component-picker__pick', componentType);
            if (typeof this.pickComponent === 'function') {
                this.pickComponent(componentType);
            }
        },
    },
};

/**
 * Action button component version.
 * Small component that allows to set it's content.
 *
 * @type {vuejs.ComponentOption} Vue component object.
 */
var actionButton = {
    template: "<button class=\"cc-action-button {{ class }}\" @click=\"_onClick\">\n        <slot></slot>\n    </button>",
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: [String, Object, Array],
            default: '',
        },
    },
    methods: {
        /**
         * Button click handler.
         * This handler triggers "action-button__click" event up the DOM chain when called.
         * @param {Event} event Click event object.
         */
        _onClick: function (event) {
            this.$dispatch('action-button__click', event);
        },
    },
};

/**
 * Component actions component.
 * This component is responsible for displaying and handling user interactions of
 * side utility navigation for each component that supports:
 * - Moving component up,
 * - Moving component down,
 * - Opening component settings,
 * - Deleting component.
 *
 * @type {vuejs.ComponentOption} Vue component object.
 */
var componentActions = {
    template: "<aside class=\"cc-component-actions | {{ class }}\">\n        <div class=\"cc-component-actions__buttons\">\n            <slot name=\"cc-component-actions__buttons\"></slot>\n        </div>\n    </aside>",
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: String,
            default: '',
            coerce: function (value) { return value.replace('cc-component-actions', ''); },
        },
    },
};

/**
 * Component controller component.
 * This component is responsible for displaying annd handling component adding button
 * @type {vuejs.ComponentOption} Vue component object.
 */
var componentAdder = {
    template: "<div class=\"cc-component-adder {{ class }}\">\n        <div class=\"cc-component-adder__button-wrapper\" @click=\"onCreateComponent\">\n            <slot></slot>\n        </div>\n        <span class=\"cc-component-adder__dashline\"></span>\n    </div>",
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: String,
            default: '',
            coerce: function (value) {
                return value.replace('cc-component-adder', '');
            },
        },
        /**
         * Property containing callback triggered when user clicks "add component" button.
         */
        createComponent: {
            type: Function,
        },
    },
    methods: {
        /**
         * "Add component" button click handler.
         * This handler triggers "cc-component-adder__create-component" event up the DOM chain when called.
         * @param {Event} event Click event object.
         */
        onCreateComponent: function (event) {
            this.$dispatch('component-adder__create-component', event);
            if (typeof this.createComponent === 'function') {
                this.createComponent(event);
            }
        },
    },
};

/**
 * CC components display switcher.
 * This component is responsible for collecting input about display of given component on the FE side
 * it determines whether component should be shown on mobile, desktop, both or shouldn't be shown at all
 * @type {vuejs.ComponentOption} Vue component object.
 */
var componentDisplayController = {
    template: "<div class=\"cc-component-display-controller {{ class }}\">\n        <div class=\"cc-component-display-controller__content\">\n            <slot></slot>\n        </div>\n    </div>",
};

/**
 * Component placeholder component.
 */
var componentPlaceholder = {
    template: "<div class=\"cc-component-placeholder\">\n        <div class=\"cc-component-placeholder__content\">\n            <slot></slot>\n        </div>\n    </div>",
};

/**
 * Brand carousel preview component.
 * This component is responsible for displaying preview of brand carousel component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var brandCarouselPreview = {
    template: "<div class=\"cc-brand-carousel-preview\">\n        <svg class=\"cc-brand-carousel-preview__arrow cc-brand-carousel-preview__arrow--left\">\n            <use xlink:href=\"#icon_dashboard-arrow-left\"></use>\n        </svg>\n\n        <ul class=\"cc-brand-carousel-preview__list\">\n            <template v-for=\"item in 6\">\n                <li class=\"cc-brand-carousel-preview__list-item\">\n                    <div class=\"cc-brand-carousel-preview__brand-wrapper\">\n                        <svg class=\"cc-brand-carousel-preview__brand\">\n                            <use xlink:href=\"#icon_component-cc-brand-logo\"></use>\n                        </svg>\n                    </div>\n                </li>\n            </template>\n        </ul>\n\n        <svg class=\"cc-brand-carousel-preview__arrow cc-brand-carousel-preview__arrow--right\">\n            <use xlink:href=\"#icon_dashboard-arrow-right\"></use>\n        </svg>\n    </div>",
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

/**
 * Button preview component.
 * This component is responsible for displaying preview of button component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var buttonPreview = {
    template: "<div class=\"cc-button-preview\">\n        <button class=\"cc-button-preview__button\" type=\"button\">{{ configuration.label }}</button>\n    </div>",
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

/**
 * Brand carousel preview component.
 * This component is responsible for displaying preview of brand carousel component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var categoryLinksPreview = {
    template: "<div class=\"cc-category-links-preview\">\n        <div class=\"cc-category-links-preview__wrapper\">\n            <h1 class=\"cc-category-links-preview__headline\">{{ configuration.main_category_labels[0] }}</h1>\n            <div class=\"cc-category-links-preview__content\">\n                <ul class=\"cc-category-links-preview__subcats\">\n                    <template v-for=\"(index, label) in configuration.sub_categories_labels\">\n                        <li class=\"cc-category-links-preview__subcat\" v-if=\"index < configuration.sub_categories_labels.length\">\n                            <span class=\"cc-category-links-preview__subcat-label\">{{ label }}</span>\n                        </li>\n                    </template>\n                </ul>\n\n                <div class=\"cc-category-links-preview__all-button\">\n                    <span class=\"cc-category-links-preview__all-button-text\">" + $t('All products') + "</span>\n                </div>\n            </div>\n        </div>\n    </div>",
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

/**
 * CMS teaser preview component.
 * This component is responsible for displaying preview of CMS teaser component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var cmsPagesTeaserPreview = {
    template: "<div class=\"cc-cms-pages-teaser-preview\">\n        <div class=\"cc-cms-pages-teaser-preview__wrapper\">\n            <ul class=\"cc-component-placeholder__pills\">\n                <li class=\"cc-component-placeholder__pill cc-component-placeholder__pill--clean\">\n                    <span class=\"cc-component-placeholder__pill-label\"><strong>" + $t('Tags') + ":</strong></span>\n                </li>\n                <li class=\"cc-component-placeholder__pill\" v-for=\"tag in getTagsArray()\">\n                    <span class=\"cc-component-placeholder__pill-label\">{{ tag }}</span>\n                </li>\n            </ul>\n            <ul class=\"cc-cms-pages-teaser-preview__scene\" v-el:scene>\n                <li class=\"cc-cms-pages-teaser-preview__item\" v-for=\"(n, index) in 4\">\n                    <div class=\"cc-cms-pages-teaser-preview__teaser-wrapper\">\n                        <svg class=\"cc-cms-pages-teaser-preview__teaser\">\n                            <use xlink:href=\"#icon_cms-teaser-placeholder\"></use>\n                        </svg>\n                    </div>\n                </li>\n            </ul>\n            <ul class=\"cc-component-placeholder__pills cc-component-placeholder__pills--on-bottom\">\n                <li class=\"cc-component-placeholder__pill\">\n                    <span class=\"cc-component-placeholder__pill-label\">" + $t('Teasers limit') + ": <strong>{{ configuration.limit }}</strong></span>\n                </li>\n                <li class=\"cc-component-placeholder__pill\">\n                    <span class=\"cc-component-placeholder__pill-label\">" + $t('Desktop layout') + ": <strong>{{ configuration.currentScenario.desktopLayout.id }} " + $t('teasers per row') + "</strong></span>\n                </li>\n                <li class=\"cc-component-placeholder__pill\">\n                    <span class=\"cc-component-placeholder__pill-label\">" + $t('Mobile layout') + ": <strong>{{ configuration.currentScenario.mobileLayout.id }}</strong></span>\n                </li>\n            </ul>\n        </div>\n    </div>",
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
    methods: {
        getTagsArray: function () {
            return this.configuration.tags.split(',');
        }
    },
};

/**
 * Custom html preview component.
 * This component is responsible for displaying preview of custom-html component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 *
 */
var customHtmlPreview = {
    template: "<div class=\"cc-custom-html-preview\">\n        <div class=\"cc-custom-html-preview__content\">\n            <svg class=\"cc-custom-html-preview__bg\">\n                <use xlink:href=\"#icon_component-custom-html-bg\"></use>\n            </svg>\n            <h2 class=\"cc-custom-html-preview__title\">{{ configuration.title }}</h2>\n        </div>\n    </div>",
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

/**
 * Daily deal teaser preview component.
 * This component is responsible for displaying preview of daily deal teaser component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var dailyDealTeaserPreview = {
    template: "<div class=\"cc-daily-deal-teaser-preview\">\n        <div class=\"cc-daily-deal-teaser-preview__container\">\n            <div class=\"cc-daily-deal-teaser-preview__main\">\n                <div class=\"cc-daily-deal-teaser-preview__photo-mockup\">\n                    <svg class=\"cc-daily-deal-teaser-preview__cart-icon\">\n                        <use xlink:href=\"#cart\" href=\"#cart\"/>\n                    </svg>\n                </div>\n                <div class=\"cc-daily-deal-teaser-preview__product-info\">\n                    <div class=\"cc-daily-deal-teaser-preview__product-info-container\">\n                        <p class=\"cc-daily-deal-teaser-preview__product-data\" v-if=\"configuration.category_id\">category ID: {{{ configuration.category_id }}}</p>\n                        <p class=\"cc-daily-deal-teaser-preview__product-data\" v-if=\"configuration.skus\">SKU: {{{ configuration.skus }}}</p>\n                    </div>\n                    <div class=\"cc-daily-deal-teaser-preview__product-info-container\">                    \n                        <div class=\"cc-daily-deal-teaser-preview__countdown-mockup\">\n                            <div class=\"cc-daily-deal-teaser-preview__clock\">\n                                <svg class=\"cc-daily-deal-teaser-preview__clock-icon\">\n                                    <use xlink:href=\"#clock\" href=\"#clock\"/>\n                                </svg>\n                            </div>\n                            <div>\n                                <span class=\"cc-daily-deal-teaser-preview__countdown-digits\">12</span> :\n                                <span class=\"cc-daily-deal-teaser-preview__countdown-digits\">34</span> :\n                                <span class=\"cc-daily-deal-teaser-preview__countdown-digits\">56</span>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"cc-daily-deal-teaser-preview__buttons-mockup\">\n                <div class=\"cc-daily-deal-teaser-preview__button-mockup-1st\"></div>\n                <div class=\"cc-daily-deal-teaser-preview__button-mockup-2nd\"></div>\n                <div class=\"cc-daily-deal-teaser-preview__button-mockup-3rd\"></div>\n            </div>\n        </div>\n    </div>",
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

/**
 * Headline preview component.
 * This component is responsible for displaying preview of headline component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var headlinePreview = {
    template: "<div class=\"cc-headline-preview\">\n        <h1 class=\"cc-headline-preview__headline\">{{ configuration.title }}</h1>\n        <h2 class=\"cc-headline-preview__subheadline\">{{ configuration.subtitle }}</h2>\n    </div>",
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

/**
 * Image teaser preview component.
 * This component is responsible for displaying preview of image teaser component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var heroCarouselPreview = {
    template: "<div data-role=\"spinner\" class=\"cc-component-placeholder__loading\" v-show=\"isLoading\">\n        <div class=\"spinner\">\n            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>\n        </div>\n    </div>\n    <div class=\"cc-hero-carousel-preview\" v-show=\"!isLoading\">\n        <div v-bind:class=\"sceneClass\" v-el:scene>\n            <div class=\"cc-hero-carousel-preview__slide\" v-if=\"configuration.items.length > 1\">\n                <img v-if=\"configuration.items[configuration.items.length - 1].image\" :src=\"configuration.items[configuration.items.length - 1].image\" class=\"cc-hero-carousel-preview__image\">\n                <div class=\"cc-hero-carousel-preview__slide-placeholder-wrapper\" v-show=\"!configuration.items[configuration.items.length - 1].image\">\n                    <svg class=\"cc-hero-carousel-preview__slide-placeholder\">\n                        <use xlink:href=\"#icon_image-placeholder\"></use>\n                    </svg>\n                </div>\n            </div>\n\n            <template v-for=\"(index, item) in configuration.items\">\n                <div class=\"cc-hero-carousel-preview__slide\" v-if=\"index < 2\">\n                    <img v-if=\"configuration.items[$index].image\" :src=\"configuration.items[$index].image\" class=\"cc-hero-carousel-preview__image\">\n                    <div class=\"cc-hero-carousel-preview__slide-placeholder-wrapper\" v-show=\"!configuration.items[$index].image\">\n                        <svg class=\"cc-hero-carousel-preview__slide-placeholder\">\n                            <use xlink:href=\"#icon_image-placeholder\"></use>\n                        </svg>\n                    </div>\n                    <div class=\"cc-hero-carousel-preview__slide-content\" v-if=\"index == 0 || configuration.items.length == 1\">\n                        <div class=\"cc-hero-carousel-preview__thumbs\">\n                            <template v-for=\"(idx, slide) in configuration.items\">\n                                <img v-if=\"configuration.items[idx].image\" :src=\"configuration.items[idx].image\" class=\"cc-hero-carousel-preview__thumb\">\n                                <div class=\"cc-hero-carousel-preview__thumb-placeholder-wrapper\" v-show=\"!configuration.items[idx].image\">\n                                    <svg class=\"cc-hero-carousel-preview__thumb-placeholder\">\n                                        <use xlink:href=\"#icon_image-placeholder\"></use>\n                                    </svg>\n                                </div>\n                            </template>\n                        </div>\n                        <div class=\"cc-hero-carousel-preview__slide-content-info\">\n                            <h2 class=\"cc-hero-carousel-preview__headline\" v-if=\"configuration.items[$index].headline\">{{ configuration.items[$index].headline }}</h2>\n                            <h3 class=\"cc-hero-carousel-preview__subheadline\" v-if=\"configuration.items[$index].subheadline\">{{ configuration.items[$index].subheadline }}</h3>\n                            <p class=\"cc-hero-carousel-preview__paragraph\" v-if=\"configuration.items[$index].paragraph\">{{ configuration.items[$index].paragraph }}</p>\n                            <template v-if=\"configuration.items[$index].href\">\n                                <button type=\"button\" class=\"cc-hero-carousel-preview__button\" v-if=\"configuration.items[$index].ctaLabel\">{{ configuration.items[$index].ctaLabel }}</button>\n                            </template>\n                        </div>\n                    </div>\n                </div>\n            </template>\n        </div>\n    </div>",
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
        isLoading: {
            type: Boolean,
            default: true,
        }
    },
    ready: function () {
        this.setImagesLoadListener();
        this.hideEmptySlideContents();
    },
    computed: {
        sceneClass: function () {
            if (this.configuration.items.length > 1) {
                return 'cc-hero-carousel-preview__scene';
            }
            return 'cc-hero-carousel-preview__scene cc-hero-carousel-preview__scene--single';
        },
    },
    methods: {
        /**
         * Checks for status of images if they're loaded.
         * After they're all loaded spinner is hidden and content displayed.
         */
        setImagesLoadListener: function () {
            var _this = this;
            var $images = $(this.$els.scene).find('img');
            var imagesCount = $images.length;
            if (imagesCount) {
                $images.load(function () {
                    imagesCount--;
                    if (!imagesCount) {
                        _this.isLoading = false;
                        $images.each(function () {
                            $(this).addClass('cc-hero-carousel-preview__image--border');
                        });
                        window.setTimeout(function () {
                            $(_this.$els.scene)
                                .find('.cc-hero-carousel-preview__slide, .cc-hero-carousel-preview__slide-placeholder-wrapper')
                                .css('min-height', $(_this.$els.scene).outerHeight());
                        }, 150);
                    }
                }).filter(function () {
                    return this.complete;
                }).load();
            }
            else {
                _this.isLoading = false;
            }
        },
        hideEmptySlideContents: function () {
            $(this.$els.scene).find('.cc-hero-carousel-preview__slide-content-info').each(function () {
                if (!$(this).children().length) {
                    $(this).hide();
                }
            });
        },
    },
};

/**
 * Image teaser preview component.
 * This component is responsible for displaying preview of image teaser component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var imageTeaserPreview = {
    template: "<div data-role=\"spinner\" class=\"cc-component-placeholder__loading\" v-show=\"isLoading\">\n        <div class=\"spinner\">\n            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>\n        </div>\n    </div>\n    <div class=\"cc-image-teaser-preview\" v-show=\"!isLoading\">\n        <div class=\"cc-image-teaser-preview__wrapper\">\n            <ul class=\"cc-image-teaser-preview__scene cc-image-teaser-preview__scene--{{ configuration.currentScenario.desktopLayout.id }}-in-row\" v-el:scene>\n                <template v-for=\"item in configuration.items\">\n                    <li class=\"cc-image-teaser-preview__item\">\n                        <img v-if=\"configuration.items[$index].image\" :src=\"configuration.items[$index].image\" class=\"cc-image-teaser-preview__item-image\">\n                        <div class=\"cc-image-teaser-preview__image-placeholder-wrapper\" v-show=\"!configuration.items[$index].image\">\n                            <svg class=\"cc-image-teaser-preview__image-placeholder\">\n                                <use xlink:href=\"#icon_image-placeholder\"></use>\n                            </svg>\n                        </div>\n                        <div class=\"cc-image-teaser-preview__item-content\">\n                            <h2 class=\"cc-image-teaser-preview__headline\" v-if=\"configuration.items[$index].headline\">{{ configuration.items[$index].headline }}</h2>\n                            <h3 class=\"cc-image-teaser-preview__subheadline\" v-if=\"configuration.items[$index].subheadline\">{{ configuration.items[$index].subheadline }}</h3>\n                            <p class=\"cc-image-teaser-preview__paragraph\" v-if=\"configuration.items[$index].paragraph\">{{ configuration.items[$index].paragraph }}</p>\n                            <template v-if=\"configuration.items[$index].href\">\n                                <button type=\"button\" class=\"cc-image-teaser-preview__button\" v-if=\"configuration.items[$index].ctaLabel\">{{ configuration.items[$index].ctaLabel }}</button>\n                            </template>\n                        </div>\n                    </li>\n                </template>\n            </ul>\n        </div>\n    </div>",
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
        isLoading: {
            type: Boolean,
            default: true,
        }
    },
    ready: function () {
        this.setImagesLoadListener();
        this.hideEmptySlideContents();
    },
    methods: {
        /**
         * Checks for status of images if they're loaded.
         * After they're all loaded spinner is hidden and content displayed.
         */
        setImagesLoadListener: function () {
            var _this = this;
            var $images = $(this.$els.scene).find('img');
            var imagesCount = $images.length;
            if (imagesCount) {
                $images.load(function () {
                    imagesCount--;
                    if (!imagesCount) {
                        _this.isLoading = false;
                        $images.each(function () {
                            $(this).addClass('cc-image-teaser-preview__item-image--border');
                        });
                    }
                }).filter(function () {
                    return this.complete;
                }).load();
            }
            else {
                _this.isLoading = false;
            }
        },
        hideEmptySlideContents: function () {
            $(this.$els.scene).find('.cc-image-teaser-preview__item-content').each(function () {
                if (!$(this).children().length) {
                    $(this).hide();
                }
            });
        },
    }
};

/**
 * Magento products-grid teasers preview component.
 * This component displays preview of magento-product-grid-teasers component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var magentoProductGridTeasersPreview = {
    template: "<div class=\"cc-magento-product-grid-teasers-preview\">\n        <ul class=\"cc-magento-product-grid-teasers-preview__list\">\n            <li class=\"cc-magento-product-grid-teasers-preview__list-item cc-magento-product-grid-teasers-preview__list-item--teaser\">\n                <svg class=\"cc-magento-product-grid-teasers-preview__image-placeholder\">\n                    <use xlink:href=\"#icon_image-placeholder\"></use>\n                </svg>\n            </li>\n\n            <template v-for=\"i in 7\">\n                <li class=\"cc-magento-product-grid-teasers-preview__list-item\">\n                    <div class=\"cc-magento-product-grid-teasers-preview__product-wrapper\">\n                        <svg class=\"cc-magento-product-grid-teasers-preview__product\">\n                            <use xlink:href=\"#icon_component-cc-product-teaser-item\"></use>\n                        </svg>\n                    </div>\n                </li>\n            </template>\n\n            <li class=\"cc-magento-product-grid-teasers-preview__list-item cc-magento-product-grid-teasers-preview__list-item--text\">\n                <div>\n                    <div class=\"cc-magento-product-grid-teasers-preview__teasers-count\">\n                        {{ teasersLength }}\n                    </div>\n                    " + $t('teasers') + "\n                </div>\n            </li>\n        </ul>\n    </div>",
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
    computed: {
        teasersLength: function () {
            return this.configuration && this.configuration.teasers ? this.configuration.teasers.length : 0;
        },
    },
};

/**
 * Paragraph preview component.
 * This component is responsible for displaying preview of Paragraph component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var paragraphPreview = {
    template: "<div class=\"cc-paragraph-preview\">\n        <div class=\"cc-paragraph-preview__content\">\n            <svg class=\"cc-paragraph-preview__bg\">\n                <use xlink:href=\"#icon_component-paragraph-preview\"></use>\n            </svg>\n            <h2 class=\"cc-paragraph-preview__title\">{{ configuration.title }}</h2>\n        </div>\n    </div>",
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
    }
};

/**
 * Product carousel preview component.
 * This component is responsible for displaying preview of product carousel component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var productCarouselPreview = {
    template: "<div class=\"cc-product-carousel-preview\">\n        <svg class=\"cc-product-carousel-preview__arrow cc-product-carousel-preview__arrow--left\">\n            <use xlink:href=\"#icon_dashboard-arrow-left\"></use>\n        </svg>\n\n        <ul class=\"cc-product-carousel-preview__list\">\n            <template v-for=\"item in 4\">\n                <li class=\"cc-product-carousel-preview__list-item\">\n                    <div class=\"cc-product-carousel-preview__product-wrapper\">\n                        <svg class=\"cc-product-carousel-preview__product\">\n                            <use xlink:href=\"#icon_component-cc-product-teaser-item\"></use>\n                        </svg>\n                    </div>\n                </li>\n            </template>\n        </ul>\n\n        <svg class=\"cc-product-carousel-preview__arrow cc-product-carousel-preview__arrow--right\">\n            <use xlink:href=\"#icon_dashboard-arrow-right\"></use>\n        </svg>\n    </div>",
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

/**
 * Product Finder preview component.
 * This component is responsible for displaying preview of Product Finder component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var productFinderPreview = {
    template: "<div class=\"cc-product-finder-preview\">\n        <div class=\"cc-product-finder-preview__scene\" :class=\"[ isConfiguratorPreview ? 'cc-product-finder-preview__scene--configurator' : '' ]\" v-if=\"configuration.steps.length\">\n            <h2 class=\"cc-product-finder-preview__scene-title\" :data-placeholder=\"'No title' | translate\">{{{ configuration.steps[stepIndex].title }}}</h2>\n\n            <div class=\"cc-product-finder-preview__scene-description\" :data-placeholder=\"'No description' | translate\">{{{ configuration.steps[stepIndex].description }}}</div>\n\n            <ul class=\"cc-product-finder-preview__scene-options\">\n                <template v-for=\"option in configuration.steps[stepIndex].options\">\n                    <li class=\"cc-product-finder-preview__scene-option\">\n                        <figure class=\"cc-product-finder-preview__scene-option-figure\">\n                            <svg class=\"cc-product-finder-preview__scene-option-placeholder\" v-show=\"!option.image\">\n                                <use xlink:href=\"#icon_image-placeholder\"></use>\n                            </svg>\n                            <img class=\"cc-product-finder-preview__scene-option-image\" src=\"{{ option.image | decode }}\" alt=\"\" v-show=\"option.image\" />\n                        </figure>\n                        <span class=\"cc-product-finder-preview__scene-option-label\" :data-placeholder=\"'No label' | translate\">{{{ option.label }}}</span>\n                    </li>\n                </template>\n            </ul>\n        </div>\n\n        <div class=\"cc-product-finder-preview__scene cc-product-finder-preview__scene--faded\" v-if=\"configuration.steps.length > 1 && !isConfiguratorPreview\"></div>\n    </div>",
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
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
        /* Obtain index of step that shall be displayed in preview */
        stepIndex: {
            type: Number,
            default: 0,
        },
        /* Tells if preview is used in configurator component or in layout builder */
        isConfiguratorPreview: {
            type: Boolean,
            default: false,
        },
    },
    filters: {
        /** Decodes delivered image format to Base64, additionally removing escaped double-quotes
         * @param imageUrl {string} - image url in Magento-like format with escaped double-quotes, f.e. {{media url=\"wysiwyg/image.jpg\"}}
         * @return {string} - permanent image url that can be viewed in Magento's admin panel OR empty if something went wrong
         */
        decode: function (imageUrl) {
            var decodedImage = window.btoa(imageUrl.replace(/\\\//g, "/"));
            if (decodedImage && decodedImage.length && this.imageEndpoint.length) {
                return this.imageEndpoint.replace('{/encoded_image}', decodedImage);
            }
            return '';
        },
        /** Translates given string
         * @param txt {string} - original, english string to be translated
         * @return {string} - translated string
         */
        translate: function (txt) {
            return $.mage.__(txt);
        },
    },
};

/**
 * Product carousel preview component.
 * This component is responsible for displaying preview of product carousel component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var productGridPreview = {
    template: "<div data-role=\"spinner\" class=\"cc-component-placeholder__loading\" v-show=\"isLoading\">\n        <div class=\"spinner\">\n            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>\n        </div>\n    </div>\n    <div class=\"cc-products-grid-preview\" v-show=\"!isLoading\" v-el:scene>\n        <div class=\"cc-products-grid-preview__hero\" v-if=\"configuration.hero.position == 'left'\">\n            <img v-if=\"configuration.hero.image\" :src=\"configuration.hero.image\" class=\"cc-products-grid-preview__hero-image\">\n            <div class=\"cc-products-grid-preview__hero-placeholder-wrapper\" v-show=\"!configuration.hero.image\">\n                <svg class=\"cc-products-grid-preview__hero-placeholder\">\n                    <use xlink:href=\"#icon_image-placeholder\"></use>\n                </svg>\n            </div>\n            <div class=\"cc-products-grid-preview__hero-content\">\n                <h2 class=\"cc-products-grid-preview__headline\" v-if=\"configuration.hero.headline\">{{ configuration.hero.headline }}</h2>\n                <h3 class=\"cc-products-grid-preview__subheadline\" v-if=\"configuration.hero.subheadline\">{{ configuration.hero.subheadline }}</h3>\n                <p class=\"cc-products-grid-preview__paragraph\" v-if=\"configuration.hero.paragraph\">{{ configuration.hero.paragraph }}</p>\n                <template v-if=\"configuration.hero.href\">\n                    <button type=\"button\" class=\"cc-products-grid-preview__button\" v-if=\"configuration.hero.button.label\">{{ configuration.hero.button.label }}</button>\n                </template>\n            </div>\n        </div>\n\n        <ul v-bind:class=\"itemsGridClass\">\n            <template v-for=\"item in getItemsCount()\">\n                <li class=\"cc-products-grid-preview__list-item\">\n                    <div class=\"cc-products-grid-preview__product-wrapper\">\n                        <svg class=\"cc-products-grid-preview__product\">\n                            <use xlink:href=\"#icon_component-cc-product-teaser-item\"></use>\n                        </svg>\n                    </div>\n                </li>\n            </template>\n        </ul>\n\n        <div class=\"cc-products-grid-preview__hero\" v-if=\"configuration.hero.position == 'right'\">\n            <img v-if=\"configuration.hero.image\" :src=\"configuration.hero.image\" class=\"cc-products-grid-preview__hero-image\">\n            <div class=\"cc-products-grid-preview__hero-placeholder-wrapper\" v-show=\"!configuration.hero.image\">\n                <svg class=\"cc-products-grid-preview__hero-placeholder\">\n                    <use xlink:href=\"#icon_image-placeholder\"></use>\n                </svg>\n            </div>\n            <div class=\"cc-products-grid-preview__hero-content\">\n                <h2 class=\"cc-products-grid-preview__headline\" v-if=\"configuration.hero.headline\">{{ configuration.hero.headline }}</h2>\n                <h3 class=\"cc-products-grid-preview__subheadline\" v-if=\"configuration.hero.subheadline\">{{ configuration.hero.subheadline }}</h3>\n                <p class=\"cc-products-grid-preview__paragraph\" v-if=\"configuration.hero.paragraph\">{{ configuration.hero.paragraph }}</p>\n                <template v-if=\"configuration.hero.href\">\n                    <button type=\"button\" class=\"cc-products-grid-preview__button\" v-if=\"configuration.hero.button.label\">{{ configuration.hero.button.label }}</button>\n                </template>\n            </div>\n        </div>\n    </div>",
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
        isLoading: {
            type: Boolean,
            default: true,
        }
    },
    computed: {
        itemsGridClass: function () {
            if (this.configuration.hero.position) {
                return "cc-products-grid-preview__list cc-products-grid-preview__list--" + this.configuration.hero.position;
            }
            return 'cc-products-grid-preview__list';
        },
    },
    ready: function () {
        this.setImagesLoadListener();
        this.hideEmptySlideContents();
    },
    methods: {
        /**
         * Checks for status of images if they're loaded.
         * After they're all loaded spinner is hidden and content displayed.
         */
        setImagesLoadListener: function () {
            var _this = this;
            var $images = $(this.$els.scene).find('img');
            var imagesCount = $images.length;
            if (imagesCount) {
                $images.load(function () {
                    imagesCount--;
                    if (!imagesCount) {
                        _this.isLoading = false;
                    }
                }).filter(function () {
                    return this.complete;
                }).load();
            }
            else {
                _this.isLoading = false;
            }
        },
        getItemsCount: function () {
            return this.configuration.hero.position ? 6 : 10;
        },
        hideEmptySlideContents: function () {
            $(this.$els.scene).find('.cc-products-grid-preview__hero-content').each(function () {
                if (!$(this).children().length) {
                    $(this).hide();
                }
            });
        },
    },
};

/**
 * Separator preview component.
 * This component is responsible for displaying preview of separator component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var separatorPreview = {
    template: "<div class=\"cc-separator-preview\">\n        <hr class=\"cc-separator-preview__separator\">\n    </div>",
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

/**
 * CMS block preview component.
 * This component is responsible for displaying preview of CMS block component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
var staticBlockPreview = {
    template: "<div class=\"cc-static-block-preview\">\n        <div class=\"cc-static-block-preview__content\">\n            <svg class=\"cc-static-block-preview__bg\">\n                <use xlink:href=\"#icon_component-cms-block-preview\"></use>\n            </svg>\n            <h2 class=\"cc-static-block-preview__title\">{{ configuration.title }}</h2>\n        </div>\n    </div>",
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

/**
 * Layout builder component.
 * This component is responsible for displaying and handling user interactions of
 * entire Content Constructor
 * @type {vuejs.ComponentOption} Vue component object.
 */
var layoutBuilder = {
    template: "<div class=\"cc-layout-builder | {{ class }}\">\n        <div class=\"cc-layout-builder__filters\" v-if=\"filters\">\n            <template v-for=\"(filterKey, filter) in filters\">\n                <div class=\"cc-layout-builder__filter\">\n                    <div class=\"cc-layout-builder__filter-content\">\n                        <svg class=\"cc-layout-builder__filter-icon\">\n                            <use xlink:href=\"{{ filter.icon }}\"></use>\n                        </svg>\n                        <span class=\"cc-layout-builder__filter-title\">\n                            {{ getTranslatedText( filter.title ) }}:\n                        </span>\n                        <template v-for=\"(optionKey, option) in filter.options\">\n                            <div class=\"cc-layout-builder__filter-control\">\n                                <label :class=\"[ option.value ? 'cc-input__checkbox-label cc-input__checkbox-label--checked' : 'cc-input__checkbox-label' ]\">\n                                    <input type=\"checkbox\" v-model=\"option.value\" class=\"cc-input__checkbox\" @change=\"saveFiltersState()\">\n                                    {{ getTranslatedText( option.label ) }}\n                                </label>\n                            </div>\n                        </template>\n                    </div>\n                </div>\n            </template>\n        </div>\n\n        <div class=\"cc-layout-builder__component cc-layout-builder__component--static\">\n            <div class=\"cc-layout-builder__component-wrapper\">\n                <div class=\"cc-component-placeholder__component cc-component-placeholder__component--decorated cc-component-placeholder__component--header\">\n                    <svg class=\"cc-component-placeholder__component-icon\">\n                        <use xlink:href=\"#icon_component-cc-header\"></use>\n                    </svg>\n                </div>\n            </div>\n\n            <component-adder class=\"cc-component-adder cc-component-adder--last\">\n                <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button\" @click=\"createNewComponent( 0 )\">\n                    <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                        <use xlink:href=\"#icon_plus\"></use>\n                    </svg>\n                </button>\n            </component-adder>\n        </div>\n\n        <template v-for=\"component in components\">\n            <div v-bind:class=\"{ 'cc-layout-builder__component': true, 'cc-layout-builder__component--special': getIsSpecialComponent( component.type ), 'cc-layout-builder__component--invisible': getIsComponentHiddenFE( component.data ), 'cc-layout-builder__component--filtered-out': !getIsComponentVisibleDashboard( component.data ) }\" id=\"{{ component.id }}\">\n                <component-adder class=\"cc-component-adder cc-component-adder--first\">\n                    <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button\" @click=\"createNewComponent( $index )\">\n                        <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                            <use xlink:href=\"#icon_plus\"></use>\n                        </svg>\n                    </button>\n                </component-adder>\n\n                <div class=\"cc-layout-builder__component-actions\">\n                    <component-actions>\n                        <template slot=\"cc-component-actions__buttons\">\n                            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--up\" @click=\"moveComponentUp( $index )\" :class=\"[ isFirstComponent( $index ) ? 'cc-action-button--look_disabled' : '' ]\" :disabled=\"isFirstComponent( $index )\">\n                                <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                    <use xlink:href=\"#icon_arrow-up\"></use>\n                                </svg>\n                            </button>\n                            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--down\" @click=\"moveComponentDown( $index )\" :class=\"[ isLastComponent( $index ) ? 'cc-action-button--look_disabled' : '' ]\" :disabled=\"isLastComponent( $index )\">\n                                <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                    <use xlink:href=\"#icon_arrow-down\"></use>\n                                </svg>\n                            </button>\n                            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--settings\" :class=\"[ isPossibleToEdit( component.type ) ? '' : 'cc-action-button--look_disabled' ]\" :disabled=\"!isPossibleToEdit( component.type )\" @click=\"editComponentSettings( $index )\" title=\"{{ getTranslatedText('Edit component') }}\">\n                                <svg class=\"cc-action-button__icon\">\n                                    <use xlink:href=\"#icon_edit\"></use>\n                                </svg>\n                            </button>\n                            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--duplicate\" :class=\"[ isPossibleToDuplicate( component.type ) ? '' : 'cc-action-button--look_disabled' ]\" :disabled=\"!isPossibleToDuplicate( component.type )\" @click=\"duplicateComponent( $index )\" title=\"{{ getTranslatedText('Duplicate component') }}\">\n                                <svg class=\"cc-action-button__icon\">\n                                    <use xlink:href=\"#icon_duplicate\"></use>\n                                </svg>\n                            </button>\n                            <div class=\"cc-component-display-controller\" v-if=\"isPossibleToControlDisplay( component.type )\">\n                                <svg class=\"cc-component-display-controller__icon\">\n                                    <use xlink:href=\"#icon_eye\"></use>\n                                </svg>\n                                <div class=\"cc-component-display-controller__control\">\n                                    <label :class=\"[ component.data.componentVisibility.mobile ? 'cc-input__checkbox-label cc-input__checkbox-label--checked' : 'cc-input__checkbox-label' ]\">\n                                        <input type=\"checkbox\" v-model=\"component.data.componentVisibility.mobile\" class=\"cc-input__checkbox\" @change=\"updateLayout()\">\n                                        {{ getTranslatedText('Mobile') }}\n                                    </label>\n                                </div>\n                                <div class=\"cc-component-display-controller__control\">\n                                    <label :class=\"[ component.data.componentVisibility.desktop ? 'cc-input__checkbox-label cc-input__checkbox-label--checked' : 'cc-input__checkbox-label' ]\">\n                                        <input type=\"checkbox\" v-model=\"component.data.componentVisibility.desktop\" class=\"cc-input__checkbox\" @change=\"updateLayout()\">\n                                        {{ getTranslatedText('Desktop') }}\n                                    </label>\n                                </div>\n                            </div>\n                            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--delete\" :class=\"[ isPossibleToDelete( component.type ) ? '' : 'cc-action-button--look_disabled' ]\" :disabled=\"!isPossibleToDelete( component.type )\" @click=\"deleteComponent( $index )\">\n                                <svg class=\"cc-action-button__icon\">\n                                    <use xlink:href=\"#icon_trash-can\"></use>\n                                </svg>\n                            </button>\n                        </template>\n                    </component-actions>\n                </div>\n                <div class=\"cc-layout-builder__component-wrapper\">\n                    <component-placeholder>\n                        <h3 class=\"cc-component-placeholder__headline\" v-text=\"transformComponentTypeToText( component.type )\"></h3>\n                        <div class=\"cc-component-placeholder__component\">\n                            \n                            <component :is=\"component.type + '-preview'\" :configuration=\"component.data\" :index=\"$index\" :assets-src=\"assetsSrc\" :image-endpoint=\"imageEndpoint\"></component>\n\n                        </div>\n                    </component-placeholder>\n                </div>\n\n                <component-adder class=\"cc-component-adder cc-component-adder--last\">\n                    <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button\" @click=\"createNewComponent( $index + 1 )\">\n                        <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                            <use xlink:href=\"#icon_plus\"></use>\n                        </svg>\n                    </button>\n                </component-adder>\n            </div>\n        </template>\n\n        <div class=\"cc-layout-builder__component cc-layout-builder__component--static\">\n            <component-adder class=\"cc-component-adder cc-component-adder--first\">\n                <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button\" @click=\"createNewComponent( components.length + 1 )\">\n                    <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                        <use xlink:href=\"#icon_plus\"></use>\n                    </svg>\n                </button>\n            </component-adder>\n\n            <div class=\"cc-layout-builder__component-wrapper\">\n                <div class=\"cc-component-placeholder__component cc-component-placeholder__component--decorated cc-component-placeholder__component--footer\">\n                    <svg class=\"cc-component-placeholder__component-icon\">\n                        <use xlink:href=\"#icon_component-cc-footer\"></use>\n                    </svg>\n                </div>\n            </div>\n        </div>\n    </div>",
    /**
     * Get dependencies
     */
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
        'component-display-controller': componentDisplayController,
        'component-placeholder': componentPlaceholder,
        'brand-carousel-preview': brandCarouselPreview,
        'button-preview': buttonPreview,
        'category-links-preview': categoryLinksPreview,
        'cms-teaser-preview': cmsPagesTeaserPreview,
        'custom-html-preview': customHtmlPreview,
        'daily-deal-teaser-preview': dailyDealTeaserPreview,
        'headline-preview': headlinePreview,
        'hero-carousel-preview': heroCarouselPreview,
        'image-teaser-preview': imageTeaserPreview,
        'magento-product-grid-teasers-preview': magentoProductGridTeasersPreview,
        'paragraph-preview': paragraphPreview,
        'product-carousel-preview': productCarouselPreview,
        'product-finder-preview': productFinderPreview,
        'product-grid-preview': productGridPreview,
        'separator-preview': separatorPreview,
        'static-cms-block-preview': staticBlockPreview,
    },
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: [String, Object, Array],
            default: '',
        },
        assetsSrc: {
            type: String,
            default: '',
        },
        ccConfig: {
            type: Object,
            default: function () {
                return {};
            },
        },
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
        /**
         * Initial component configuration encoded as JSON string.
         */
        componentsConfiguration: {
            type: String,
            default: '',
        },
        /**
         * Callback invoked when edit component button is clicked.
         * This function should take IComponentInformation and return changed version of it.
         * If callback returns falsy value then component isn't changed.
         */
        editComponent: {
            type: Function,
            default: function (componentInfo) { return componentInfo; },
        },
        /**
         * Callback invoked when edit component button is clicked.
         * This function should return IComponentInformation.
         * If callback returns falsy value then component isn't added.
         */
        addComponent: {
            type: Function,
            default: function () { return undefined; },
        },
        pageType: {
            type: String,
            default: 'cms_page_form.cms_page_form',
        },
    },
    data: function () {
        return {
            components: [],
            filters: {},
        };
    },
    computed: {
        ccSections: function () {
            return Object.values(this.ccConfig.sections[this.pageType]);
        },
    },
    ready: function () {
        this.components = this.componentsConfiguration ? JSON.parse(this.componentsConfiguration) : [];
        this.filters = (typeof (Storage) !== void (0) && window.localStorage.getItem('ccFilters')) ? JSON.parse(window.localStorage.getItem('ccFilters')) : this.ccConfig.filters;
        this.sortComponentsBySections();
        this.setupInitialDisplayProps();
        this.updateLayout();
    },
    methods: {
        /**
         * Returns components information currently stored within layout builder.
         * @return {IComponentInformation[]} Components information array.
         */
        getComponentInformation: function () {
            return JSON.parse(JSON.stringify(this.components));
        },
        /**
         * Uses localStorage to save current filters state within layout builder.
         */
        saveFiltersState: function () {
            if (typeof (Storage) !== void (0) && this.filters) {
                window.localStorage.setItem('ccFilters', JSON.stringify(this.filters));
            }
        },
        /**
         * Updates builders' layout
         */
        updateLayout: function () {
            this.$dispatch('layout-builder__update');
        },
        /**
         * Sets provided component information on current index in components array.
         * If component exists on given index then this compoennt will be inserted before it.
         * @param {number}                index         Component index in components array.
         * @param {IComponentInformation} componentInfo Component information.
         */
        addComponentInformation: function (index, componentInfo) {
            if (componentInfo) {
                if (!componentInfo.data.hasOwnProperty('componentVisibility') && !this.getIsSpecialComponent(componentInfo.type)) {
                    componentInfo.data.componentVisibility = {
                        mobile: true,
                        desktop: true,
                    };
                }
                this.components.splice(index, 0, componentInfo);
                this.setComponentsPlacementInfo();
                this.updateLayout();
            }
        },
        /**
         * Sets provided component information on current index in components array.
         * If component exists on given index then it will be overwritten.
         * @param {number}                index         Component index in components array.
         * @param {IComponentInformation} componentInfo Component information.
         */
        setComponentInformation: function (index, componentInfo) {
            if (componentInfo) {
                this.components.$set(index, componentInfo);
                this.setComponentsPlacementInfo();
                this.updateLayout();
            }
        },
        /**
         * Creates new component and adds it to a specified index.
         * This function calls callback specified by "add-component" property that
         * should return IComponentInformation.
         * If callback returns falsy value then component isn't added.
         * @param {number} index New component's index in components array.
         */
        createNewComponent: function (index) {
            var _this = this;
            /**
             * To allow both sync and async set of new component data we call
             * provided handler with callback function.
             * If handler doesn't return component information then it can still
             * set it using given callback.
             */
            var componentInfo = this.addComponent(function (asyncComponentInfo) {
                _this.addComponentInformation(index, asyncComponentInfo);
            });
            this.addComponentInformation(index, componentInfo);
        },
        /**
         * Initializes edit mode of component.
         * This function invokes callback given by "edit-component" callback that
         * should take current IComponentInformation as param and return changed version of it.
         * If callback returns falsy value then component isn't changed.
         * @param {string} index: Component's index in array.
         */
        editComponentSettings: function (index) {
            var _this = this;
            // Create a static, non-reactive copy of component data.
            var componentInfo = JSON.parse(JSON.stringify(this.components[index]));
            /**
             * To allow both sync and async set of new component data we call
             * provided handler with current component data and callback function.
             * If handler doesn't return component information then it can still
             * set it using given callback.
             */
            componentInfo = this.editComponent(componentInfo, function (asyncComponentInfo) {
                _this.setComponentInformation(index, asyncComponentInfo);
            });
            this.setComponentInformation(index, componentInfo);
        },
        /**
         * Moves component under given index up by swaping it with previous element.
         * @param {number} index Component's index in array.
         */
        moveComponentUp: function (index) {
            var _this = this;
            if (index > 0) {
                var previousComponent_1 = this.components[index - 1];
                var $thisComponent_1 = $("#" + this.components[index].id);
                var $prevComponent_1 = $("#" + this.components[index - 1].id);
                $thisComponent_1.addClass('cc-layout-builder__component--animating').css('transform', "translateY(" + -Math.abs($prevComponent_1.outerHeight(true)) + "px)");
                $prevComponent_1.addClass('cc-layout-builder__component--animating').css('transform', "translateY(" + $thisComponent_1.outerHeight(true) + "px)");
                setTimeout(function () {
                    _this.components.$set(index - 1, _this.components[index]);
                    _this.components.$set(index, previousComponent_1);
                    _this.setComponentsPlacementInfo();
                    _this.updateLayout();
                    $thisComponent_1.removeClass('cc-layout-builder__component--animating').css('transform', '');
                    $prevComponent_1.removeClass('cc-layout-builder__component--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Moves component under given index down by swaping it with next element.
         * @param {number} index Component's index in array.
         */
        moveComponentDown: function (index) {
            var _this = this;
            if (index < this.components.length - 1) {
                var previousComponent_2 = this.components[index + 1];
                var $thisComponent_2 = $("#" + this.components[index].id);
                var $nextComponent_1 = $("#" + this.components[index + 1].id);
                $thisComponent_2.addClass('cc-layout-builder__component--animating').css('transform', "translateY(" + $nextComponent_1.outerHeight(true) + "px)");
                $nextComponent_1.addClass('cc-layout-builder__component--animating').css('transform', "translateY(" + -Math.abs($thisComponent_2.outerHeight(true)) + "px)");
                setTimeout(function () {
                    _this.components.$set(index + 1, _this.components[index]);
                    _this.components.$set(index, previousComponent_2);
                    _this.setComponentsPlacementInfo();
                    _this.updateLayout();
                    $thisComponent_2.removeClass('cc-layout-builder__component--animating').css('transform', '');
                    $nextComponent_1.removeClass('cc-layout-builder__component--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Duplicates component under given index and place it below the original one.
         * @param {number} index Original component's index in array.
         */
        duplicateComponent: function (index) {
            var _this = this;
            var duplicate = JSON.parse(JSON.stringify(this.components[index]));
            duplicate.id = duplicate.id + "_duplicate";
            this.addComponentInformation(index + 1, duplicate);
            this.$nextTick(function () {
                var $origin = $("#" + _this.components[index].id);
                var $duplicate = $("#" + duplicate.id);
                $duplicate.addClass('cc-layout-builder__component--duplicate cc-layout-builder__component--show-up');
                setTimeout(function () {
                    $duplicate.removeClass('cc-layout-builder__component--show-up');
                    $('html, body').animate({
                        scrollTop: $origin.offset().top + $origin.outerHeight(true) - 150,
                    }, 350, 'swing');
                }, 10);
                setTimeout(function () {
                    $duplicate.removeClass('cc-layout-builder__component--duplicate');
                }, 800);
            });
        },
        /**
         * Goes through all components and assigns section.
         * F.e. CC on category has 3 sections (top, grid [magento, not editable], and bottom)
         * In this example this methods sets TOP for all components that are above special component dedicated for category page, GRID for special component and BOTTOM for all components under.
         */
        setComponentsPlacementInfo: function () {
            if (this.ccSections.length > 1) {
                var sectionIndex = 0;
                var specialComponents = Object.values(this.ccConfig.special_components);
                for (var i = 0; i < this.components.length; i++) {
                    if (specialComponents.indexOf(this.components[i].type) !== -1) {
                        sectionIndex++;
                        this.components[i].section = this.ccSections[sectionIndex];
                        sectionIndex++;
                    }
                    else {
                        this.components[i].section = this.ccSections[sectionIndex];
                    }
                }
            }
        },
        /**
         * Sorts components by their sections.
         * Order is defined by this.ccSections
         */
        sortComponentsBySections: function () {
            var _this = this;
            if (this.components.length && this.ccSections.length > 1) {
                this.components.sort(function (a, b) {
                    return _this.ccSections.indexOf(a.section) - _this.ccSections.indexOf(b.section);
                });
            }
        },
        /**
         * Backwards compatibility enhancement
         * When components doesn't have {componentVisibility} object set - add defaults once
         * Special Components will not be modified
         */
        setupInitialDisplayProps: function () {
            for (var i = 0; i < this.components.length; i++) {
                var c = this.components[i];
                if (!c.data.hasOwnProperty('componentVisibility') && !this.getIsSpecialComponent(c.type)) {
                    var componentInfo = $.extend(true, {}, c, {
                        data: {
                            componentVisibility: {
                                mobile: true,
                                desktop: true,
                            }
                        }
                    });
                    this.setComponentInformation(i, componentInfo);
                }
            }
        },
        /**
         * Tells if component with given index is the first component.
         * @param  {number}  index Index of the component.
         * @return {boolean}       If component is first in array.
         */
        isFirstComponent: function (index) {
            return index === 0;
        },
        /**
         * Tells if component with given index is the last component.
         * @param  {number}  index Index of the component.
         * @return {boolean}       If component is last in array.
         */
        isLastComponent: function (index) {
            return index === this.components.length - 1;
        },
        transformComponentTypeToText: function (componentType) {
            return componentType.replace('-', ' ');
        },
        /**
         * Checks if component is integrated and dependant of Magento.
         * In this case some operations like duplicate/remove are not allowed
         * @param  {string}  componentType type of component.
         * @return {boolean}
         */
        getIsSpecialComponent: function (componentType) {
            return Object.values(this.ccConfig.special_components).indexOf(componentType) !== -1;
        },
        /**
         * Checks if component can be edited.
         * Components that doesn't provide any configurators cannot be edited.
         * @param  {string}  componentType type of component.
         * @return {boolean}
         */
        isPossibleToEdit: function (componentType) {
            return componentType !== 'brand-carousel' && componentType !== 'separator';
        },
        /**
         * Checks if it's possible to delete component.
         * For now we only disallow removal of special components so I just call getIsSpecialComponent
         * In the future there might be a need to iterate it, this is why it's separate method
         * @param  {string}  componentType type of component.
         * @return {boolean}
         */
        isPossibleToDelete: function (componentType) {
            return !this.getIsSpecialComponent(componentType);
        },
        /**
         * Checks if it's possible to duplicate component.
         * @param  {string}  componentType type of component.
         * @return {boolean}
         */
        isPossibleToDuplicate: function (componentType) {
            return !this.getIsSpecialComponent(componentType) && componentType !== 'paragraph';
        },
        /**
         * FE mobile/desktop visibility cannot be controlled for Built-in components into magento core functionality
         * @param  {string}  componentType type of component.
         * @return {boolean}
         */
        isPossibleToControlDisplay: function (componentType) {
            return !this.getIsSpecialComponent(componentType) && componentType !== 'custom-html';
        },
        /**
         * Tells to builder if component is set to be hidden on both: mobile & desktop
         * It's needed to grey-out this component on the dashboard
         * @param {Object} Component's data information.
         * @return {boolean}
         */
        getIsComponentHiddenFE: function (componentData) {
            if (componentData.hasOwnProperty('componentVisibility')) {
                return (!componentData.componentVisibility.mobile || componentData.componentVisibility.mobile === '') && (!componentData.componentVisibility.desktop || componentData.componentVisibility.desktop === '');
            }
            return false;
        },
        /**
         * Tells if component is filtered-out or not in dashboard.
         * It's needed to show it or hide it based on current filter setup
         * @param {Object} Component's data information.
         * @return {boolean}
         */
        getIsComponentVisibleDashboard: function (componentData) {
            if (componentData.hasOwnProperty('componentVisibility') && this.filters) {
                var visibleMobile = (componentData.componentVisibility.mobile !== '' && componentData.componentVisibility.mobile !== false);
                var visibleDesktop = (componentData.componentVisibility.desktop !== '' && componentData.componentVisibility.desktop !== false);
                if (this.filters.componentVisibility.options.mobile.value && visibleMobile) {
                    return true;
                }
                if (this.filters.componentVisibility.options.desktop.value && visibleDesktop) {
                    return true;
                }
                if (this.filters.componentVisibility.options.none.value && !visibleMobile && !visibleDesktop) {
                    return true;
                }
                return false;
            }
            return true;
        },
        /* Removes component from M2C
         * If it's paragraph that is about to be removed, asks if corresponding CMS Block shall be removed as well
         * @param index {number} - index of the component in layoutBuilder
         */
        deleteComponent: function (index) {
            var builder = this;
            confirm({
                content: $t('Are you sure you want to delete this item?'),
                actions: {
                    confirm: function () {
                        var component = builder.components[index];
                        builder.components.splice(index, 1);
                        if (component.type === 'paragraph') {
                            builder.deleteStaticBlock(component.data.blockId);
                        }
                        builder.$dispatch('layout-builder__update');
                    },
                },
            });
        },
        deleteStaticBlock: function (cmsBlockId) {
            var component = this;
            confirm({
                content: $t('Would you like to delete CMS Block related to this component (CMS Block ID: %s) ?').replace('%s', cmsBlockId),
                actions: {
                    confirm: function () {
                        component.$dispatch('layout-builder__cmsblock-delete-request', cmsBlockId);
                    },
                },
            });
        },
        getTranslatedText: function (originalText) {
            return $t(originalText);
        },
    },
};

/**
 * Base configurator component.
 * This component is responsible for providing base functionality for other configurators.
 * @type {vuejs.ComponentOption} Vue component object.
 */
var componentConfigurator = {
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: [String, Object, Array],
            default: '',
        },
        /**
         * Property containing callback triggered when user saves component.
         * For default, we are providing a dummy function so we can skip the type check.
         */
        save: {
            type: Function,
            default: function () { return function () { return undefined; }; },
        },
        /**
         * Property containing callback triggered when configuration is changed.
         * For default, we are providing a dummy function so we can skip the type check.
         */
        change: {
            type: Function,
            default: function () { return function () { return undefined; }; },
        },
        /**
         *
         */
        configuration: {
            type: String,
            default: function () { },
        },
    },
    methods: {
        onChange: function (event) {
            // Serialize reactive data.
            var data = JSON.parse(JSON.stringify(this.configuration));
            // Trigger event and callback.
            this.$dispatch('component-configurator__changed', data);
            this.change(data);
        },
        onSave: function (event) {
            // Serialize reactive data.
            var data = JSON.parse(JSON.stringify(this.configuration));
            // Trigger event and callback.
            this.$dispatch('component-configurator__saved', data);
            this.save(data);
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            if (this._events['component-configurator__save'].length === 1) {
                this.onSave();
            }
        },
    },
};

/**
 * button configurator component.
 * This component is responsible for displaying buttons configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var buttonConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: "<form class=\"cc-button-configurator {{ classes }} | {{ mix }}\" {{ attributes }} @submit.prevent=\"onSave\">\n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-label\" class=\"cc-input__label\">" + $t('Label') + ":</label>\n            <input type=\"text\" v-model=\"configuration.label\" id=\"cfg-label\" class=\"cc-input__input\" @change=\"onChange\">\n        </div>\n        <div class=\"cc-input cc-input--type-addon cc-input--type-inline | cc-button-configurator__item-form-element\">\n            <label for=\"cfg-target\" class=\"cc-input__label\">" + $t('Target') + ":</label>\n            <div class=\"cc-input__addon-wrapper\">\n                <input type=\"text\" class=\"cc-input__input | cc-button-configurator__target\" v-model=\"configuration.target\" id=\"cfg-target\">\n                <span class=\"cc-input__addon | cc-button-configurator__widget-chooser-trigger\" @click=\"openCtaTargetModal()\">\n                    <svg class=\"cc-input__addon-icon\">\n                        <use xlink:href=\"#icon_link\"></use>\n                    </svg>\n                </span>\n            </div>\n        </div>\n    </form>",
    props: {
        /*
         * Single's component configuration
         */
        configuration: {
            type: Object,
            default: function () {
                return {
                    label: '',
                    target: '',
                };
            },
        },
        /* Get assets for displaying component images */
        assetsSrc: {
            type: String,
            default: '',
        },
        /* Obtain admin url */
        adminPrefix: {
            type: String,
            default: 'admin',
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            this.onSave();
        },
    },
    methods: {
        /* Opens modal with M2 built-in widget chooser
         */
        openCtaTargetModal: function () {
            widgetTools.openDialog(window.location.origin + "/" + this.adminPrefix + "/admin/widget/index/filter_widgets/Link/widget_target_id/cfg-target");
            this.wWidgetListener();
        },
        /* Sets listener for widget chooser
         * It triggers component.onChange to update component's configuration
         * after value of target input is changed
         */
        widgetSetListener: function () {
            var component = this;
            $('.cc-button-configurator__cta-target-link').on('change', function () {
                component.onChange();
            });
        },
        /*
         * Check if widget chooser is loaded. If not, wait for it, if yes:
         * Override default onClick for "Insert Widget" button in widget's modal window
         * to clear input's value before inserting new one
         */
        wWidgetListener: function () {
            var _this = this;
            if (typeof wWidget !== 'undefined' && widgetTools.dialogWindow[0].innerHTML !== '') {
                var button = widgetTools.dialogWindow[0].querySelector('#insert_button');
                button.onclick = null;
                button.addEventListener('click', function () {
                    _this.configuration.target = '';
                    wWidget.insertWidget();
                });
            }
            else {
                setTimeout(this.wWidgetListener, 300);
            }
        },
    },
    ready: function () {
        this.widgetSetListener();
    },
};

var templates = {
    getComponentTemplate: function (classes, placeholders, disabledClass) {
        return "<div class=\"cc-input__fake-select | " + classes.input.base + " " + disabledClass + "\">" + placeholders.select + "</div>\n        <div class=\"" + classes.input.base + "-opener\"></div>\n        <div class=\"" + classes.menu.base + "\">\n            <div class=\"" + classes.search.wrapper + "\">\n                <input class=\"cc-input__input | " + classes.search.input + "\" data-role=\"advanced-select-text\" type=\"text\" placeholder=\"" + placeholders.search + "\">\n                <div class=\"" + classes.search.resultsQty + "\"></div>\n            </div>\n            <div class=\"" + classes.menu.content + "\"></div>\n            <div class=\"" + classes.search.resultsWrapper + "\"></div>\n            <div class=\"" + classes.actions.wrapper + "\">\n                <button class=\"action-default | " + classes.actions.button + "\" type=\"button\">" + placeholders.doneButton + "</button>\n            </div>\n        </div>";
    },
    getMinimalComponentTemplate: function (classes, placeholders, disabledClass) {
        return "<div class=\"cc-input__fake-select | " + classes.input.base + " " + disabledClass + "\">" + placeholders.select + "</div>\n        <div class=\"" + classes.input.base + "-opener\"></div>\n        <div class=\"" + classes.menu.base + "\">\n            <div class=\"" + classes.menu.content + "\"></div>\n            <div class=\"" + classes.actions.wrapper + "\">\n                <button class=\"action-default | " + classes.actions.button + "\" type=\"button\">" + placeholders.doneButton + "</button>\n            </div>\n        </div>";
    },
    getCrumbTemplate: function (baseClass, crumbLabel, title, inputValue) {
        return "<span class=\"" + baseClass + "__crumb\">\n            <span class=\"" + baseClass + "__crumb-text\">" + crumbLabel + "</span>\n            <button class=\"" + baseClass + "__crumb-remove\" type=\"button\" title=\"" + title + "\" tabindex=\"-1\" data-value=\"" + inputValue + "\"></button>\n        </span>";
    },
};

var categoryPicker = (function () {
    /**
     * Creates new CcCategoryPicker component with optional settings.
     * @param {$output} Hidden input field that will be filled with IDs after used choses it
     * @param {data} JSON with categories data
     * @param {options}  Optional settings object.
     */
    function categoryPicker($output, data, options) {
        this._defaults = {
            multiple: true,
            showChildren: true,
            showSearch: true,
            disabled: false,
            disableLastLevelItems: false,
            minSearchQueryLength: 3,
            placeholders: {
                select: $t('Select...'),
                doneButton: $t('Done'),
                search: $t('Type category name to search...'),
                empty: $t('There are no categories matching your selection'),
                removeCrumb: $t('Remove this category'),
            },
            classes: {
                base: 'cc-category-picker',
                baseMix: '',
                input: {
                    base: 'cc-category-picker__input',
                },
                menu: {
                    base: 'cc-category-picker__box',
                    open: 'cc-category-picker__box--open',
                    content: 'cc-category-picker__box-content',
                },
                search: {
                    wrapper: 'cc-category-picker__search',
                    input: 'cc-category-picker__search-input',
                    label: 'cc-category-picker__results-label',
                    resultsQty: 'cc-category-picker__results-qty',
                    resultsWrapper: 'cc-category-picker__results',
                    resultsUL: 'cc-category-picker__results-list',
                    resultsLI: 'cc-category-picker__results-item',
                    resultsPath: 'cc-category-picker__results-path',
                },
                actions: {
                    wrapper: 'cc-category-picker__actions',
                    button: 'cc-category-picker__button',
                },
                dropdown: {
                    ul: 'cc-category-picker__dropdown',
                    li: 'cc-category-picker__dropdown-item',
                    toggler: 'cc-category-picker__dropdown-toggler',
                    label: 'cc-category-picker__label',
                    checkbox: 'cc-category-picker__checkbox',
                    radio: 'cc-category-picker__radio',
                },
            },
        };
        this._categoriesData = data;
        this._categoriesLabels = [];
        this._options = $.extend(true, {}, this._defaults, options);
        this._$output = $output;
        this._$wrapper = undefined;
        this._isOpen = false;
        this._prefix = Math.random().toString(36).substring(2, 5);
        this._orderedCheckboxes = [];
        this._renderPicker();
        this._afterBuild(false);
        this._rebuildValues();
        this._setEvents();
    }
    /**
     * This actually controls output of all events.
     * Updates picker's crumbs and values
     * @param {inputs} Optional. Array with inputs (checkboxes, radios) - they contain all data we need to show updated picker
     */
    categoryPicker.prototype.updatePicker = function (inputs) {
        var c = this._options.classes;
        var t = this._options.placeholders;
        var _this = this;
        var ids = $(inputs).map(function () {
            return this.value;
        }).get().join(',');
        this._categoriesLabels = $(inputs).map(function () {
            return $(this).next('label').clone().children().remove().end().text();
        });
        var crumbs = $(inputs).map(function () {
            var label = $(this).next('label').clone().children().remove().end().text();
            return templates.getCrumbTemplate(c.base, label, t.removeCrumb, this.value);
        }).get().join('');
        this._$output[0].value = ids;
        this._$output[0].dispatchEvent(new Event('change'));
        if (crumbs !== '') {
            this._$wrapper.find("." + c.input.base).html(crumbs);
        }
        else {
            this._$wrapper.find("." + c.input.base).html(this._options.placeholders.select);
        }
        this._setCrumbsEvents();
    };
    /**
     * Opens given parent - displays its children
     * @param {$item} Parent element, of which children we want to display
     */
    categoryPicker.prototype.openSubcategoriesTree = function ($item) {
        var c = this._options.classes;
        $item.find("> ." + c.dropdown.ul).toggleClass(c.dropdown.ul + "--hidden");
        $item.find("> ." + c.dropdown.li + "-content ." + c.dropdown.toggler).toggleClass(c.dropdown.toggler + "--active");
    };
    /**
     * Opens picker's box
     * @param {$wrapper} wrapper (root element) of the component, since we want to know which picker should be opened
     */
    categoryPicker.prototype.openPicker = function ($wrapper) {
        // Close all open pickers if class matches
        this.closePicker($("." + this._options.classes.base));
        $wrapper.find('.cc-input__fake-select').addClass('cc-input__fake-select--active');
        $wrapper.find("." + this._options.classes.menu.base).addClass(this._options.classes.menu.base + "--open");
        this._isOpen = true;
    };
    /**
     * Closes picker's box
     * @param {$wrapper} wrapper (root element) of the component, since we want to know which picker should be closed
     */
    categoryPicker.prototype.closePicker = function ($wrapper) {
        $wrapper.find('.cc-input__fake-select').removeClass('cc-input__fake-select--active');
        $wrapper.find("." + this._options.classes.menu.base).removeClass(this._options.classes.menu.base + "--open");
        this._isOpen = false;
    };
    /**
     * Rebuilds content of picker to show only children elements of given parent (category ID)
     * @param {id} ID of category
     */
    categoryPicker.prototype.showChildrenOnly = function (id) {
        var target = this._getChildren(id);
        if (target.optgroup) {
            this._orderedCheckboxes = [];
            this._$wrapper.find("." + this._options.classes.menu.content).html(this._getContents(target.optgroup, '', this._options.classes.dropdown.ul + "--normal"));
            this._afterBuild(false);
            this._rebuildValues();
            this._setEvents();
        }
        else {
            this._$wrapper.find("." + this._options.classes.menu.content).html(this._options.placeholders.empty);
        }
    };
    /**
     * Enables picker
     */
    categoryPicker.prototype.enable = function () {
        this._$wrapper.find("." + this._options.classes.input.base).removeClass(this._options.classes.input.base + "--disabled");
        this._options.disabled = false;
    };
    /**
     * Disables picker
     */
    categoryPicker.prototype.disable = function () {
        this._$wrapper.find("." + this._options.classes.input.base).addClass(this._options.classes.input.base + "--disabled");
        this.closePicker(this._$wrapper);
        this._options.disabled = true;
    };
    /**
     * Clears output, crumbs and inputs array
     */
    categoryPicker.prototype.resetAll = function () {
        this._$output[0].value = '';
        this._$wrapper.find("." + this._options.classes.input.base).html(this._options.placeholders.select);
        this._orderedCheckboxes = [];
    };
    /**
     * Renders picker component markup and initial setup
     */
    categoryPicker.prototype._renderPicker = function () {
        var c = this._options.classes;
        var t = this._options.placeholders;
        var disabledClass = this._options.disabled ? c.input.base + "--disabled" : '';
        var tpl = '';
        if (this._options.showChildren && this._options.showSearch) {
            tpl = templates.getComponentTemplate(c, t, disabledClass);
        }
        else {
            tpl = templates.getMinimalComponentTemplate(c, t, disabledClass);
        }
        this._$output.wrap("<div class=\"" + c.base + " " + c.baseMix + "\"></div>");
        this._$wrapper = this._$output.parent("." + c.base);
        this._$wrapper.append(tpl);
        if (this._categoriesData.optgroup) {
            this._$wrapper.find("." + c.menu.content).html(this._getContents(this._categoriesData.optgroup, ''));
        }
        else {
            this._$wrapper.find("." + c.menu.content).html(t.empty);
        }
    };
    /**
     * Renders new options list based on given catehories data
     * @param {data} Array of categories
     */
    categoryPicker.prototype._renderSearchResults = function (data) {
        var c = this._options.classes;
        var _this = this;
        var result = '';
        this._$wrapper.find("." + c.search.resultsWrapper).html('');
        if (data.length) {
            result += "<ul class=\"" + c.search.resultsUL + "\">";
            for (var i = 0; i < data.length; i++) {
                var path = $(data[i].path).map(function () {
                    return this;
                }).get().join(' / ');
                var checked = $("#cp-" + this._prefix + "-" + data[i].value).prop('checked') ? 'checked' : '';
                var disabled = $("#cp-" + this._prefix + "-" + data[i].value).prop('disabled') ? 'disabled' : '';
                result += "<li class=\"" + c.search.resultsLI + "\" role=\"option-group\">";
                if (this._options.multiple) {
                    result += "<div class=\"cc-input cc-input--type-checkbox\">\n                        <input class=\"cc-input__checkbox | " + c.dropdown.checkbox + "\" type=\"checkbox\" value=\"" + data[i].value + "\" name=\"cp-sr-" + this._prefix + "[]\" id=\"cp-sr-" + this._prefix + "-" + data[i].value + "\" tabindex=\"-1\" " + checked + " " + disabled + ">";
                }
                else {
                    result += "<div class=\"cc-input cc-input--type-radio\">\n                        <input class=\"cc-input__radio | " + c.dropdown.radio + "\" type=\"radio\" value=\"" + data[i].value + "\" name=\"cp-sr-" + this._prefix + "[]\" id=\"cp-sr-" + this._prefix + "-" + data[i].value + "\" tabindex=\"-1\" " + checked + " " + disabled + ">";
                }
                result += "<label for=\"cp-sr-" + this._prefix + "-" + data[i].value + "\" class=\"cc-input__label | " + c.search.label + "\">\n                    " + data[i].label + " \n                    <span class=\"" + c.search.resultsPath + "\">" + path + "</span>\n                </label></div>\n                </li>";
            }
            result += '</ul>';
        }
        this._$wrapper.find("." + c.search.resultsWrapper).html(result);
        this._$wrapper.find("." + c.search.resultsUL + " input[type=\"checkbox\"]").off('change').on('change', function () {
            _this._$wrapper.find("." + c.menu.content + " :input[value=\"" + this.value + "\"]").trigger('click');
        });
        var text = data.length === 1 ? data.length + " " + $t('Result') : data.length + " " + $t('Results');
        this._$wrapper.find("." + this._options.classes.search.resultsQty).html(text);
        this._setEvents();
    };
    /**
     * Recursive method to filter categories by label based on given query (string or its part)
     * @param {category} root category to start from
     * @param {query} string that we look for in category labels
     * @param {path} Path to the subcategory (used to display crumbs)
     * @return {categories} Array of filtered categories
     */
    categoryPicker.prototype._getByQuery = function (category, query, path) {
        var _this = this;
        if (path === void 0) { path = []; }
        var categories = [];
        if (category.is_active === '1' && category.label && category.label.match(new RegExp(query, 'i'))) {
            categories.push({
                label: category.label,
                value: category.value,
                path: path,
            });
        }
        if (category.optgroup) {
            var categoryPath_1 = category.label ? path.concat([category.label]) : [];
            category.optgroup.forEach(function (subcategory) {
                _this._getByQuery(subcategory, query, categoryPath_1).map(function (cat) {
                    if (subcategory.is_active === '1') {
                        return categories.push(cat);
                    }
                });
            });
        }
        return categories;
    };
    /**
     * Recursive methods to filter categories collection to get only children of given ID
     * @param {id} ID of category to filter
     * @param {children} Optional - Array of children of a category
     * @return {result} Filtered array of children
     */
    categoryPicker.prototype._getChildren = function (id, children) {
        var collection = children || this._categoriesData;
        if (collection.value && collection.value === id) {
            return collection;
        }
        if (collection.optgroup) {
            var c = collection.optgroup;
            for (var i = 0; i < c.length; i++) {
                var result = this._getChildren(id, c[i]);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    };
    /**
     * Recursive method to render list with categories as a radios / checkboxes using
     * @param {categories} Array with categories
     * @param {str} Current HTML markup of the list
     * @param {dropdownModifier} Modifier class for dropdown for styling purposes
     * @return {str} HTML markup of options list
     */
    categoryPicker.prototype._getContents = function (categories, str, dropdownModifier) {
        var c = this._options.classes;
        if (!dropdownModifier) {
            dropdownModifier = '';
        }
        str += "<ul class=\"" + c.dropdown.ul + " " + c.dropdown.ul + "--hidden " + dropdownModifier + "\">";
        /**
         * Loop through categories array and find optgroups.
         * Then make a UL element out of each optgroup and build general markup
         */
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].is_active === '1') {
                var checked = $("#cp-" + this._prefix + "-" + categories[i].value).prop('checked') ? 'checked' : '';
                str += "<li class=\"" + c.dropdown.li + "\" data-role=\"option-group\">";
                if (this._options.multiple) {
                    str += "<div class=\"cc-input cc-input--type-checkbox | " + c.dropdown.li + "-content\">\n                        <input class=\"cc-input__checkbox | " + c.dropdown.checkbox + "\" type=\"checkbox\" value=\"" + categories[i].value + "\" name=\"cp-" + this._prefix + "[]\" id=\"cp-" + this._prefix + "-" + categories[i].value + "\" tabindex=\"-1\" " + checked + ">";
                }
                else {
                    str += "<div class=\"cc-input cc-input--type-radio | " + c.dropdown.li + "-content\">\n                        <input class=\"cc-input__radio | " + c.dropdown.radio + "\" type=\"radio\" value=\"" + categories[i].value + "\" name=\"cp-" + this._prefix + "[]\" id=\"cp-" + this._prefix + "-" + categories[i].value + "\" tabindex=\"-1\" " + checked + ">";
                }
                str += "<label for=\"cp-" + this._prefix + "-" + categories[i].value + "\" class=\"cc-input__label | " + c.dropdown.label + "\">" + categories[i].label + "</label>";
                if (categories[i].optgroup && categories[i].optgroup.length && this._options.showChildren) {
                    str += "<div class=\"" + c.dropdown.toggler + "\"></div></div>\n                        " + this._getContents(categories[i].optgroup, '');
                }
                else {
                    str += '</div>';
                }
                str += '</li>';
            }
        }
        str += '</ul>';
        return str;
    };
    /**
     * Adjusts markup after it is build
     */
    categoryPicker.prototype._afterBuild = function (openSubTree) {
        if (openSubTree === void 0) { openSubTree = true; }
        var c = this._options.classes;
        var _this = this;
        this._$wrapper.find("." + c.menu.content + " > ." + c.dropdown.ul).removeClass(c.dropdown.ul + "--hidden");
        if (openSubTree) {
            this.openSubcategoriesTree(this._$wrapper.find("." + c.menu.content + " > ul > li:first-child"));
        }
        this._$wrapper.find("." + c.dropdown.li).each(function () {
            if ($(this).find("." + c.dropdown.ul).length) {
                $(this).addClass(c.dropdown.li + "--has-children");
            }
            else if (_this._options.disableLastLevelItems) {
                $(this).addClass(c.dropdown.li + "--disabled").find('input').prop('disabled', true);
            }
        });
    };
    /**
     * Support for exising value. If there is already some input (category IDs) in $output field
     * then it constrols initialization to setup those categories in picker's output HTML
     */
    categoryPicker.prototype._rebuildValues = function () {
        if (this._$output[0].value !== '') {
            var values = this._$output[0].value.split(',');
            for (var i = 0; i < values.length; i++) {
                var $cb = this._$wrapper.find("." + this._options.classes.menu.content + " input[value=\"" + values[i] + "\"]");
                if ($cb.length) {
                    $cb.prop('checked', true);
                    this._orderedCheckboxes.push($cb[0]);
                }
            }
            this.updatePicker(this._orderedCheckboxes);
        }
    };
    /**
     * Sets most of events of picker
     */
    categoryPicker.prototype._setEvents = function () {
        var c = this._options.classes;
        var _this = this;
        var fKeys = [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]; // F1-F12
        var listen = /^[a-zA-Z0-9._\b\-\s]+$/i;
        this._$wrapper.find("." + c.input.base + "-opener").off('click').on('click', function () {
            if (_this._isOpen) {
                _this.closePicker($(this).parents("." + c.base));
            }
            else {
                _this.openPicker($(this).parents("." + c.base));
            }
        });
        this._$wrapper.find("." + c.actions.button).off('click').on('click', function () {
            _this.closePicker($(this).parents("." + c.base));
        });
        this._$wrapper.find("." + c.dropdown.toggler).off('click').on('click', function () {
            _this.openSubcategoriesTree($(this).parents("." + c.dropdown.li).first());
        });
        this._$wrapper.find("." + c.menu.content + " input[type=\"checkbox\"]").off('change').on('change', function () {
            var idx = _this._orderedCheckboxes.indexOf(this);
            if (idx !== -1) {
                _this._orderedCheckboxes.splice(idx, 1);
            }
            if (this.checked) {
                _this._orderedCheckboxes.push(this);
            }
            for (var i = void 0; i < _this._orderedCheckboxes.length; i++) {
                var val = _this._orderedCheckboxes[i].value;
                if (_this._$wrapper.find("." + c.search.resultsUL + " input[value=\"" + val + "\"]").length) {
                    _this._$wrapper.find("." + c.menu.content + " input[value=\"" + val + "\"]").prop('checked', true);
                }
            }
            _this.updatePicker(_this._orderedCheckboxes);
        });
        this._$wrapper.find("." + c.menu.base + " input[type=\"radio\"]").off('change').on('change', function () {
            if (_this._$wrapper.find("." + c.search.resultsUL + " input[value=\"" + this.value + "\"]").length) {
                _this._$wrapper.find("." + c.menu.content + " input[value=\"" + this.value + "\"]").prop('checked', true);
            }
            _this.updatePicker(this);
        });
        this._$wrapper.find("." + c.search.input).off('keyup').on({
            keyup: function (e) {
                if (this.value.length >= _this._options.minSearchQueryLength) {
                    var key = String.fromCharCode(e.keyCode).toLowerCase();
                    if (key.match(listen) && fKeys.indexOf(e.which) === -1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                        _this._renderSearchResults(_this._getByQuery(_this._categoriesData, this.value));
                    }
                    _this._$wrapper.find("." + c.search.resultsWrapper).show();
                    _this._$wrapper.find("." + c.search.resultsQty).show();
                    _this._$wrapper.find("." + c.menu.content).hide();
                }
                else {
                    _this._$wrapper.find("." + c.search.resultsWrapper).hide();
                    _this._$wrapper.find("." + c.search.resultsQty).hide();
                    _this._$wrapper.find("." + c.menu.content).show();
                }
            },
        });
    };
    /**
     * Controls crumbs in picker's select field
     */
    categoryPicker.prototype._setCrumbsEvents = function () {
        var _this = this;
        this._$wrapper.find("." + _this._options.classes.base + "__crumb-remove").off('click').on('click', function (e) {
            var $target = _this._$wrapper.find("." + _this._options.classes.menu.content + " input[value=\"" + $(this).data('value') + "\"]");
            var $srTarget = _this._$wrapper.find("." + _this._options.classes.search.resultsWrapper + " input[value=\"" + $(this).data('value') + "\"]");
            if (_this._options.multiple) {
                $target.click();
            }
            else {
                if ($target.prop('checked')) {
                    $target.prop('checked', false);
                    _this.updatePicker();
                }
            }
            if ($srTarget.length) {
                $srTarget.prop('checked', !$srTarget.prop('checked'));
            }
            e.preventDefault();
        });
    };
    return categoryPicker;
}());

/**
 * Category links configurator component.
 * This component is responsible for displaying category links configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var categoryLinksConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: "<form class=\"cc-category-links-configurator {{ classes }} | {{ mix }}\" {{ attributes }} @submit.prevent=\"onSave\">\n        <div class=\"cc-input cc-input--type-inline\">\n            <label class=\"cc-input__label\">" + $t('Category') + "</label>\n            <input type=\"hidden\" v-model=\"configuration.main_category_id\" id=\"cp-main\">\n        </div>\n        <div class=\"cc-input cc-input--type-inline\">\n            <label class=\"cc-input__label\">" + $t('Subcategories') + "</label>\n            <input type=\"hidden\" v-model=\"configuration.sub_categories_ids\" id=\"cp-sub\">\n        </div>\n        \n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-shownumbers\" class=\"cc-input__label\">" + $t('Show products count') + "</label>\n            <div class=\"admin__actions-switch\" data-role=\"switcher\">\n                <input type=\"checkbox\" class=\"admin__actions-switch-checkbox\" id=\"cfg-shownumbers\" name=\"use_name_in_product_search\" v-model=\"configuration.shownumbers\" @change=\"onChange\">\n                <label class=\"admin__actions-switch-label\" for=\"cfg-shownumbers\">\n                    <span class=\"admin__actions-switch-text\" data-text-on=\"" + $t('Yes') + "\" data-text-off=\"" + $t('No') + "\"></span>\n                </label>\n            </div>\n        </div>\n    </form>",
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            this.configuration.main_category_labels = this.categoryPicker._categoriesLabels;
            this.configuration.sub_categories_labels = this.subCategoriesPicker._categoriesLabels;
            this.onSave();
        },
    },
    props: {
        configuration: {
            type: Object,
            default: function () {
                return {
                    main_category_id: '',
                    sub_categories_ids: '',
                    shownumbers: false,
                };
            },
        },
        /* Obtain endpoint for getting categories data for category picker */
        categoriesDataUrl: {
            type: String,
            default: '',
        },
    },
    data: function () {
        return {
            categoryPicker: undefined,
            subCategoriesPicker: undefined,
        };
    },
    ready: function () {
        var _this = this;
        // Show loader
        $('body').trigger('showLoadingPopup');
        this.$http.get(this.categoriesDataUrl).then(function (response) {
            _this.initializePickers(JSON.parse(response.body));
            // Hide loader
            $('body').trigger('hideLoadingPopup');
        });
    },
    methods: {
        initializePickers: function (categories) {
            var _this = this;
            this.subCategoriesPicker = new categoryPicker($('#cp-sub'), categories, {
                showSearch: false,
                disabled: this.configuration.main_category_id === '',
            });
            this.categoryPicker = new categoryPicker($('#cp-main'), categories, {
                multiple: false,
            });
            if (this.configuration.main_category_id !== '') {
                this.subCategoriesPicker.showChildrenOnly(this.configuration.main_category_id);
            }
            $('#cp-main').on('change', function () {
                _this.updateSubcategoriesPicker(_this.configuration.main_category_id);
            });
        },
        updateSubcategoriesPicker: function (catId) {
            this.subCategoriesPicker.resetAll();
            if (catId !== '') {
                this.subCategoriesPicker.showChildrenOnly(catId);
                this.subCategoriesPicker.enable();
            }
            else {
                this.subCategoriesPicker.disable();
            }
        }
    },
};

/**
 * CMS Pages Teaser configurator component.
 * This component is responsible for displaying CMS pages teaser configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var cmsPagesTeaserConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: "<div class=\"cc-cms-pages-teaser-configurator {{ classes }} | {{ mix }}\" {{ attributes }}>\n        <section class=\"cc-cms-pages-teaser-configurator__section\">\n            <h3 class=\"cc-cms-pages-teaser-configurator__subtitle\">" + $t('Data source') + "</h3>\n            <div class=\"cc-cms-pages-teaser-configurator__scenario-options cc-cms-pages-teaser-configurator__scenario-options--inputs\">\n                <div class=\"cc-input cc-input--type-inline | cc-cms-pages-teaser-configurator__section-option\">\n                    <label class=\"cc-input__label | cc-cms-pages-teaser-configurator__section-option-label\">" + $t('CMS Tags') + ":</label>\n                    <input type=\"hidden\" v-model=\"configuration.tags\" @change=\"onChange\" id=\"cp-cms-pages-teaser\">\n                </div>\n                <div class=\"cc-cms-pages-teaser-configurator__section-option\">\n                    <div class=\"cc-input\">\n                        <label class=\"cc-input__label\" for=\"cfg-cmspt-page-ids\">" + $t('CMS Pages IDs') + ":</label>\n                        <input type=\"text\" name=\"cfg-cmspt-page-ids\" class=\"cc-input__input\" id=\"cfg-cmspt-page-ids\" v-model=\"configuration.ids\" @change=\"onChange\">\n                    </div>\n                    <div class=\"cc-input cc-input--type-inline cc-input--type-hint\">\n                        <span class=\"cc-input__hint cc-input__hint--under-field\">" + $t('Multiple, comma-separated.') + "</span>\n                    </div>\n                    <div class=\"cc-input cc-input--type-inline cc-input--type-hint\" v-if=\"configuration.ids.length\">\n                        <span class=\"cc-input__hint cc-input__hint--info-mark\">" + $t('Providing list of comma separated IDs will result in ignoring any CMS tags (if specified). Only pages with specified IDs will be displayed in exactly the same order as they are provided in the field.') + "</span>\n                    </div>\n                </div>\n\n                <div class=\"cc-input cc-input--type-inline | cc-cms-pages-teaser-configurator__section-option\">\n                    <label for=\"cfg-cmspt-limit\" class=\"cc-input__label | cc-cms-pages-teaser-configurator__section-option-label\">" + $t('Teasers limit') + ":</label>\n                    <select name=\"cfg-cmspt-limit\" class=\"cc-input__select\" id=\"cfg-cmspt-limit\" v-model=\"configuration.limit\" @change=\"onChange\">\n                        <option value=\"4\">" + $t('4 teasers') + "</option>\n                        <option value=\"8\">" + $t('8 teasers') + "</option>\n                        <option value=\"16\">" + $t('16 teasers') + "</option>\n                        <option value=\"1000\">" + $t('All available teasers (no limit)') + "</option>\n                    </select>\n                </div>\n\n                <div class=\"cc-input cc-input--type-inline | cc-cms-pages-teaser-configurator__section-option\">\n                    <label for=\"cfg-cmspt-text-variant\" class=\"cc-input__label | cc-cms-pages-teaser-configurator__section-option-label\">" + $t('Display variant') + ":</label>\n                    <select name=\"cfg-cmspt-text-variant\" class=\"cc-input__select\" id=\"cfg-cmspt-text-variant\" v-model=\"configuration.textDisplayVariant\" @change=\"onChange\">\n                        <template v-for=\"(idx, scenario) in imageTeasersContentPositions\">\n                            <option value=\"{{ idx + 1 }}\">" + $t('{{ scenario }}') + "</option>\n                        </template>\n                    </select>\n                </div>\n            </div>\n        </section>\n\n        <section class=\"cc-cms-pages-teaser-configurator__section\">\n            <h3 class=\"cc-cms-pages-teaser-configurator__subtitle\">Desktop Layout</h3>\n            <div class=\"cc-cms-pages-teaser-configurator__scenario-options\">\n                <div class=\"cc-cms-pages-teaser-configurator__scenario-options-list\">\n                    <li\n                        :class=\"{\n                            'cc-cms-pages-teaser-configurator__option--selected': configuration.currentScenario.desktopLayout.id == optionId,\n                        }\"\n                        class=\"cc-cms-pages-teaser-configurator__option\"\n                        v-for=\"(optionId, option) in scenarioOptions.desktopLayout\"\n                        @click=\"toggleOption('desktopLayout', optionId)\">\n                        <div class=\"cc-cms-pages-teaser-configurator__option-wrapper\">\n                            <svg class=\"cc-cms-pages-teaser-configurator__option-icon\">\n                                <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                            </svg>\n                        </div>\n                        <p class=\"cc-cms-pages-teaser-configurator__option-name\">\n                            " + $t('{{ option.name }}') + "\n                        </p>\n                    </li>\n                </div>\n            </div>\n        </section>\n\n        <section class=\"cc-cms-pages-teaser-configurator__section\">\n            <h3 class=\"cc-cms-pages-teaser-configurator__subtitle\">Mobile Layout</h3>\n            <div class=\"cc-cms-pages-teaser-configurator__scenario-options\">\n                <ul class=\"cc-cms-pages-teaser-configurator__scenario-options-list\">\n                    <li\n                        :class=\"{\n                            'cc-cms-pages-teaser-configurator__option--selected': configuration.currentScenario.mobileLayout.id == optionId,\n                        }\"\n                        class=\"cc-cms-pages-teaser-configurator__option\"\n                        v-for=\"(optionId, option) in scenarioOptions.mobileLayout\"\n                        @click=\"toggleOption('mobileLayout', optionId)\">\n                        <div class=\"cc-cms-pages-teaser-configurator__option-wrapper\">\n                            <svg class=\"cc-cms-pages-teaser-configurator__option-icon\">\n                                <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                            </svg>\n                        </div>\n                        <p class=\"cc-cms-pages-teaser-configurator__option-name\">\n                            " + $t('{{ option.name }}') + "\n                        </p>\n                    </li>\n                </ul>\n            </div>\n        </section>\n    </div>",
    /**
     * Get dependencies
     */
    components: {
        'action-button': actionButton,
        'component-actions': componentActions,
    },
    props: {
        /**
         * Image teaser configuration
         */
        configuration: {
            type: Object,
            default: function () {
                return {
                    tags: '',
                    ids: '',
                    limit: '1000',
                    textDisplayVariant: '1',
                    currentScenario: {
                        desktopLayout: {},
                        mobileLayout: {},
                    },
                };
            },
        },
        /* Obtain stringified JSON with CMS tags data */
        cmsTags: {
            type: String,
            default: '',
        },
        /* Obtain content-constructor's config file */
        ccConfig: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    computed: {
        imageTeasersContentPositions: function () {
            return Object.values(this.ccConfig.imageTeasersContentPositions);
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            this.onSave();
        },
    },
    data: function () {
        return {
            scenarioOptions: {
                // Desktop layout scenario elements.
                desktopLayout: {
                    '2': {
                        name: '2 in row',
                        iconId: 'dl_2',
                        teasersNum: 2,
                    },
                    '4': {
                        name: '4 in row',
                        iconId: 'dl_4',
                        teasersNum: 4,
                    },
                },
                // Mobile layout scenario elements.
                mobileLayout: {
                    'slider': {
                        name: 'Slider',
                        iconId: 'ml_slider',
                    },
                    'grid': {
                        name: 'Grid',
                        iconId: 'ml_2-2',
                    },
                },
            },
        };
    },
    methods: {
        /*
         * Set the proper option after variant click
         */
        toggleOption: function (optionCategory, optionId) {
            this.configuration.currentScenario[optionCategory] = this.scenarioOptions[optionCategory][optionId];
            this.configuration.currentScenario[optionCategory].id = optionId;
        },
    },
    ready: function () {
        if (this.cmsTags !== '') {
            this.categoryPicker = new categoryPicker($('#cp-cms-pages-teaser'), JSON.parse(this.cmsTags), {
                multiple: true,
                minSearchQueryLength: 1,
                placeholders: {
                    select: $t('Select tags...'),
                    doneButton: $t('Done'),
                    search: $t('Type tag-name to search...'),
                    empty: $t('There are no tags matching your selection'),
                    removeCrumb: $t('Remove this tag'),
                },
                classes: {
                    baseMix: 'cc-category-picker--min',
                },
            });
        }
    }
};

/**
 * CustomHtml configurator component.
 * This component is responsible for displaying CustomHtmls configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var customHtmlConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: "<form class=\"cc-custom-html-configurator {{ classes }} | {{ mix }}\" {{ attributes }} @submit.prevent=\"onSave\">\n        <div class=\"cc-input cc-input--type-inline\">\n            <p class=\"cc-warning\">" + $t('This component is meant to be used only by developers due to high risk of breaking shop layout.') + "</p>\n        </div>\n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-title\" class=\"cc-input__label\">" + $t('Title') + ":</label>\n            <input type=\"text\" v-model=\"configuration.title\" id=\"cfg-title\" class=\"cc-input__input\" @change=\"onChange\" />\n        </div>\n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-markup\" class=\"cc-input__label\">" + $t('HTML markup') + ":</label>\n            <textarea v-model=\"configuration.markup\" id=\"cfg-markup\" class=\"cc-input__textarea\" @change=\"onChange\"></textarea>\n        </div>\n    </form>",
    props: {
        configuration: {
            type: Object,
            default: function () {
                return {
                    title: '',
                    markup: '',
                };
            },
        },
    },
};

/**
 * Daily deal teaser configurator component.
 * This component is responsible for displaying daily deal teaser configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var dailyDealTeaserConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: "<form class=\"cc-daily-deal-teaser-configurator\" {{ attributes }}>\n        <div class=\"cc-input cc-input--type-inline\">\n            <label class=\"cc-input__label\">" + $t('Categories') + ":</label>\n            <input type=\"hidden\" v-model=\"configuration.category_id\" @change=\"onChange\" id=\"cp-daily-deal-teaser\">\n        </div>\n\n        <div class=\"cc-input cc-input--type-inline\">\n            <label class=\"cc-input__label\" for=\"cfg-ddt-skus\">" + $t('SKUs') + ":</label>\n            <input type=\"text\" name=\"cfg-ddt-skus\" class=\"cc-input__input\" id=\"cfg-ddt-skus\" v-model=\"configuration.skus\" @change=\"onChange\">\n        </div>\n        <div class=\"cc-input cc-input--type-inline cc-input--type-hint\">\n            <label class=\"cc-input__label\"> </label>\n            <span class=\"cc-input__hint cc-input__hint--under-field\">" + $t('Multiple, comma-separated') + "</span>\n        </div>\n        <div class=\"cc-input cc-input--type-inline cc-input--type-hint\" v-if=\"configuration.skus.length\">\n            <label class=\"cc-input__label\"> </label>\n            <span class=\"cc-input__hint cc-input__hint--under-field cc-input__hint--info-mark\">" + $t('Providing list of comma separated SKUs will disable any filtering and sorting configured for that component.  Category (if specified) will also not be taken into account. Only products with specified SKUs will be displayed in exactly the same order as they are provided in SKUs field.') + "</span>\n        </div>\n\n        <div class=\"cc-input cc-input--type-inline\">\n            <label class=\"cc-input__label\" for=\"cfg-ddt-dataprovider\">" + $t('Custom Data Provider') + ":</label>\n            <input type=\"text\" name=\"cfg-ddt-dataprovider\" class=\"cc-input__input\" id=\"cfg-ddt-dataprovider\" v-model=\"configuration.class_overrides.dataProvider\" @change=\"onChange\">\n        </div>\n\n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-ddt-filter\" class=\"cc-input__label\">" + $t('Filter') + ":</label>\n            <select name=\"cfg-ddt-filter\" class=\"cc-input__select\" id=\"cfg-ddt-filter\" v-model=\"configuration.filter\" @change=\"onChange\">\n                <option value=\"\">" + $t('No filter') + "</option>\n                <template v-for=\"filter in productCollectionsFilters\">\n                    <option value=\"{{ filter.value }}\" :selected=\"filter.value === configuration.filter\">{{ filter.label }}</option>\n                </template>\n            </select>\n        </div>\n\n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-ddt-order-by\" class=\"cc-input__label\">" + $t('Order by') + ":</label>\n            <select name=\"cfg-ddt-order-by\" class=\"cc-input__select\" id=\"cfg-ddt-order-by\" v-model=\"configuration.order_by\" @change=\"onChange\">\n                <option value=\"\">" + $t('Not specified') + "</option>\n                <template v-for=\"sorter in productCollectionsSorters\">\n                    <option value=\"{{ sorter.value }}\" :selected=\"sorter.value === configuration.order_by\">{{ sorter.label }}</option>\n                </template>\n            </select>\n            <select name=\"cfg-ddt-order-type\" class=\"cc-input__select\" v-model=\"configuration.order_type\" @change=\"onChange\">\n                <option value=\"ASC\">" + $t('Ascending') + "</option>\n                <option value=\"DESC\">" + $t('Descending') + "</option>\n            </select>\n        </div>\n    </form>",
    props: {
        configuration: {
            type: Object,
            default: function () {
                return {
                    category_id: '',
                    filter: '',
                    order_by: 'creation_date',
                    order_type: 'DESC',
                    skus: '',
                    class_overrides: {
                        dataProvider: '',
                    },
                };
            },
        },
        /* Obtain endpoint for getting categories data for category picker */
        categoriesDataUrl: {
            type: String,
            default: '',
        },
        productCollectionsSorters: {
            type: [String, Array],
            default: '',
        },
        productCollectionsFilters: {
            type: [String, Array],
            default: '',
        },
    },
    data: function () {
        return {
            categoryPicker: undefined,
        };
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            if (this.configuration.class_overrides.dataProvider === '') {
                delete this.configuration.class_overrides;
            }
            this.onSave();
        },
    },
    ready: function () {
        var _this = this;
        this.productCollectionsSorters = this.productCollectionsSorters !== '' ? JSON.parse(this.productCollectionsSorters) : [];
        this.productCollectionsFilters = this.productCollectionsFilters !== '' ? JSON.parse(this.productCollectionsFilters) : [];
        if (!this.configuration.class_overrides) {
            this.configuration.class_overrides = {
                dataProvider: '',
            };
        }
        // Show loader
        $('body').trigger('showLoadingPopup');
        // Get categories JSON with AJAX
        this.$http.get(this.categoriesDataUrl).then(function (response) {
            _this.categoryPicker = new categoryPicker($('#cp-daily-deal-teaser'), JSON.parse(response.body), {
                multiple: false,
            });
            // Hide loader
            $('body').trigger('hideLoadingPopup');
        });
    },
};

/**
 * Headline configurator component.
 * This component is responsible for displaying headlines' configuration modal
 * @type {vuejs.ComponentOption} Vue component object.
 */
var headlineConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: "<div class=\"cc-headline-configurator {{ classes }} | {{ mix }}\" {{ attributes }} @submit.prevent=\"onSave\">\n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-headline\" class=\"cc-input__label\">" + $t('Headline') + ":</label>\n            <input type=\"text\" v-model=\"configuration.title\" id=\"cfg-headline\" class=\"cc-input__input\" @change=\"onChange\">\n        </div>\n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-subheadline\" class=\"cc-input__label\">" + $t('Subheadline') + ":</label>\n            <input type=\"text\" v-model=\"configuration.subtitle\" id=\"cfg-subheadline\" class=\"cc-input__input\" @change=\"onChange\">\n        </div>\n\n        <div class=\"cc-headline-configurator__advanced-trigger\">\n            <span :class=\"isAvdancedSettingsOpen ? 'active' : ''\" role=\"button\" @click=\"toggleAdvancedContent()\">" + $t('Advanced settings') + "</span>\n        </div>\n\n        <div class=\"cc-headline-configurator__advanced-content\" v-show=\"isAvdancedSettingsOpen\">\n            <div class=\"cc-input cc-input--type-inline\">\n                <label for=\"cfg-heading-tag\" class=\"cc-input__label\">" + $t('Level of Heading tag') + ":</label>\n                <select name=\"cfg-heading-tag\" class=\"cc-input__select\" id=\"cfg-heading-tag\" v-model=\"configuration.headingTag\" @change=\"onChange\">\n                    <option v-for=\"n in 6\" value=\"h{{ n+1 }}\" :selected=\"n+1 === configuration.headingTag\">Heading {{ n+1 }} (h{{ n+1 }})</option>\n                </select>\n            </div>\n        </div>\n    </div>",
    props: {
        configuration: {
            type: Object,
            default: function () {
                return {
                    title: '',
                    subtitle: '',
                    headingTag: 'h2',
                };
            },
        },
    },
    data: function () {
        return {
            isAvdancedSettingsOpen: false,
        };
    },
    methods: {
        toggleAdvancedContent: function () {
            this.isAvdancedSettingsOpen = !this.isAvdancedSettingsOpen;
        },
    },
    ready: function () {
        if (!this.configuration.headingTag) {
            this.configuration.headingTag = 'h2';
        }
    },
};

// Pattern for teaser Item
var heroItemDataPattern = {
    image: '',
    decodedImage: '',
    displayVariant: 'variant-1',
    colorScheme: 'light',
    headline: '',
    subheadline: '',
    paragraph: '',
    ctaLabel: $t('Check offer'),
    href: '',
    sizeInfo: '',
    aspectRatio: '',
};
/**
 * Hero carousel configurator component.
 * This component is responsible for displaying image teaser's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var heroCarouselConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    /**
     * Get dependencies
     */
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
    },
    template: "<div class=\"cc-hero-carousel-configurator | {{ class }}\">\n        <section class=\"cc-hero-carousel-configurator__section\">\n            <h3 class=\"cc-hero-carousel-configurator__subtitle\">Mobile Devices Scenario</h3>\n            <div class=\"cc-hero-carousel-configurator__scenario-options\">\n                <ul class=\"cc-hero-carousel-configurator__scenario-options-list\">\n                    <li\n                        :class=\"{\n                            'cc-hero-carousel-configurator__option--selected': configuration.mobileDisplayVariant.id == optionId,\n                        }\"\n                        class=\"cc-hero-carousel-configurator__option\"\n                        v-for=\"(optionId, option) in scenarioOptions.mobileDisplayVariant\"\n                        @click=\"setOption('mobileDisplayVariant', optionId)\">\n                        <div class=\"cc-hero-carousel-configurator__option-wrapper\">\n                            <svg class=\"cc-hero-carousel-configurator__option-icon\">\n                                <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                            </svg>\n                        </div>\n                        <p class=\"cc-hero-carousel-configurator__option-name\">\n                            {{ option.name }}\n                        </p>\n                    </li>\n                </ul>\n            </div>\n        </section>\n\n        <h3 class=\"cc-hero-carousel-configurator__title\">Content</h3>\n\n        <component-adder class=\"cc-component-adder cc-component-adder--static\" v-show=\"!configuration.items.length\">\n            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-hero-carousel-configurator__item-action-button\" @click=\"createNewHeroItem( 0 )\">\n                <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                    <use xlink:href=\"#icon_plus\"></use>\n                </svg>\n            </button>\n        </component-adder>\n\n        <template v-for=\"item in configuration.items\">\n            <div class=\"cc-hero-carousel-configurator__item\" id=\"cc-hero-carousel-item-{{ $index }}\">\n                <component-adder class=\"cc-component-adder cc-component-adder--first\">\n                    <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-hero-carousel-configurator__item-action-button\" @click=\"createNewHeroItem( $index )\">\n                        <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                            <use xlink:href=\"#icon_plus\"></use>\n                        </svg>\n                    </button>\n                </component-adder>\n\n                <div class=\"cc-hero-carousel-configurator__item-content\">\n                    <div v-bind:class=\"[ 'cc-hero-carousel-configurator__item-col-left', configuration.items[$index].image ? 'cc-hero-carousel-configurator__item-col-left--look-image-uploaded' : '' ]\">\n                        <div class=\"cc-hero-carousel-configurator__item-image-wrapper\">\n                            <img :src=\"configuration.items[$index].image\" class=\"cc-hero-carousel-configurator__item-image\" v-show=\"configuration.items[$index].image\">\n                            <input type=\"hidden\" v-model=\"configuration.items[$index].image\">\n                            <input type=\"hidden\" class=\"cc-hero-carousel-configurator__image-url\" id=\"hero-img-{{$index}}\">\n                            <svg class=\"cc-hero-carousel-configurator__item-image-placeholder\" v-show=\"!configuration.items[$index].image\">\n                                <use xlink:href=\"#icon_image-placeholder\"></use>\n                            </svg>\n\n                            <div class=\"cc-hero-carousel-configurator__item-actions\">\n                                <component-actions>\n                                    <template slot=\"cc-component-actions__buttons\">\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--up | cc-hero-carousel-configurator__item-action-button\" @click=\"moveHeroItemUp( $index )\" :class=\"[ isFirstHeroItem( $index ) ? 'cc-action-button--look_disabled' : '' ]\" :disabled=\"isFirstHeroItem( $index )\">\n                                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                <use xlink:href=\"#icon_arrow-up\"></use>\n                                            </svg>\n                                        </button>\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--down | cc-hero-carousel-configurator__item-action-button\" @click=\"moveHeroItemDown( $index )\" :class=\"[ isLastHeroItem( $index ) ? 'cc-action-button--look_disabled' : '' ]\" :disabled=\"isLastHeroItem( $index )\">\n                                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                <use xlink:href=\"#icon_arrow-down\"></use>\n                                            </svg>\n                                        </button>\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon | cc-component-actions__button cc-component-actions__button--upload-image | cc-hero-carousel-configurator__item-action-button\" @click=\"getImageUploader( $index )\">\n                                                <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                    <use xlink:href=\"#icon_upload-image\"></use>\n                                                </svg>\n                                                {{ configuration.items[$index].image ? imageUploadedText : noImageUploadedText }}\n                                        </button>\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--delete | cc-hero-carousel-configurator__item-action-button\" @click=\"deleteHeroItem( $index )\">\n                                            <svg class=\"cc-action-button__icon\">\n                                                <use xlink:href=\"#icon_trash-can\"></use>\n                                            </svg>\n                                        </button>\n                                    </template>\n                                </component-actions>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"cc-hero-carousel-configurator__item-col-right\">\n                        <div class=\"cc-input cc-input--group\">\n                            <div class=\"cc-input | cc-hero-carousel-configurator__item-form-element\">\n                                <label for=\"cfg-hc-item{{ $index }}-variant\" class=\"cc-input__label\">" + $t('Display variant') + ":</label>\n                                <select name=\"cfg-hc-item{{ $index }}-variant\" class=\"cc-input__select | cc-hero-carousel-configurator__select\" id=\"cfg-hc-item{{ $index }}-variant\" v-model=\"configuration.items[$index].displayVariant\"\">\n                                    <template v-for=\"(idx, scenario) in imageTeasersContentPositions\">\n                                        <option value=\"variant-{{ idx + 1 }}\">" + $t('{{ scenario }}') + "</option>\n                                    </template>\n                                </select>\n                            </div>\n                            <div class=\"cc-input | cc-hero-carousel-configurator__item-form-element\">\n                                <label for=\"cfg-hc-item{{ $index }}-color-scheme\" class=\"cc-input__label\">" + $t('Text color scheme') + ":</label>\n                                <select name=\"cfg-hc-item{{ $index }}-color-scheme\" class=\"cc-input__select | cc-hero-carousel-configurator__select\" id=\"cfg-hc-item{{ $index }}-color-scheme\" v-model=\"configuration.items[$index].colorScheme\">\n                                    <option value=\"light\">" + $t('Light') + "</option>\n                                    <option value=\"dark\">" + $t('Dark') + "</option>\n                                </select>\n                            </div>\n                        </div>\n                        <div class=\"cc-input | cc-hero-carousel-configurator__item-form-element\">\n                            <label for=\"cfg-hc-item{{ $index }}-headline\" class=\"cc-input__label\">" + $t('Headline') + ":</label>\n                            <input type=\"text\" v-model=\"configuration.items[$index].headline\" id=\"cfg-hc-item{{ $index }}-headline\" class=\"cc-input__input\">\n                        </div>\n                        <div class=\"cc-input | cc-hero-carousel-configurator__item-form-element\">\n                            <label for=\"cfg-hc-item{{ $index }}-subheadline\" class=\"cc-input__label\">" + $t('Subheadline') + ":</label>\n                            <input type=\"text\" v-model=\"configuration.items[$index].subheadline\" id=\"cfg-hc-item{{ $index }}-subheadline\" class=\"cc-input__input\">\n                        </div>\n                        <div class=\"cc-input | cc-hero-carousel-configurator__item-form-element\">\n                            <label for=\"cfg-hc-item{{ $index }}-paragraph\" class=\"cc-input__label\">" + $t('Paragraph') + ":</label>\n                            <textarea type=\"text\" v-model=\"configuration.items[$index].paragraph\" id=\"cfg-hc-item{{ $index }}-paragraph\" class=\"cc-input__textarea\"></textarea>\n                        </div>\n                        <div class=\"cc-input cc-input--group\">\n                            <div class=\"cc-input | cc-hero-carousel-configurator__item-form-element\">\n                                <label for=\"cfg-hc-item{{ $index }}-cta-label\" class=\"cc-input__label\">" + $t('CTA label') + ":</label>\n                                <input type=\"text\" v-model=\"configuration.items[$index].ctaLabel\" id=\"cfg-hc-item{{ $index }}-cta-label\" class=\"cc-input__input\">\n                            </div>\n                            <div class=\"cc-input cc-input--type-addon | cc-hero-carousel-configurator__item-form-element\">\n                                <label for=\"hero-ctatarget-output-{{ $index }}\" class=\"cc-input__label\">" + $t('CTA target link') + ":</label>\n                                <input type=\"text\" class=\"cc-input__input | cc-hero-carousel-configurator__cta-target-link\" v-model=\"configuration.items[$index].href\" id=\"hero-ctatarget-output-{{ $index }}\">\n                                <span class=\"cc-input__addon | cc-hero-carousel-configurator__widget-chooser-trigger\" @click=\"openCtaTargetModal( $index )\">\n                                    <svg class=\"cc-input__addon-icon\">\n                                        <use xlink:href=\"#icon_link\"></use>\n                                    </svg>\n                                </span>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <component-adder class=\"cc-component-adder cc-component-adder--last\">\n                    <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-hero-carousel-configurator__item-action-button\" @click=\"createNewHeroItem( $index + 1 )\">\n                        <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                            <use xlink:href=\"#icon_plus\"></use>\n                        </svg>\n                    </button>\n                </component-adder>\n            </div>\n        </template>\n\n        <div class=\"cc-hero-carousel-configurator__modal\" v-el:error-modal></div>\n    </div>",
    props: {
        /*
         * Single's component configuration
         */
        configuration: {
            type: Object,
            default: function () {
                return {
                    mobileDisplayVariant: {},
                    items: [JSON.parse(JSON.stringify(heroItemDataPattern))],
                };
            },
        },
        /* get assets for displaying component images */
        assetsSrc: {
            type: String,
            default: '',
        },
        /* Obtain base-url for the image uploader */
        uploaderBaseUrl: {
            type: String,
            default: '',
        },
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
        /* Obtain admin url */
        adminPrefix: {
            type: String,
            default: 'admin',
        },
        /* Obtain content-constructor's config file */
        ccConfig: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    computed: {
        imageTeasersContentPositions: function () {
            return Object.values(this.ccConfig.imageTeasersContentPositions);
        },
    },
    data: function () {
        return {
            imageUploadedText: $t('Change'),
            noImageUploadedText: $t('Upload'),
            scenarioOptions: {
                // Mobile layout scenario elements.
                mobileDisplayVariant: {
                    'list': {
                        name: 'Large teaser',
                        iconId: 'ml_col',
                    },
                    'slider': {
                        name: 'Slider',
                        iconId: 'ml_slider',
                    },
                    'hidden': {
                        name: 'Hidden',
                        iconId: 'ml_hidden',
                    },
                },
            },
        };
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            //this.cleanupConfiguration();
            this.onSave();
        },
    },
    methods: {
        setOption: function (optionCategory, optionId) {
            this.configuration[optionCategory] = this.scenarioOptions[optionCategory][optionId];
            this.configuration[optionCategory].id = optionId;
        },
        /* Opens M2's built-in image manager modal
         * Manages all images: image upload from hdd, select image that was already uploaded to server
         * @param index {number} - index of image of hero item
         */
        getImageUploader: function (index) {
            MediabrowserUtility.openDialog(this.uploaderBaseUrl + "target_element_id/hero-img-" + index + "/", 'auto', 'auto', $t('Insert File...'), {
                closed: true,
            });
        },
        /* Listener for image uploader
         * Since Magento does not provide any callback after image has been chosen
         * we have to watch for target where decoded url is placed
         */
        imageUploadListener: function () {
            var component = this;
            var isAlreadyCalled = false;
            // jQuery has to be used, for some reason native addEventListener doesn't catch change of input's value
            $(document).on('change', '.cc-hero-carousel-configurator__image-url', function (event) {
                if (!isAlreadyCalled) {
                    isAlreadyCalled = true;
                    component.onImageUploaded(event.target);
                    setTimeout(function () {
                        isAlreadyCalled = false;
                    }, 100);
                }
            });
        },
        /* Action after image was uploaded
         * URL is encoded, so strip it and decode Base64 to get {{ media url="..."}} format
         * which will go to the items.image and will be used to display image on front end
         * @param input { object } - input with raw image path which is used in admin panel
         */
        onImageUploaded: function (input) {
            var _this = this;
            var itemIndex = input.id.substr(input.id.lastIndexOf('-') + 1);
            var encodedImage = input.value.match('___directive\/([a-zA-Z0-9]*)')[1];
            var imgEndpoint = this.imageEndpoint.replace('{/encoded_image}', encodedImage);
            this.configuration.items[itemIndex].decodedImage = Base64 ? Base64.decode(encodedImage) : window.atob(encodedImage);
            var img = new Image();
            img.onload = function () {
                var ar = _this.getAspectRatio(img.naturalWidth, img.naturalHeight);
                _this.configuration.items[itemIndex].image = img.getAttribute('src');
                _this.configuration.items[itemIndex].sizeInfo = img.naturalWidth + "x" + img.naturalHeight + "px (" + ar + ")";
                _this.configuration.items[itemIndex].aspectRatio = ar;
                setTimeout(function () {
                    _this.checkImageSizes();
                    _this.onChange();
                }, 400);
            };
            img.src = imgEndpoint;
        },
        /* Opens modal with M2 built-in widget chooser
         * @param index {number} - index of teaser item to know where to place output of widget chooser
         */
        openCtaTargetModal: function (index) {
            widgetTools.openDialog(window.location.origin + "/" + this.adminPrefix + "/admin/widget/index/filter_widgets/Link/widget_target_id/hero-ctatarget-output-" + index);
            this.wWidgetListener(index);
        },
        /* Sets listener for widget chooser
         * It triggers component.onChange to update component's configuration
         * after value of item.href is changed
         */
        widgetSetListener: function () {
            var _this = this;
            $('.cc-hero-carousel-configurator__cta-target-link').on('change', function () {
                _this.onChange();
            });
        },
        /*
         * Check if widget chooser is loaded. If not, wait for it, if yes:
         * Override default onClick for "Insert Widget" button in widget's modal window
         * to clear input's value before inserting new one
         * @param {number} index Hero item's index in array.
         */
        wWidgetListener: function (itemIndex) {
            var _this = this;
            if (typeof wWidget !== 'undefined' && widgetTools.dialogWindow[0].innerHTML !== '') {
                var button = widgetTools.dialogWindow[0].querySelector('#insert_button');
                button.onclick = null;
                button.addEventListener('click', function () {
                    _this.configuration.items[itemIndex].href = '';
                    wWidget.insertWidget();
                });
            }
            else {
                window.setTimeout(function () {
                    _this.wWidgetListener(itemIndex);
                }, 300);
            }
        },
        /**
         * Creates new hero item and adds it to a specified index.
         * @param {number} index New component's index in components array.
         */
        createNewHeroItem: function (index) {
            this.configuration.items.splice(index, 0, JSON.parse(JSON.stringify(heroItemDataPattern)));
            this.onChange();
        },
        /**
         * Moves hero item under given index up by swaping it with previous element.
         * @param {number} index Hero item's index in array.
         */
        moveHeroItemUp: function (index) {
            var _this = this;
            if (index > 0) {
                var $thisItem_1 = $("#m2c-hero-carousel-item-" + index);
                var $prevItem_1 = $("#m2c-hero-carousel-item-" + (index - 1));
                $thisItem_1.addClass('cc-hero-carousel-configurator__item--animating').css('transform', "translateY( " + -Math.abs($prevItem_1.outerHeight(true)) + "px)");
                $prevItem_1.addClass('cc-hero-carousel-configurator__item--animating').css('transform', "translateY(" + $thisItem_1.outerHeight(true) + "px)");
                setTimeout(function () {
                    _this.configuration.items.splice(index - 1, 0, _this.configuration.items.splice(index, 1)[0]);
                    _this.onChange();
                    $thisItem_1.removeClass('cc-hero-carousel-configurator__item--animating').css('transform', '');
                    $prevItem_1.removeClass('cc-hero-carousel-configurator__item--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Moves hero item under given index down by swaping it with next element.
         * @param {number} index Hero item's index in array.
         */
        moveHeroItemDown: function (index) {
            var _this = this;
            if (index < this.configuration.items.length - 1) {
                var $thisItem_2 = $("#cc-hero-carousel-item-" + index);
                var $nextItem_1 = $("#cc-hero-carousel-item-" + (index + 1));
                $thisItem_2.addClass('cc-hero-carousel-configurator__item--animating').css('transform', "translateY(" + $nextItem_1.outerHeight(true) + "px)");
                $nextItem_1.addClass('cc-hero-carousel-configurator__item--animating').css('transform', "translateY(" + -Math.abs($thisItem_2.outerHeight(true)) + "px)");
                setTimeout(function () {
                    _this.configuration.items.splice(index + 1, 0, _this.configuration.items.splice(index, 1)[0]);
                    _this.onChange();
                    $thisItem_2.removeClass('cc-hero-carousel-configurator__item--animating').css('transform', '');
                    $nextItem_1.removeClass('cc-hero-carousel-configurator__item--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Tells if item with given index is the first hero item.
         * @param  {number}  index Index of the hero item.
         * @return {boolean}       If hero item is first in array.
         */
        isFirstHeroItem: function (index) {
            return index === 0;
        },
        /**
         * Tells if hero item with given index is the last hero item.
         * @param  {number}  index Index of the hero item.
         * @return {boolean}       If hero item is last in array.
         */
        isLastHeroItem: function (index) {
            return index === this.configuration.items.length - 1;
        },
        /* Removes hero item after Delete button is clicked
         * and triggers hero item's onChange to update it's configuration
         * @param index {number} - index of hero item to remove
         */
        deleteHeroItem: function (index) {
            var component = this;
            confirm({
                content: $t('Are you sure you want to delete this item?'),
                actions: {
                    confirm: function () {
                        component.configuration.items.splice(index, 1);
                        component.onChange();
                    },
                },
            });
        },
        /* Cleans configuration for M2C content constructor after Saving component
         * All empty hero items has to be removed to not get into configuration object
         */
        cleanupConfiguration: function () {
            var filteredArray = this.configuration.items.filter(function (item) { return item.image !== ''; });
            this.configuration.items = filteredArray;
            this.onChange();
        },
        /* Checks if images are all the same size
         * If not - displays error by firing up this.displayImageSizeMismatchError()
         * @param images {array} - array of all uploaded images
         */
        checkImageSizes: function () {
            var itemsToCheck = JSON.parse(JSON.stringify(this.configuration.items)).filter(function (item) {
                return Boolean(item.aspectRatio); // Filter out items without aspect ratio set yet.
            });
            for (var i = 0; i < itemsToCheck.length; i++) {
                if (itemsToCheck[i].aspectRatio !== itemsToCheck[0].aspectRatio) {
                    alert({
                        title: $t('Warning'),
                        content: $t('Images you have uploaded have different aspect ratio. This may cause this component to display wrong. We recommend to keep the same aspect ratio for all uploaded images.'),
                    });
                    return false;
                }
            }
            return true;
        },
        /* Returns greatest common divisor for 2 numbers
         * @param a {number}
         * @param b {number}
         * @return {number} - greatest common divisor
         */
        getGreatestCommonDivisor: function (a, b) {
            if (!b) {
                return a;
            }
            return this.getGreatestCommonDivisor(b, a % b);
        },
        /* Returns Aspect ratio for 2 numbers based on GDC algoritm (greatest common divisor)
         * @param a {number}
         * @param b {number}
         * @return {number} - greatest common divisor
         */
        getAspectRatio: function (a, b) {
            var c = this.getGreatestCommonDivisor(a, b);
            return (a / c) + ":" + (b / c);
        },
    },
    ready: function () {
        this.imageUploadListener();
        this.widgetSetListener();
        if (!this.configuration.mobileDisplayVariant.id) {
            $('.cc-hero-carousel-configurator__option:first-child').click();
        }
    },
};

var teaserItemPrototype = {
    image: '',
    decodedImage: '',
    displayVariant: '1',
    colorScheme: 'light',
    headline: '',
    subheadline: '',
    paragraph: '',
    ctaLabel: $t('More'),
    href: '',
    sizeInfo: '',
    aspectRatio: '',
};
/**
 * Image teaser configurator component.
 * This component is responsible for displaying image teaser's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var imageTeaserConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
    },
    template: "<div class=\"cc-image-teaser-configurator {{ classes }} | {{ mix }}\" {{ attributes }}>\n        <section class=\"cc-image-teaser-configurator__section\">\n            <h3 class=\"cc-image-teaser-configurator__subtitle\">Teaser Width</h3>\n            <div class=\"cc-image-teaser-configurator__scenario-options\">\n                <div\n                    :class=\"{\n                        'cc-image-teaser-configurator__option--selected': configuration.currentScenario.teaserWidth.id == optionId,\n                        'cc-image-teaser-configurator__option--disabled': option.disabled,\n                    }\"\n                    class=\"cc-image-teaser-configurator__option\"\n                    v-for=\"(optionId, option) in scenarioOptions.teaserWidth\"\n                    @click=\"!option.disabled && toggleOption('teaserWidth', optionId)\">\n                    <div class=\"cc-image-teaser-configurator__option-wrapper\">\n                        <svg class=\"cc-image-teaser-configurator__option-icon\">\n                            <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                        </svg>\n                    </div>\n                    <p class=\"cc-image-teaser-configurator__option-name\">\n                        {{ option.name }}\n                    </p>\n                </div>\n            </div>\n\n        </section>\n        <section class=\"cc-image-teaser-configurator__section\">\n            <h3 class=\"cc-image-teaser-configurator__subtitle\">Desktop Layout</h3>\n            <div class=\"cc-image-teaser-configurator__scenario-options\">\n                <div\n                    :class=\"{\n                        'cc-image-teaser-configurator__option--selected': configuration.currentScenario.desktopLayout.id == optionId,\n                        'cc-image-teaser-configurator__option--disabled': option.disabled,\n                    }\"\n                    class=\"cc-image-teaser-configurator__option\"\n                    v-for=\"(optionId, option) in scenarioOptions.desktopLayout\"\n                    @click=\"!option.disabled && toggleOption('desktopLayout', optionId)\">\n                    <div class=\"cc-image-teaser-configurator__option-wrapper\">\n                        <svg class=\"cc-image-teaser-configurator__option-icon\">\n                            <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                        </svg>\n                    </div>\n                    <p class=\"cc-image-teaser-configurator__option-name\">\n                        {{ option.name }}\n                    </p>\n                </div>\n            </div>\n        </section>\n        <section class=\"cc-image-teaser-configurator__section\">\n            <h3 class=\"cc-image-teaser-configurator__subtitle\">Text Positioning</h3>\n            <div class=\"cc-image-teaser-configurator__scenario-options\">\n                <div\n                    :class=\"{\n                        'cc-image-teaser-configurator__option--selected': configuration.currentScenario.textPositioning.id == optionId,\n                        'cc-image-teaser-configurator__option--disabled': option.disabled,\n                    }\"\n                    class=\"cc-image-teaser-configurator__option\"\n                    v-for=\"(optionId, option) in scenarioOptions.textPositioning\"\n                    @click=\"!option.disabled && toggleOption('textPositioning', optionId)\">\n                    <div class=\"cc-image-teaser-configurator__option-wrapper\">\n                        <svg class=\"cc-image-teaser-configurator__option-icon\">\n                            <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                        </svg>\n                    </div>\n                    <p class=\"cc-image-teaser-configurator__option-name\">\n                        {{ option.name }}\n                    </p>\n                </div>\n            </div>\n        </section>\n        <section class=\"cc-image-teaser-configurator__section\">\n            <h3 class=\"cc-image-teaser-configurator__subtitle\">Mobile Layout</h3>\n            <div class=\"cc-image-teaser-configurator__scenario-options\">\n                <div\n                    :class=\"{\n                        'cc-image-teaser-configurator__option--selected': configuration.currentScenario.mobileLayout.id == optionId,\n                        'cc-image-teaser-configurator__option--disabled': option.disabled,\n                    }\"\n                    class=\"cc-image-teaser-configurator__option\"\n                    v-for=\"(optionId, option) in scenarioOptions.mobileLayout\"\n                    @click=\"!option.disabled && toggleOption('mobileLayout', optionId)\">\n                    <div class=\"cc-image-teaser-configurator__option-wrapper\">\n                        <svg class=\"cc-image-teaser-configurator__option-icon\">\n                            <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                        </svg>\n                    </div>\n                    <p class=\"cc-image-teaser-configurator__option-name\">\n                        {{ option.name }}\n                    </p>\n                </div>\n            </div>\n        </section>\n\n        <section class=\"cc-image-teaser-configurator__section\">\n            <component-adder class=\"cc-component-adder cc-component-adder--static\" v-show=\"!configuration.items.length\">\n                <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-image-teaser-configurator__item-action-button\" @click=\"createTeaserItem( 0 )\">\n                    <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                        <use v-bind=\"{ 'xlink:href': '#icon_plus' }\"></use>\n                    </svg>\n                </button>\n            </component-adder>\n\n            <template v-for=\"item in configuration.items\">\n                <div class=\"cc-image-teaser-configurator__item\" id=\"cc-image-teaser-item-{{ $index }}\">\n                    <component-adder class=\"cc-component-adder cc-component-adder--first\" v-if=\"canAddTeaser()\">\n                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-image-teaser-configurator__item-action-button\" @click=\"createTeaserItem( $index )\">\n                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_300\">\n                                <use xlink:href=\"#icon_plus\"></use>\n                            </svg>\n                        </button>\n                    </component-adder>\n\n                    <div class=\"cc-image-teaser-configurator__item-content\">\n                        <div v-bind:class=\"[ 'cc-image-teaser-configurator__item-col-left', configuration.items[$index].image ? 'cc-image-teaser-configurator__item-col-left--look-image-uploaded' : '' ]\">\n                            <div class=\"cc-image-teaser-configurator__item-image-wrapper\">\n                                <img :src=\"configuration.items[$index].image\" class=\"cc-image-teaser-configurator__item-image\" v-show=\"configuration.items[$index].image\">\n                                <input type=\"hidden\" v-model=\"configuration.items[$index].image\">\n                                <input type=\"hidden\" class=\"cc-image-teaser-configurator__image-url\" id=\"image-teaser-img-{{$index}}\">\n                                <svg class=\"cc-image-teaser-configurator__item-image-placeholder\" v-show=\"!configuration.items[$index].image\">\n                                    <use xlink:href=\"#icon_image-placeholder\"></use>\n                                </svg>\n\n                                <div class=\"cc-image-teaser-configurator__item-actions\">\n                                    <component-actions>\n                                        <template slot=\"cc-component-actions__buttons\">\n                                            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--up | cc-image-teaser-configurator__item-action-button\" @click=\"moveImageTeaserUp( $index )\" :class=\"[ isFirstImageTeaser( $index ) ? 'cc-action-button--look_disabled' : '' ]\" :disabled=\"isFirstImageTeaser( $index )\">\n                                                <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                    <use xlink:href=\"#icon_arrow-up\"></use>\n                                                </svg>\n                                            </button>\n                                            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--down | cc-image-teaser-configurator__item-action-button\" @click=\"moveImageTeaserDown( $index )\" :class=\"[ isLastImageTeaser( $index ) ? 'cc-action-button--look_disabled' : '' ]\" :disabled=\"isLastImageTeaser( $index )\">\n                                                <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                    <use xlink:href=\"#icon_arrow-down\"></use>\n                                                </svg>\n                                            </button>\n                                            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon | cc-component-actions__button cc-component-actions__button--upload-image | cc-image-teaser-configurator__item-action-button\" @click=\"getImageUploader( $index )\">\n                                                    <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                        <use xlink:href=\"#icon_upload-image\"></use>\n                                                    </svg>\n                                                    {{ configuration.items[$index].image ? imageUploadedText : noImageUploadedText }}\n                                            </button>\n                                            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--delete | cc-image-teaser-configurator__item-action-button\" @click=\"deleteTeaserItem( $index )\">\n                                                <svg class=\"cc-action-button__icon\">\n                                                    <use xlink:href=\"#icon_trash-can\"></use>\n                                                </svg>\n                                            </button>\n                                        </template>\n                                    </component-actions>\n                                </div>\n\n                            </div>\n                        </div>\n                        <div class=\"cc-image-teaser-configurator__item-col-right\">\n                            <div class=\"cc-input cc-input--group\">\n                                <div class=\"cc-input | cc-image-teaser-configurator__item-form-element\">\n                                    <label for=\"cfg-it-item{{ $index }}-variant\" class=\"cc-input__label\">" + $t('Display variant') + ":</label>\n                                    <select name=\"cfg-it-item{{ $index }}-variant\" class=\"cc-input__select\" id=\"cfg-it-item{{ $index }}-variant\" v-model=\"configuration.items[$index].displayVariant\">\n                                        <template v-for=\"(idx, scenario) in imageTeasersContentPositions\">\n                                            <option value=\"{{ idx + 1 }}\">" + $t('{{ scenario }}') + "</option>\n                                        </template>\n                                    </select>\n                                </div>\n                                <div class=\"cc-input | cc-image-teaser-configurator__item-form-element\">\n                                    <label for=\"cfg-it-item{{ $index }}-color-scheme\" class=\"cc-input__label\">" + $t('Text color scheme') + ":</label>\n                                    <select name=\"cfg-it-item{{ $index }}-color-scheme\" class=\"cc-input__select\" id=\"cfg-it-item{{ $index }}-color-scheme\" v-model=\"configuration.items[$index].colorScheme\">\n                                        <option value=\"light\">" + $t('Light') + "</option>\n                                        <option value=\"dark\">" + $t('Dark') + "</option>\n                                    </select>\n                                </div>\n                            </div>\n                            <div class=\"cc-input | cc-image-teaser-configurator__item-form-element\">\n                                <label for=\"cfg-hc-item{{ $index }}-headline\" class=\"cc-input__label\">" + $t('Headline') + ":</label>\n                                <input type=\"text\" v-model=\"configuration.items[$index].headline\" id=\"cfg-hc-item{{ $index }}-headline\" class=\"cc-input__input\">\n                            </div>\n                            <div class=\"cc-input | cc-image-teaser-configurator__item-form-element\">\n                                <label for=\"cfg-hc-item{{ $index }}-subheadline\" class=\"cc-input__label\">" + $t('Subheadline') + ":</label>\n                                <input type=\"text\" v-model=\"configuration.items[$index].subheadline\" id=\"cfg-hc-item{{ $index }}-subheadline\" class=\"cc-input__input\">\n                            </div>\n                            <div class=\"cc-input | cc-image-teaser-configurator__item-form-element\">\n                                <label for=\"cfg-hc-item{{ $index }}-paragraph\" class=\"cc-input__label\">" + $t('Paragraph') + ":</label>\n                                <textarea type=\"text\" v-model=\"configuration.items[$index].paragraph\" id=\"cfg-hc-item{{ $index }}-paragraph\" class=\"cc-input__textarea\"></textarea>\n                            </div>\n                            <div class=\"cc-input cc-input--group\">\n                                <div class=\"cc-input | cc-image-teaser-configurator__item-form-element\">\n                                    <label for=\"cfg-hc-item{{ $index }}-cta-label\" class=\"cc-input__label\">" + $t('CTA label') + ":</label>\n                                    <input type=\"text\" v-model=\"configuration.items[$index].ctaLabel\" id=\"cfg-hc-item{{ $index }}-cta-label\" class=\"cc-input__input\">\n                                </div>\n                                <div class=\"cc-input cc-input--type-addon | cc-image-teaser-configurator__item-form-element\">\n                                    <label for=\"image-teaser-ctatarget-output-{{ $index }}\" class=\"cc-input__label\">" + $t('CTA target link') + ":</label>\n                                    <input type=\"text\" class=\"cc-input__input | cc-image-teaser-configurator__cta-target-link\" v-model=\"configuration.items[$index].href\" id=\"image-teaser-ctatarget-output-{{ $index }}\">\n                                    <span class=\"cc-input__addon | cc-image-teaser-configurator__widget-chooser-trigger\" @click=\"openCtaTargetModal( $index )\">\n                                        <svg class=\"cc-input__addon-icon\">\n                                            <use xlink:href=\"#icon_link\"></use>\n                                        </svg>\n                                    </span>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <component-adder class=\"cc-component-adder cc-component-adder--last\" v-if=\"configuration.items.length && canAddTeaser()\">\n                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-image-teaser-configurator__item-action-button\" @click=\"createTeaserItem( $index + 1 )\">\n                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_300\">\n                                <use xlink:href=\"#icon_plus\"></use>\n                            </svg>\n                        </button>\n                    </component-adder>\n                </div>\n            </template>\n        </section>\n    </div>",
    data: function () {
        return {
            imageUploadedText: $t('Change'),
            noImageUploadedText: $t('Upload'),
            scenarioOptions: {
                // Teaser width scenario elements.
                teaserWidth: {
                    'c': {
                        name: 'Container width',
                        iconId: 'tw_content-width',
                        disabled: false,
                        teasersLimit: true,
                    },
                    'w': {
                        name: 'Window width',
                        iconId: 'tw_window-width',
                        disabled: false,
                        teasersLimit: true,
                    },
                    'c-s': {
                        name: 'Content width Slider',
                        iconId: 'tw_content-slider',
                        disabled: false,
                        teasersLimit: false,
                    },
                    'w-s': {
                        name: 'Window width Slider',
                        iconId: 'tw_window-slider',
                        disabled: false,
                        teasersLimit: false,
                    },
                },
                // Desktop layout scenario elements.
                desktopLayout: {
                    '1': {
                        name: '1 in row',
                        iconId: 'dl_1',
                        disabled: false,
                        teasersNum: 1,
                    },
                    '2': {
                        name: '2 in row',
                        iconId: 'dl_2',
                        disabled: false,
                        teasersNum: 2,
                    },
                    '3': {
                        name: '3 in row',
                        iconId: 'dl_3',
                        disabled: false,
                        teasersNum: 3,
                    },
                    '4': {
                        name: '4 in row',
                        iconId: 'dl_4',
                        disabled: false,
                        teasersNum: 4,
                    },
                    '6': {
                        name: '6 in row',
                        iconId: 'dl_6',
                        disabled: false,
                        teasersNum: 6,
                    },
                    '8': {
                        name: '8 in row',
                        iconId: 'dl_8',
                        disabled: false,
                        teasersNum: 8,
                    },
                },
                // Text positioning scenario elements.
                textPositioning: {
                    'over': {
                        name: 'Text over image',
                        iconId: 'tl_over',
                        disabled: false,
                        textPosition: true,
                    },
                    'under': {
                        name: 'Text below image',
                        iconId: 'tl_under',
                        disabled: false,
                        textPosition: false,
                    },
                },
                // Mobile layout scenario elements.
                mobileLayout: {
                    'large': {
                        name: 'Large teaser',
                        iconId: 'ml_col',
                        disabled: false,
                    },
                    'slider': {
                        name: 'Slider',
                        iconId: 'ml_slider',
                        disabled: false,
                    },
                    'row': {
                        name: 'Teasers in row',
                        iconId: 'ml_2-2',
                        disabled: false,
                    },
                    'col': {
                        name: 'Teasers in column',
                        iconId: 'ml_col',
                        disabled: false,
                    },
                    '1-2': {
                        name: 'Big, two small',
                        iconId: 'ml_1-2',
                        disabled: false,
                    },
                    '2-2': {
                        name: '2 in row, 2 rows',
                        iconId: 'ml_2-2',
                        disabled: false,
                    },
                    '1-2-1': {
                        name: 'Big, two small, big',
                        iconId: 'ml_1-2',
                        disabled: false,
                    },
                    '2-2-2': {
                        name: '2 in row, 3 rows',
                        iconId: 'ml_2-2',
                        disabled: false,
                    },
                },
            },
            availableScenarios: [
                ['c', '1', 'over', ['large']],
                ['c', '2', 'over', ['col', 'row', 'slider']],
                ['c', '2', 'under', ['col']],
                ['c', '3', 'over', ['col', 'slider', '1-2']],
                ['c', '3', 'under', ['col']],
                ['c', '4', 'over', ['2-2', 'slider', '1-2-1']],
                ['c', '4', 'under', ['col']],
                ['c', '6', 'over', ['2-2-2', 'slider']],
                ['c', '6', 'under', ['2-2-2', 'slider']],
                ['c', '8', 'under', ['slider']],
                ['w', '1', 'over', ['large']],
                ['w', '2', 'over', ['col', 'row', 'slider']],
                ['w', '2', 'under', ['col']],
                ['w', '3', 'over', ['col', 'slider', '1-2']],
                ['w', '3', 'under', ['col']],
                ['w', '4', 'over', ['2-2', 'slider', '1-2-1']],
                ['w', '4', 'under', ['col']],
                ['w-s', '2', 'over', ['slider']],
                ['w-s', '2', 'under', ['slider']],
                ['w-s', '3', 'over', ['slider']],
                ['w-s', '3', 'under', ['slider']],
                ['w-s', '4', 'over', ['slider']],
                ['w-s', '4', 'under', ['slider']],
                ['c-s', '1', 'over', ['slider']],
                ['c-s', '2', 'over', ['slider']],
                ['c-s', '2', 'under', ['slider']],
                ['c-s', '3', 'over', ['slider']],
                ['c-s', '3', 'under', ['slider']],
                ['c-s', '4', 'over', ['slider']],
                ['c-s', '4', 'under', ['slider']],
                ['c-s', '6', 'under', ['slider']],
                ['c-s', '8', 'under', ['slider']],
            ],
        };
    },
    props: {
        /**
         * Image teaser configuration
         */
        configuration: {
            type: Object,
            default: function () {
                return {
                    items: [JSON.parse(JSON.stringify(teaserItemPrototype))],
                    ignoredItems: [],
                    currentScenario: {
                        teaserWidth: {},
                        desktopLayout: {},
                        textPositioning: {},
                        mobileLayout: {},
                    },
                };
            },
        },
        /* get assets for displaying component images */
        assetsSrc: {
            type: String,
            default: '',
        },
        /* Obtain base-url for the image uploader */
        uploaderBaseUrl: {
            type: String,
            default: '',
        },
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
        /* Obtain admin url */
        adminPrefix: {
            type: String,
            default: 'admin',
        },
        /* Obtain content-constructor's config file */
        ccConfig: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    computed: {
        imageTeasersContentPositions: function () {
            return Object.values(this.ccConfig.imageTeasersContentPositions);
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            this.onSave();
        },
    },
    created: function () {
        if (this.configuration.ignoredItems === undefined) {
            this.configuration.ignoredItems = [];
        }
    },
    methods: {
        _collectPossibleOptions: function (filteredScenarios) {
            var teaserWidthIndex = 0;
            var desktopLayoutIndex = 1;
            var textPositionIndex = 2;
            var mobileLayoutsIndex = 3;
            var possibleOptions = {
                teaserWidth: {},
                desktopLayout: {},
                textPositioning: {},
                mobileLayout: {},
            };
            filteredScenarios.forEach(function (filteredScenario) {
                possibleOptions.teaserWidth[filteredScenario[teaserWidthIndex]] = true;
                possibleOptions.desktopLayout[filteredScenario[desktopLayoutIndex]] = true;
                possibleOptions.textPositioning[filteredScenario[textPositionIndex]] = true;
                filteredScenario[mobileLayoutsIndex].forEach(function (mobileLayout) {
                    possibleOptions.mobileLayout[mobileLayout] = true;
                });
            });
            Object.keys(possibleOptions).forEach(function (scenarioElement) {
                possibleOptions[scenarioElement] = Object.keys(possibleOptions[scenarioElement]);
            });
            return possibleOptions;
        },
        _findPossibleOptions: function (teaserWidth, desktopLayout, textPosition, mobileLayout) {
            var teaserWidthIndex = 0;
            var desktopLayoutIndex = 1;
            var textPositionIndex = 2;
            var mobileLayoutsIndex = 3;
            // Make a copy of available scenarios to prevent reference copying.
            var filteredScenarios = JSON.parse(JSON.stringify(this.availableScenarios));
            if (teaserWidth) {
                filteredScenarios = filteredScenarios.filter(function (availableScenario) {
                    return availableScenario[teaserWidthIndex] === teaserWidth;
                });
            }
            if (desktopLayout) {
                filteredScenarios = filteredScenarios.filter(function (availableScenario) {
                    return availableScenario[desktopLayoutIndex] === desktopLayout;
                });
            }
            if (textPosition) {
                filteredScenarios = filteredScenarios.filter(function (availableScenario) {
                    return !textPosition || availableScenario[textPositionIndex] === textPosition;
                });
            }
            if (mobileLayout) {
                filteredScenarios = filteredScenarios.filter(function (availableScenario) {
                    return availableScenario[mobileLayoutsIndex].indexOf(mobileLayout) !== -1;
                });
                filteredScenarios = filteredScenarios.map(function (availableScenario) {
                    availableScenario[mobileLayoutsIndex] = [mobileLayout];
                    return availableScenario;
                });
            }
            return this._collectPossibleOptions(filteredScenarios);
        },
        toggleOption: function (optionCategory, optionId) {
            if (this.configuration.currentScenario[optionCategory].id) {
                this.configuration.currentScenario[optionCategory] = {};
            }
            else {
                this.configuration.currentScenario[optionCategory] = this.scenarioOptions[optionCategory][optionId];
                this.configuration.currentScenario[optionCategory].id = optionId;
            }
            this.togglePossibleOptions();
            this.adjustVisibleItems();
        },
        adjustVisibleItems: function () {
            var items = this.configuration.items;
            var itemsNumber = this.configuration.currentScenario.desktopLayout.teasersNum;
            var itemsLimit = this.configuration.currentScenario.teaserWidth.teasersLimit;
            if (itemsLimit && items.length > itemsNumber) {
                var removedItems = items.splice(itemsNumber, items.length - itemsNumber);
                this.configuration.ignoredItems = removedItems.concat(this.configuration.ignoredItems);
            }
            else if (items.length < itemsNumber) {
                items.concat(this.configuration.ignoredItems.splice(0, itemsNumber - items.length));
                for (var addedItems = 0; addedItems < itemsNumber - items.length; addedItems++) {
                    items.push(JSON.parse(JSON.stringify(teaserItemPrototype)));
                }
            }
        },
        togglePossibleOptions: function () {
            var _this = this;
            var currentScenario = this.configuration.currentScenario;
            var possibleOptions = this._findPossibleOptions(currentScenario.teaserWidth.id, currentScenario.desktopLayout.id, currentScenario.textPositioning.id, currentScenario.mobileLayout.id);
            Object.keys(this.scenarioOptions).forEach(function (optionCategory) {
                Object.keys(_this.scenarioOptions[optionCategory]).forEach(function (scenarioOptionId) {
                    _this.scenarioOptions[optionCategory][scenarioOptionId].disabled = possibleOptions[optionCategory].indexOf(scenarioOptionId) === -1;
                });
            });
        },
        canAddTeaser: function () {
            var items = this.configuration.items;
            var itemsLimit = this.configuration.currentScenario.teaserWidth.teasersLimit;
            return (!itemsLimit || items.length < itemsLimit);
        },
        /* Opens M2's built-in image manager modal.
         * Manages all images: image upload from hdd, select image that was already uploaded to server.
         * @param index {number} - index of image of image teaser.
         */
        getImageUploader: function (index) {
            MediabrowserUtility.openDialog(this.uploaderBaseUrl + "target_element_id/image-teaser-img-" + index + "/", 'auto', 'auto', $t('Insert File...'), {
                closed: true,
            });
        },
        /* Listener for image uploader
         * Since Magento does not provide any callback after image has been chosen
         * we have to watch for target where decoded url is placed
         */
        imageUploadListener: function () {
            var component = this;
            var isAlreadyCalled = false;
            // jQuery has to be used, for some reason native addEventListener doesn't catch change of input's value
            $(document).on('change', '.cc-image-teaser-configurator__image-url', function (event) {
                if (!isAlreadyCalled) {
                    isAlreadyCalled = true;
                    component.onImageUploaded(event.target);
                    setTimeout(function () {
                        isAlreadyCalled = false;
                    }, 100);
                }
            });
        },
        /* Action after image was uploaded
         * URL is encoded, so strip it and decode Base64 to get {{ media url="..."}} format
         * which will go to the items.image and will be used to display image on front end
         * @param input { object } - input with raw image path which is used in admin panel
         */
        onImageUploaded: function (input) {
            var _this = this;
            var itemIndex = input.id.substr(input.id.lastIndexOf('-') + 1);
            var encodedImage = input.value.match('___directive\/([a-zA-Z0-9]*)')[1];
            var imgEndpoint = this.imageEndpoint.replace('{/encoded_image}', encodedImage);
            this.configuration.items[itemIndex].decodedImage = Base64 ? Base64.decode(encodedImage) : window.atob(encodedImage);
            var img = new Image();
            img.onload = function () {
                var ar = _this.getAspectRatio(img.naturalWidth, img.naturalHeight);
                _this.configuration.items[itemIndex].image = img.getAttribute('src');
                _this.configuration.items[itemIndex].sizeInfo = img.naturalWidth + "x" + img.naturalHeight + "px (" + ar + ")";
                _this.configuration.items[itemIndex].aspectRatio = ar;
                setTimeout(function () {
                    _this.checkImageSizes();
                    _this.onChange();
                }, 400);
            };
            img.src = imgEndpoint;
        },
        /* Creates another teaser item using teaserItemPrototype */
        createTeaserItem: function (index) {
            this.configuration.items.splice(index, 0, JSON.parse(JSON.stringify(teaserItemPrototype)));
            this.onChange();
        },
        /**
         * Moves image teaser item under given index up by swaping it with previous element.
         * @param {number} index Image teaser's index in array.
         */
        moveImageTeaserUp: function (index) {
            var _this = this;
            if (index > 0) {
                var $thisItem_1 = $("#cc-image-teaser-item-" + index);
                var $prevItem_1 = $("#cc-image-teaser-item-" + (index - 1));
                $thisItem_1.addClass('cc-image-teaser-configurator__item--animating').css('transform', "translateY(" + -Math.abs($prevItem_1.outerHeight(true)) + "px)");
                $prevItem_1.addClass('cc-image-teaser-configurator__item--animating').css('transform', "translateY(" + $thisItem_1.outerHeight(true) + "px )");
                setTimeout(function () {
                    _this.configuration.items.splice(index - 1, 0, _this.configuration.items.splice(index, 1)[0]);
                    _this.onChange();
                    $thisItem_1.removeClass('cc-image-teaser-configurator__item--animating').css('transform', '');
                    $prevItem_1.removeClass('cc-image-teaser-configurator__item--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Moves image teaser item under given index down by swaping it with next element.
         * @param {number} index Image teaser's index in array.
         */
        moveImageTeaserDown: function (index) {
            var _this = this;
            if (index < this.configuration.items.length - 1) {
                var $thisItem_2 = $("#cc-image-teaser-item-" + index);
                var $nextItem_1 = $("#cc-image-teaser-item-" + (index + 1));
                $thisItem_2.addClass('cc-image-teaser-configurator__item--animating').css('transform', "translateY(" + $nextItem_1.outerHeight(true) + "px)");
                $nextItem_1.addClass('cc-image-teaser-configurator__item--animating').css('transform', "translateY(" + -Math.abs($thisItem_2.outerHeight(true)) + "px)");
                setTimeout(function () {
                    _this.configuration.items.splice(index + 1, 0, _this.configuration.items.splice(index, 1)[0]);
                    _this.onChange();
                    $thisItem_2.removeClass('cc-image-teaser-configurator__item--animating').css('transform', '');
                    $nextItem_1.removeClass('cc-image-teaser-configurator__item--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Tells if item with given index is the first image teaser.
         * @param  {number}  index Index of the image teaser.
         * @return {boolean}       If image teaser is first in array.
         */
        isFirstImageTeaser: function (index) {
            return index === 0;
        },
        /**
         * Tells if image teaser with given index is the last image teaser.
         * @param  {number}  index Index of the image teaser.
         * @return {boolean}       If image teaser is last in array.
         */
        isLastImageTeaser: function (index) {
            return index === this.configuration.items.length - 1;
        },
        /* Opens modal with M2 built-in widget chooser
         * @param index {number} - index of teaser item to know where to place output of widget chooser
         */
        openCtaTargetModal: function (index) {
            widgetTools.openDialog(window.location.origin + "/" + this.adminPrefix + "/admin/widget/index/filter_widgets/Link/widget_target_id/image-teaser-ctatarget-output-" + index);
            this.wWidgetListener(index);
        },
        /* Sets listener for widget chooser
         * It triggers component.onChange to update component's configuration
         * after value of item.ctaTarget is changed
         */
        widgetSetListener: function () {
            var _this = this;
            $('.cc-image-teaser-configurator__cta-target-link').on('change', function () {
                _this.onChange();
            });
        },
        /*
         * Check if widget chooser is loaded. If not, wait for it, if yes:
         * Override default onClick for "Insert Widget" button in widget's modal window
         * to clear input's value before inserting new one
         * @param {number} index Hero item's index in array.
         */
        wWidgetListener: function (itemIndex) {
            var _this = this;
            if (typeof wWidget !== 'undefined' && widgetTools.dialogWindow[0].innerHTML !== '') {
                var button = widgetTools.dialogWindow[0].querySelector('#insert_button');
                button.onclick = null;
                button.addEventListener('click', function () {
                    _this.configuration.items[itemIndex].href = '';
                    wWidget.insertWidget();
                });
            }
            else {
                window.setTimeout(function () {
                    _this.wWidgetListener(itemIndex);
                }, 300);
            }
        },
        /* Checks if it's possible to display Delete button
         * This function is used in component's template
         * Button can be displayed only on items that have item uploaded
         * @param index {number} - index of teaser item
         * @returns Boolean
         */
        isPossibleToDelete: function (index) {
            if ((index !== 0 || this.configuration.items.length > 1) && this.configuration.items[index].image !== '') {
                return true;
            }
            return false;
        },
        /* Removes teaser item after Delete button is clicked
         * and triggers component's onChange to update it's configuration
         * @param index {number} - index of teaser item to remove
         */
        deleteTeaserItem: function (index) {
            var component = this;
            confirm({
                content: $t('Are you sure you want to delete this item?'),
                actions: {
                    confirm: function () {
                        component.configuration.items.splice(index, 1);
                        component.onChange();
                    }
                },
            });
        },
        /* Checks if images are all the same size
         * If not - displays error by firing up this.displayImageSizeMismatchError()
         * @param images {array} - array of all uploaded images
         */
        checkImageSizes: function () {
            var itemsToCheck = JSON.parse(JSON.stringify(this.configuration.items)).filter(function (item) {
                return Boolean(item.aspectRatio); // Filter out items without aspect ratio set yet.
            });
            for (var i = 0; i < itemsToCheck.length; i++) {
                if (itemsToCheck[i].aspectRatio !== itemsToCheck[0].aspectRatio) {
                    alert({
                        title: $t('Warning'),
                        content: $t('Images you have uploaded have different aspect ratio. This may cause this component to display wrong. We recommend to keep the same aspect ratio for all uploaded images.'),
                    });
                    return false;
                }
            }
            return true;
        },
        /* Returns greatest common divisor for 2 numbers
         * @param a {number}
         * @param b {number}
         * @return {number} - greatest common divisor
         */
        getGreatestCommonDivisor: function (a, b) {
            if (!b) {
                return a;
            }
            return this.getGreatestCommonDivisor(b, a % b);
        },
        /* Returns Aspect ratio for 2 numbers based on GDC algoritm (greatest common divisor)
         * @param a {number}
         * @param b {number}
         * @return {number} - greatest common divisor
         */
        getAspectRatio: function (a, b) {
            var c = this.getGreatestCommonDivisor(a, b);
            return (a / c) + ":" + (b / c);
        },
        /* Cleans configuration for M2C content constructor after Saving component
         * All empty teaser items has to be removed to not get into configuration object
         */
        cleanupConfiguration: function () {
            this.configuration.items = this.configuration.items.filter(function (item) { return item.image !== ''; });
            this.configuration.ignoredItems = this.configuration.ignoredItems.filter(function (item) { return item.image !== ''; });
            this.onChange();
        },
    },
    ready: function () {
        this.imageUploadListener();
        this.widgetSetListener();
    },
};

// Pattern for teaser Item
var teaserDataPattern = {
    sizeSelect: '2x1',
    size: {
        x: 2,
        y: 1
    },
    position: 'left',
    row: 1,
    isAvailableForMobile: 1,
    image: '',
    decodedImage: '',
    displayVariant: 'variant-1',
    colorScheme: 'light',
    headline: '',
    subheadline: '',
    paragraph: '',
    ctaLabel: $t('Check offer'),
    href: '',
};
/**
 * Magento product-grid teasers configurator component.
 * This component will be responsible for configuration of image teasers inside native products grid on M2 category pages
 * @type {vuejs.ComponentOption} Vue component object.
 */
var magentoProductGridTeasersConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: "<div class=\"cc-magento-product-grid-teasers-configurator | {{ class }}\">\n        <component-adder class=\"cc-component-adder cc-component-adder--static\" v-show=\"!configuration.teasers.length\">\n            <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-magento-product-grid-teasers-configurator__item-action-button\" @click=\"createNewTeaser( 0 )\">\n                <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                    <use xlink:href=\"#icon_plus\"></use>\n                </svg>\n            </button>\n        </component-adder>\n\n        <template v-for=\"item in configuration.teasers\">\n            <div class=\"cc-magento-product-grid-teasers-configurator__item\" id=\"cc-magento-pg-teaser-{{ $index }}\">\n                <component-adder class=\"cc-component-adder cc-component-adder--first\">\n                    <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-magento-product-grid-teasers-configurator__item-action-button\" @click=\"createNewTeaser( $index )\">\n                        <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                            <use xlink:href=\"#icon_plus\"></use>\n                        </svg>\n                    </button>\n                </component-adder>\n\n                <div class=\"cc-magento-product-grid-teasers-configurator__item-content\">\n                    <div v-bind:class=\"[ 'cc-magento-product-grid-teasers-configurator__item-col-left', configuration.teasers[$index].image ? 'cc-magento-product-grid-teasers-configurator__item-col-left--look-image-uploaded' : '' ]\">\n                        <div class=\"cc-magento-product-grid-teasers-configurator__item-image-wrapper\">\n                            <img :src=\"configuration.teasers[$index].image\" class=\"cc-magento-product-grid-teasers-configurator__item-image\" v-show=\"configuration.teasers[$index].image\">\n                            <input type=\"hidden\" v-model=\"configuration.teasers[$index].image\">\n                            <input type=\"hidden\" class=\"cc-magento-product-grid-teasers-configurator__image-url\" id=\"mpg-teaser-img-{{$index}}\">\n                            <svg class=\"cc-magento-product-grid-teasers-configurator__item-image-placeholder\" v-show=\"!configuration.teasers[$index].image\">\n                                <use xlink:href=\"#icon_image-placeholder\"></use>\n                            </svg>\n\n                            <div class=\"cc-magento-product-grid-teasers-configurator__item-actions\">\n                                <component-actions>\n                                    <template slot=\"cc-component-actions__buttons\">\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--up | cc-magento-product-grid-teasers-configurator__item-action-button\" @click=\"moveTeaserUp( $index )\" :class=\"[ isFirstTeaser( $index ) ? 'cc-action-button--look_disabled' : '' ]\" :disabled=\"isFirstTeaser( $index )\">\n                                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                <use xlink:href=\"#icon_arrow-up\"></use>\n                                            </svg>\n                                        </button>\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--down | cc-magento-product-grid-teasers-configurator__item-action-button\" @click=\"moveTeaserDown( $index )\" :class=\"[ isLastTeaser( $index ) ? 'cc-action-button--look_disabled' : '' ]\" :disabled=\"isLastTeaser( $index )\">\n                                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                <use xlink:href=\"#icon_arrow-down\"></use>\n                                            </svg>\n                                        </button>\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon | cc-component-actions__button cc-component-actions__button--upload-image | cc-magento-product-grid-teasers-configurator__item-action-button\" @click=\"getImageUploader( $index )\">\n                                                <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                    <use xlink:href=\"#icon_upload-image\"></use>\n                                                </svg>\n                                                {{ configuration.teasers[$index].image ? imageUploadedText : noImageUploadedText }}\n                                        </button>\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--delete | cc-magento-product-grid-teasers-configurator__item-action-button\" @click=\"deleteTeaser( $index )\">\n                                            <svg class=\"cc-action-button__icon\">\n                                                <use xlink:href=\"#icon_trash-can\"></use>\n                                            </svg>\n                                        </button>\n                                    </template>\n                                </component-actions>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"cc-magento-product-grid-teasers-configurator__item-col-right\">\n                        <div class=\"cc-input cc-input--group cc-input--group-quarter\">\n                            <div class=\"cc-input | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                                <label for=\"cfg-mpg-teaser{{ $index }}-size-select\" class=\"cc-input__label\">" + $t('Teaser size') + ":</label>\n                                <select name=\"cfg-mpg-teaser{{ $index }}-size-select\" class=\"cc-input__select | cc-magento-product-grid-teasers-configurator__select\" id=\"cfg-mpg-teaser{{ $index }}-size-select\" v-model=\"configuration.teasers[$index].sizeSelect\" @change=\"setTeaserSize($index)\">\n                                    <option value=\"1x1\">" + $t('1x1') + "</option>\n                                    <option value=\"1x2\">" + $t('1x2') + "</option>\n                                    <option value=\"2x1\">" + $t('2x1') + "</option>\n                                    <option value=\"2x2\">" + $t('2x2') + "</option>\n                                </select>\n                            </div>\n                            <div class=\"cc-input | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                                <label for=\"cfg-mpg-teaser{{ $index }}-position\" class=\"cc-input__label\">" + $t('Position') + ":</label>\n                                <select name=\"cfg-mpg-teaser{{ $index }}-position\" class=\"cc-input__select | cc-magento-product-grid-teasers-configurator__select\" id=\"cfg-mpg-teaser{{ $index }}-position\" v-model=\"configuration.teasers[$index].position\">\n                                    <option value=\"left\">" + $t('Left') + "</option>\n                                    <option value=\"center\">" + $t('Center') + "</option>\n                                    <option value=\"right\">" + $t('Right') + "</option>\n                                </select>\n                            </div>\n                            <div class=\"cc-input | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                                <label for=\"cfg-mpg-teaser{{ $index }}-row\" class=\"cc-input__label\">" + $t('Row') + ":</label>\n                                <select name=\"cfg-mpg-teaser{{ $index }}-row\" class=\"cc-input__select | cc-magento-product-grid-teasers-configurator__select\" id=\"cfg-mpg-teaser{{ $index }}-row\" v-model=\"configuration.teasers[$index].row\">\n                                    <option v-for=\"i in rowsCount\" value=\"{{ i + 1 }}\">{{ i + 1 }}</option>\n                                    <option value=\"1000\">" + $t('as last') + "</option>\n                                </select>\n                            </div>\n                            <div class=\"cc-input | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                                <label for=\"cfg-mpg-teaser{{ $index }}-mobile\" class=\"cc-input__label\">" + $t('Show in mobiles') + ":</label>\n                                <div class=\"admin__actions-switch\" data-role=\"switcher\">\n                                    <input type=\"checkbox\" class=\"admin__actions-switch-checkbox\" id=\"cfg-mpg-teaser{{ $index }}-mobile\" name=\"cfg-mpg-teaser{{ $index }}-mobile\" v-model=\"configuration.teasers[$index].isAvailableForMobile\">\n                                    <label class=\"admin__actions-switch-label\" for=\"cfg-mpg-teaser{{ $index }}-mobile\"\">\n                                        <span class=\"admin__actions-switch-text\" data-text-on=\"" + $t('Yes') + "\" data-text-off=\"" + $t('No') + "\"></span>\n                                    </label>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"cc-input cc-input--group\">\n                            <div class=\"cc-input | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                                <label for=\"cfg-mpg-teaser{{ $index }}-variant\" class=\"cc-input__label\">" + $t('Display variant') + ":</label>\n                                <select name=\"cfg-mpg-teaser{{ $index }}-variant\" class=\"cc-input__select | cc-magento-product-grid-teasers-configurator__select\" id=\"cfg-mpg-teaser{{ $index }}-variant\" v-model=\"configuration.teasers[$index].displayVariant\">\n                                    <template v-for=\"(idx, scenario) in imageTeasersContentPositions\">\n                                        <option value=\"variant-{{ idx + 1 }}\">" + $t('{{ scenario }}') + "</option>\n                                    </template>\n                                </select>\n                            </div>\n                            <div class=\"cc-input | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                                <label for=\"cfg-mpg-teaser{{ $index }}-color-scheme\" class=\"cc-input__label\">" + $t('Text color scheme') + ":</label>\n                                <select name=\"cfg-mpg-teaser{{ $index }}-color-scheme\" class=\"cc-input__select | cc-magento-product-grid-teasers-configurator__select\" id=\"cfg-mpg-teaser{{ $index }}-color-scheme\" v-model=\"configuration.teasers[$index].colorScheme\">\n                                    <option value=\"light\">" + $t('Light') + "</option>\n                                    <option value=\"dark\">" + $t('Dark') + "</option>\n                                </select>\n                            </div>\n                        </div>\n                        <div class=\"cc-input | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                            <label for=\"cfg-mpg-teaser{{ $index }}-headline\" class=\"cc-input__label\">" + $t('Headline') + ":</label>\n                            <input type=\"text\" v-model=\"configuration.teasers[$index].headline\" id=\"cfg-mpg-teaser{{ $index }}-headline\" class=\"cc-input__input\">\n                        </div>\n                        <div class=\"cc-input | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                            <label for=\"cfg-mpg-teaser{{ $index }}-subheadline\" class=\"cc-input__label\">" + $t('Subheadline') + ":</label>\n                            <input type=\"text\" v-model=\"configuration.teasers[$index].subheadline\" id=\"cfg-mpg-teaser{{ $index }}-subheadline\" class=\"cc-input__input\">\n                        </div>\n                        <div class=\"cc-input | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                            <label for=\"cfg-mpg-teaser{{ $index }}-paragraph\" class=\"cc-input__label\">" + $t('Paragraph') + ":</label>\n                            <textarea type=\"text\" v-model=\"configuration.teasers[$index].paragraph\" id=\"cfg-mpg-teaser{{ $index }}-paragraph\" class=\"cc-input__textarea\"></textarea>\n                        </div>\n                        <div class=\"cc-input cc-input--group\">\n                            <div class=\"cc-input | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                                <label for=\"cfg-mpg-teaser{{ $index }}-cta-label\" class=\"cc-input__label\">" + $t('CTA label') + ":</label>\n                                <input type=\"text\" v-model=\"configuration.teasers[$index].ctaLabel\" id=\"cfg-mpg-teaser{{ $index }}-cta-label\" class=\"cc-input__input\">\n                            </div>\n                            <div class=\"cc-input cc-input--type-addon | cc-magento-product-grid-teasers-configurator__item-form-element\">\n                                <label for=\"teaser-ctatarget-output-{{ $index }}\" class=\"cc-input__label\">" + $t('CTA target link') + ":</label>\n                                <input type=\"text\" class=\"cc-input__input | cc-magento-product-grid-teasers-configurator__cta-target-link\" v-model=\"configuration.teasers[$index].href\" id=\"teaser-ctatarget-output-{{ $index }}\">\n                                <span class=\"cc-input__addon | cc-magento-product-grid-teasers-configurator__widget-chooser-trigger\" @click=\"openCtaTargetModal( $index )\">\n                                    <svg class=\"cc-input__addon-icon\">\n                                        <use xlink:href=\"#icon_link\"></use>\n                                    </svg>\n                                </span>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <component-adder class=\"cc-component-adder cc-component-adder--last\">\n                    <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-magento-product-grid-teasers-configurator__item-action-button\" @click=\"createNewTeaser( $index + 1 )\">\n                        <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                            <use xlink:href=\"#icon_plus\"></use>\n                        </svg>\n                    </button>\n                </component-adder>\n            </div>\n        </template>\n\n        <div class=\"cc-magento-product-grid-teasers-configurator__modal\" v-el:error-modal></div>\n    </div>",
    /**
     * Get dependencies
     */
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
    },
    props: {
        /*
         * Single's component configuration
         */
        configuration: {
            type: Object,
            default: function () {
                return {
                    teasers: [JSON.parse(JSON.stringify(teaserDataPattern))],
                    json: [],
                };
            },
        },
        /* get assets for displaying component images */
        assetsSrc: {
            type: String,
            default: '',
        },
        /* Obtain base-url for the image uploader */
        uploaderBaseUrl: {
            type: String,
            default: '',
        },
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
        /* Obtain content-constructor's config file */
        ccConfig: {
            type: Object,
            default: function () {
                return {};
            },
        },
        productsPerPage: {
            type: String,
            default: '30',
        },
        /* Obtain admin url */
        adminPrefix: {
            type: String,
            default: 'admin',
        },
    },
    computed: {
        imageTeasersContentPositions: function () {
            return Object.values(this.ccConfig.imageTeasersContentPositions);
        },
    },
    data: function () {
        return {
            imageUploadedText: $t('Change'),
            noImageUploadedText: $t('Upload'),
            configuration: this.getInitialConfiguration(),
            rowsCount: this.getCurrentFErowsCount(),
        };
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            //this.cleanupConfiguration();
            this.generateTeasersConfig();
            this.onSave();
        },
    },
    methods: {
        getInitialConfiguration: function () {
            if (!this.configuration) {
                this.configuration = {
                    teasers: [JSON.parse(JSON.stringify(teaserDataPattern))],
                };
            }
            return this.configuration;
        },
        /**
         * Calculates "virtual" length of products in the grid
         * "virtual" means that teasers are included and their sizes are calculated too
         * f.e if teaser covers 2 tiles it counts as 2 brics, accordingly if it's 2x2 then it takes 4 bricks
         * @return {number} number of available bricks in grid
         */
        getVirtualBricksLength: function () {
            var virtualLength = parseInt(this.productsPerPage, 10);
            for (var i = 0; i < this.configuration.teasers.length; i++) {
                virtualLength += this.configuration.teasers[i].size.x * this.configuration.teasers[i].size.y - 1;
            }
            return virtualLength;
        },
        /**
         * Calculates how many rows there's displayed if the grid on front-end
         * Currently divider is hardcoded for desktop breakpoint
         * @return {number} number of rows in FE grid
         */
        getCurrentFErowsCount: function () {
            return Math.ceil(this.getVirtualBricksLength() / this.ccConfig.columns[this.ccConfig.columns.default_layout].desktop);
        },
        /**
         * When you open component after changes in M2 grid settings (when products per page chnaged)
         * Or, after you delete some teasers - this method updates available rows count on FE side and checks if
         * current row setting of the teaser is not higher than this.rowsCount.
         * If yes, it changes row setting to be equal this.rowsCount
         */
        fixOverflowedRowsSetup: function () {
            this.rowsCount = this.getCurrentFErowsCount();
            for (var i = 0; i < this.configuration.teasers.length; i++) {
                if (this.configuration.teasers[i].row > this.rowsCount) {
                    this.configuration.teasers[i].row = this.rowsCount;
                }
            }
        },
        /* Opens M2's built-in image manager modal
         * Manages all images: image upload from hdd, select image that was already uploaded to server
         * @param index {number} - index of image of hero item
         */
        getImageUploader: function (index) {
            MediabrowserUtility.openDialog(this.uploaderBaseUrl + "target_element_id/mpg-teaser-img-" + index + "/", 'auto', 'auto', $t('Insert File...'), {
                closed: true,
            });
        },
        /* Listener for image uploader
         * Since Magento does not provide any callback after image has been chosen
         * we have to watch for target where decoded url is placed
         */
        imageUploadListener: function () {
            var component = this;
            var isAlreadyCalled = false;
            // jQuery has to be used, for some reason native addEventListener doesn't catch change of input's value
            $(document).on('change', '.cc-magento-product-grid-teasers-configurator__image-url', function (event) {
                if (!isAlreadyCalled) {
                    isAlreadyCalled = true;
                    component.onImageUploaded(event.target);
                    setTimeout(function () {
                        isAlreadyCalled = false;
                    }, 100);
                }
            });
        },
        /* Action after image was uploaded
         * URL is encoded, so strip it and decode Base64 to get {{ media url="..."}} format
         * which will go to the items.image and will be used to display image on front end
         * @param input { object } - input with raw image path which is used in admin panel
         */
        onImageUploaded: function (input) {
            var _this = this;
            var itemIndex = input.id.substr(input.id.lastIndexOf('-') + 1);
            var encodedImage = input.value.match('___directive\/([a-zA-Z0-9]*)')[1];
            var imgEndpoint = this.imageEndpoint.replace('{/encoded_image}', encodedImage);
            this.configuration.teasers[itemIndex].decodedImage = Base64 ? Base64.decode(encodedImage) : window.atob(encodedImage);
            var img = new Image();
            img.onload = function () {
                _this.configuration.teasers[itemIndex].image = img.getAttribute('src');
                _this.onChange();
            };
            img.src = imgEndpoint;
        },
        /* Opens modal with M2 built-in widget chooser
         * @param index {number} - index of teaser item to know where to place output of widget chooser
         */
        openCtaTargetModal: function (index) {
            widgetTools.openDialog(window.location.origin + "/" + this.adminPrefix + "/admin/widget/index/filter_widgets/Link/widget_target_id/teaser-ctatarget-output-" + index);
            this.wWidgetListener(index);
        },
        /* Sets listener for widget chooser
         * It triggers component.onChange to update component's configuration
         * after value of item.href is changed
         */
        widgetSetListener: function () {
            var _this = this;
            $('.cc-magento-product-grid-teasers-configurator__cta-target-link').on('change', function () {
                _this.onChange();
            });
        },
        /*
         * Check if widget chooser is loaded. If not, wait for it, if yes:
         * Override default onClick for "Insert Widget" button in widget's modal window
         * to clear input's value before inserting new one
         * @param {number} index Hero item's index in array.
         */
        wWidgetListener: function (itemIndex) {
            var _this = this;
            if (typeof wWidget !== 'undefined' && widgetTools.dialogWindow[0].innerHTML !== '') {
                var button = widgetTools.dialogWindow[0].querySelector('#insert_button');
                button.onclick = null;
                button.addEventListener('click', function () {
                    _this.configuration.teasers[itemIndex].href = '';
                    wWidget.insertWidget();
                });
            }
            else {
                window.setTimeout(function () {
                    _this.wWidgetListener(itemIndex);
                }, 300);
            }
        },
        setTeaserSize: function (index) {
            this.fixOverflowedRowsSetup();
            var size = this.configuration.teasers[index].sizeSelect.split('x');
            this.configuration.teasers[index].size.x = size[0];
            this.configuration.teasers[index].size.y = size[1];
        },
        /**
         * Creates new hero item and adds it to a specified index.
         * @param {number} index New component's index in components array.
         */
        createNewTeaser: function (index) {
            this.configuration.teasers.splice(index, 0, JSON.parse(JSON.stringify(teaserDataPattern)));
            this.rowsCount = this.getCurrentFErowsCount();
            this.onChange();
        },
        /**
         * Moves hero item under given index up by swaping it with previous element.
         * @param {number} index Hero item's index in array.
         */
        moveTeaserUp: function (index) {
            var _this = this;
            if (index > 0) {
                var $thisItem_1 = $("#cc-magento-pg-teaser-" + index);
                var $prevItem_1 = $("#cc-magento-pg-teaser-" + (index - 1));
                $thisItem_1.addClass('cc-magento-product-grid-teasers-configurator__item--animating').css('transform', "translateY(" + -Math.abs($prevItem_1.outerHeight(true)) + "px)");
                $prevItem_1.addClass('cc-magento-product-grid-teasers-configurator__item--animating').css('transform', "translateY(" + $thisItem_1.outerHeight(true) + "px)");
                setTimeout(function () {
                    _this.configuration.teasers.splice(index - 1, 0, _this.configuration.teasers.splice(index, 1)[0]);
                    _this.onChange();
                    $thisItem_1.removeClass('cc-magento-product-grid-teasers-configurator__item--animating').css('transform', '');
                    $prevItem_1.removeClass('cc-magento-product-grid-teasers-configurator__item--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Moves hero item under given index down by swaping it with next element.
         * @param {number} index Hero item's index in array.
         */
        moveTeaserDown: function (index) {
            var _this = this;
            if (index < this.configuration.teasers.length - 1) {
                var $thisItem_2 = $("#cc-magento-pg-teaser-" + index);
                var $nextItem_1 = $("#cc-magento-pg-teaser-" + (index + 1));
                $thisItem_2.addClass('cc-magento-product-grid-teasers-configurator__item--animating').css('transform', "translateY(" + $nextItem_1.outerHeight(true) + "px)");
                $nextItem_1.addClass('cc-magento-product-grid-teasers-configurator__item--animating').css('transform', "translateY(" + -Math.abs($thisItem_2.outerHeight(true)) + "px)");
                setTimeout(function () {
                    _this.configuration.teasers.splice(index + 1, 0, _this.configuration.teasers.splice(index, 1)[0]);
                    _this.onChange();
                    $thisItem_2.removeClass('cc-magento-product-grid-teasers-configurator__item--animating').css('transform', '');
                    $nextItem_1.removeClass('cc-magento-product-grid-teasers-configurator__item--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Tells if item with given index is the first hero item.
         * @param  {number}  index Index of the hero item.
         * @return {boolean}       If hero item is first in array.
         */
        isFirstTeaser: function (index) {
            return index === 0;
        },
        /**
         * Tells if hero item with given index is the last hero item.
         * @param  {number}  index Index of the hero item.
         * @return {boolean}       If hero item is last in array.
         */
        isLastTeaser: function (index) {
            return index === this.configuration.teasers.length - 1;
        },
        /* Removes hero item after Delete button is clicked
         * and triggers hero item's onChange to update it's configuration
         * @param index {number} - index of hero item to remove
         */
        deleteTeaser: function (index) {
            var component = this;
            confirm({
                content: $t('Are you sure you want to delete this item?'),
                actions: {
                    confirm: function () {
                        component.configuration.teasers.splice(index, 1);
                        component.fixOverflowedRowsSetup();
                        component.onChange();
                    },
                },
            });
        },
        /* Cleans configuration for M2C content constructor after Saving component
         * All empty teasers have to be removed to not get into configuration object
         */
        cleanupConfiguration: function () {
            var filteredArray = this.configuration.teasers.filter(function (teaser) { return teaser.image !== ''; });
            this.configuration.teasers = filteredArray;
            this.onChange();
        },
        /* Generates 1:1 JSON for grid-layout component so it can be simply passed without any modifications within templates
         */
        generateTeasersConfig: function () {
            this.configuration.json = [];
            for (var i = 0; i < this.configuration.teasers.length; i++) {
                var teaser = {
                    id: i + 1,
                    mobile: Number(this.configuration.teasers[i].isAvailableForMobile),
                    size: {
                        x: Number(this.configuration.teasers[i].size.x),
                        y: Number(this.configuration.teasers[i].size.y),
                    },
                    gridPosition: {
                        x: this.configuration.teasers[i].position,
                        y: Number(this.configuration.teasers[i].row),
                    },
                };
                this.configuration.json.push(teaser);
            }
        },
    },
    ready: function () {
        this.imageUploadListener();
        this.widgetSetListener();
        this.fixOverflowedRowsSetup();
    },
};

/**
 * Paragraph configurator component.
 * This component is responsible for displaying paragraph configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var paragraphConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: "<form class=\"cc-paragraph-configurator {{ classes }} | {{ mix }}\" {{ attributes }} @submit.prevent=\"onSave\">\n        \n        <div class=\"cc-paragraph-configurator__error\" v-text=\"tempConfiguration.errorMessage\" v-show=\"tempConfiguration.errorMessage\">\n        </div>\n\n        <section class=\"cc-paragraph-configurator__section\">\n            <h3 class=\"cc-paragraph-configurator__subtitle\">" + $t('Paragraph width') + "</h3>\n            <div class=\"cc-paragraph-configurator__scenario-options\">\n                <div\n                    :class=\"{\n                        'cc-paragraph-configurator__option--selected': configuration.scenarios.reading.id == optionId,\n                    }\"\n                    class=\"cc-paragraph-configurator__option\"\n                    v-for=\"(optionId, option) in scenarioOptions.reading\"\n                    @click=\"toggleOption('reading', optionId)\">\n                    <div class=\"cc-paragraph-configurator__option-wrapper\">\n                        <svg class=\"cc-paragraph-configurator__option-icon\">\n                            <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                        </svg>\n                    </div>\n                    <p class=\"cc-paragraph-configurator__option-name\">\n                        " + $t('{{ option.name }}') + "\n                    </p>\n                </div>\n            </div>\n        </section>\n\n        <section class=\"cc-paragraph-configurator__section\">\n            <div class=\"cc-input\">\n                <label for=\"input-cfg-id\" class=\"cc-input__label\">" + $t('Identifier') + ":</label>\n                <input type=\"text\" name=\"cfg-id\" v-model=\"tempConfiguration.identifier\" id=\"input-cfg-id\" class=\"cc-input__input cc-input__input--limited-width\" @blur=\"stripSpaces( tempConfiguration.identifier )\" maxlength=\"30\">\n            </div>\n            <div class=\"cc-input\">\n                <label for=\"input-cfg-title\" class=\"cc-input__label\">" + $t('Title') + ":</label>\n                <input type=\"text\" name=\"cfg-title\" v-model=\"tempConfiguration.title\" id=\"input-cfg-title\" class=\"cc-input__input cc-input__input--limited-width\" maxlength=\"100\">\n            </div>\n            <div class=\"cc-input\" v-if=\"isColumnsConfigAvailable()\">\n                <label for=\"input-cfg-columns\" class=\"cc-input__label\">" + $t('Number of columns') + ":</label>\n                <select name=\"input-cfg-columns\" class=\"cc-input__select | cc-paragraph-configurator__select\" id=\"input-cfg-columns\" v-model=\"configuration.columns\">\n                    <option value=\"none\">" + $t('Don\'t split content - display full width') + "</option>\n                    <option value=\"2\">" + $t('Split content into 2 columns') + "</option>\n                    <option value=\"3\">" + $t('Split content into 3 columns') + "</option>\n                    <option value=\"4\">" + $t('Split content into 4 columns') + "</option>\n                </select>\n                <div class=\"admin__field-note cc-input__note\">\n                    <span>" + $t('Defines the way of content display. Content can be splitted into defined number of columns. This setting has no effect on small screen resolutions (such as smartphones) where content is always displayed in one column.') + "</span>\n                </div>\n            </div>\n            <div class=\"cc-input\">\n                <label for=\"textarea-cfg-paragraph\" class=\"cc-input__label cc-input__label--look-top-align\">" + $t('HTML') + ":</label>\n\n                <div class=\"buttons-set | cc-paragraph-configurator__wysiwyg-buttons\">\n                    <button type=\"button\" class=\"scalable action-show-hide\" id=\"toggle-wysiwyg\">" + $t('Show / Hide Editor') + "</button>\n                    <button type=\"button\" class=\"scalable action-add-widget plugin\" @click=\"openWidgetModal()\" v-show=\"!isEditorVisible\">" + $t('Insert Widget') + "...</button>\n                    <button type=\"button\" class=\"scalable action-add-image plugin\" @click=\"openMediaModal()\" v-show=\"!isEditorVisible\">" + $t('Insert Image') + "...</button>\n                    <button type=\"button\" class=\"scalable add-variable plugin\" @click=\"openMagentoVariablesModal()\" v-show=\"!isEditorVisible\">" + $t('Insert Variable') + "...</button>\n                </div>\n\n                <textarea name=\"cfg-paragraph\" v-model=\"tempConfiguration.content\" id=\"textarea-cfg-paragraph\" class=\"cc-input__textarea | cc-paragraph-configurator__textarea\"></textarea>\n            </div>\n        </section>\n    </form>",
    props: {
        /*
         * Single's component configuration
         */
        configuration: {
            type: Object,
            default: function () {
                return {
                    blockId: '',
                    title: '',
                    columns: 'none',
                    scenarios: {
                        reading: {}
                    }
                };
            },
        },
        restToken: {
            type: String,
            default: '',
        },
        wysiwygConfig: {
            type: String,
            default: '',
        },
        /* Obtain base-url for the image uploader */
        uploaderBaseUrl: {
            type: String,
            default: '',
        },
        /* get assets for displaying component images */
        assetsUrl: {
            type: String,
            default: '',
        },
    },
    data: function () {
        return {
            /*
             * This object if used to operate inside component. We want to bind data to inputs,
             * but we don't need them to be saved in m2c component's config. Only ID is needed,
             * since rest of data id fetched from database.
             */
            tempConfiguration: {
                identifier: '',
                title: '',
                content: '',
                errorMessage: '',
            },
            isEditorVisible: true,
            // wysiwyg editor object
            editor: undefined,
            scenarioOptions: {
                // Reading scenario options.
                reading: {
                    'full': {
                        name: 'Container width',
                        iconId: 'tw_content-width-text',
                    },
                    'optimal': {
                        name: 'Optimal reading width',
                        iconId: 'tw_optimal-reading',
                    },
                },
            },
        };
    },
    ready: function () {
        var _this = this;
        // Check if wysiwygConfig was passed - means that editor is enabled in admin panel
        if (this.wysiwygConfig !== '') {
            this.wysiwygCfg = JSON.parse(this.wysiwygConfig);
            this.wysiwygCfg.height = '300px';
        }
        // Init loader and hide it
        $('body').one().loadingPopup({
            timeout: false,
        }).trigger('hideLoadingPopup');
        // If ID is already provided (means we're in edit mode)
        if (this.configuration.blockId) {
            // Show loader before request
            $('body').trigger('showLoadingPopup');
            // Send request to REST API to get CMS block data if in edit mode
            this.$http({
                headers: {
                    Accept: 'application/json',
                    Authorization: this.restToken,
                },
                method: 'get',
                url: window.location.origin + "/rest/all/V1/cmsBlock/" + this.configuration.blockId,
            }).then(function (response) {
                var responseData = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data;
                // Hide loader
                $('body').trigger('hideLoadingPopup');
                // Update components tempConfiguration
                _this.tempConfiguration.identifier = responseData.identifier;
                _this.tempConfiguration.title = responseData.title;
                _this.tempConfiguration.content = responseData.content;
                _this.configuration.title = responseData.title;
                // initialize customized WYSIWYG
                if (_this.wysiwygCfg) {
                    _this.initWysiwyg();
                }
            }, function () {
                $('body').trigger('hideLoadingPopup');
            });
        }
        else {
            // initialize customized WYSIWYG
            if (this.wysiwygCfg) {
                this.initWysiwyg();
            }
        }
        this.updateConfigurationProp();
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            var _this = this;
            // Construct data for REST API
            var dataConstruct = {
                block: {
                    identifier: this.tempConfiguration.identifier,
                    title: this.tempConfiguration.title,
                    content: this.tempConfiguration.content,
                    active: true,
                },
            };
            // Show loader before request
            $('body').trigger('showLoadingPopup');
            // Send request to REST API
            this.$http({
                headers: {
                    Accept: 'application/json',
                    Authorization: this.restToken,
                },
                method: this.configuration.blockId ? 'put' : 'post',
                url: this.configuration.blockId ? window.location.origin + "/rest/all/V1/cmsBlock/" + this.configuration.blockId : window.location.origin + "/rest/all/V1/cmsBlock",
                body: dataConstruct,
            }).then(function (response) {
                // If status is OK update component's configuration and run Save to save component data
                if (response.ok) {
                    var responseData = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data;
                    _this.configuration.blockId = responseData.id;
                    _this.configuration.title = responseData.title;
                    // Hide loader
                    $('body').trigger('hideLoadingPopup');
                    // Set headers back
                    Vue.http.headers.custom.Accept = 'text/html';
                    _this.onSave();
                }
            }, function (response) {
                // if failed and response returned any message, put it into error div, else put default text
                var responseData = {};
                try {
                    responseData = JSON.parse(response.data);
                    _this.tempConfiguration.errorMessage = responseData.message
                        ? responseData.message
                        : $t('An unknown error occured. Please try again later.');
                    // Scroll modal to top to make message visible
                    var $configuratorModal = $('.content-constructor__modal--configurator').closest('.modal-content');
                    if ($configuratorModal.length) {
                        $configuratorModal.animate({
                            scrollTop: 0,
                        }, 150);
                    }
                }
                catch (err) {
                    console.warn("Could not parse response as JSON: " + err);
                }
                
                // Set headers back
                Vue.http.headers.custom.Accept = 'text/html';
                // Hide loader
                $('body').trigger('hideLoadingPopup');
            });
        },
    },
    methods: {
        stripSpaces: function (str) {
            var striped = str.split(' ').join('-').toLowerCase();
            this.tempConfiguration.identifier = striped;
        },
        /* Opens modal with M2 built-in widget chooser
         */
        openWidgetModal: function () {
            widgetTools.openDialog(this.wysiwygCfg.widget_window_url + "widget_target_id/textarea-cfg-paragraph");
        },
        /* Opens modal with M2 built-in media uploader
         */
        openMediaModal: function () {
            MediabrowserUtility.openDialog(this.uploaderBaseUrl + "target_element_id/textarea-cfg-paragraph", 'auto', 'auto', $t('Insert File...'), {
                closed: true,
            });
        },
        /* Opens modal with M2 built-in variables
         */
        openMagentoVariablesModal: function () {
            MagentovariablePlugin.loadChooser(window.location.origin + "/" + this.adminPrefix + "/admin/system_variable/wysiwygPlugin/", 'textarea-cfg-paragraph');
        },
        initWysiwyg: function () {
            var _this = this;
            window.tinyMCE_GZ = window.tinyMCE_GZ || {};
            window.tinyMCE_GZ.loaded = true;
            require([
                'mage/translate',
                'mage/adminhtml/events',
                'ccTinyMceWysiwygSetup',
                'mage/adminhtml/wysiwyg/widget',
            ], function () {
                // Setup (this global variable is already set in constructor.phtml)
                csWysiwygEditor = new ccTinyMceWysiwygSetup('textarea-cfg-paragraph', _this.wysiwygCfg);
                // Initialization
                csWysiwygEditor.setup('exact');
                _this.isEditorVisible = true;
                // Set listener for enable/disable editor button
                Event.observe('toggle-wysiwyg', 'click', function () {
                    csWysiwygEditor.toggle();
                    _this.isEditorVisible = !_this.isEditorVisible;
                }.bind(csWysiwygEditor));
                // Set handlers for editor
                var editorFormValidationHandler = csWysiwygEditor.onFormValidation.bind(csWysiwygEditor);
                varienGlobalEvents.attachEventHandler('formSubmit', editorFormValidationHandler);
                varienGlobalEvents.clearEventHandlers('open_browser_callback');
                // Add callback for editor's IMAGE button to open file uploader while clicked
                varienGlobalEvents.attachEventHandler('open_browser_callback', csWysiwygEditor.openFileBrowser);
            });
        },
        /*
         * Set the proper option after variant click
         */
        toggleOption: function (optionCategory, optionId) {
            this.configuration.scenarios[optionCategory] = this.scenarioOptions[optionCategory][optionId];
            this.configuration.scenarios[optionCategory].id = optionId;
        },
        isColumnsConfigAvailable: function () {
            return this.configuration.scenarios.reading.id !== 'optimal';
        },
        /*
         * Backward compatibility enhancement.
         * When new props are added to the 'configuration' prop, none of already saved component has it.
         * This leads to backward compatibility issues and JS errors for existing components
         * This method takes defaults of 'configuration' and merges is with exising configuration object
         */
        updateConfigurationProp: function () {
            var propDefaults = this.$options.props.configuration.default();
            this.configuration = $.extend({}, propDefaults, this.configuration, true);
        }
    },
};

/**
 * Product carousel configurator component.
 * This component is responsible for displaying product carousel's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var productCarouselConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: "<form class=\"cc-product-carousel-configurator {{ classes }} | {{ mix }}\" {{ attributes }}>\n\n        <div class=\"cc-input cc-input--type-inline\">\n            <label class=\"cc-input__label\">" + $t('Categories') + ":</label>\n            <input type=\"hidden\" v-model=\"configuration.category_id\" @change=\"onChange\" id=\"cp-products-carousel\">\n        </div>\n\n        <div class=\"cc-input cc-input--type-inline\">\n            <label class=\"cc-input__label\" for=\"cfg-pc-skus\">" + $t('SKUs') + ":</label>\n            <input type=\"text\" name=\"cfg-pc-skus\" class=\"cc-input__input\" id=\"cfg-pc-skus\" v-model=\"configuration.skus\" @change=\"onChange\">\n        </div>\n        <div class=\"cc-input cc-input--type-inline cc-input--type-hint\">\n            <label class=\"cc-input__label\"> </label>\n            <span class=\"cc-input__hint cc-input__hint--under-field\">" + $t('Multiple, comma-separated') + "</span>\n        </div>\n        <div class=\"cc-input cc-input--type-inline cc-input--type-hint\" v-if=\"configuration.skus.length\">\n            <label class=\"cc-input__label\"> </label>\n            <span class=\"cc-input__hint cc-input__hint--under-field cc-input__hint--info-mark\">" + $t('Providing list of comma separated SKUs will disable any filtering and sorting configured for that component.  Category (if specified) will also not be taken into account. Only products with specified SKUs will be displayed in exactly the same order as they are provided in SKUs field.') + "</span>\n        </div>\n\n        <div class=\"cc-input cc-input--type-inline\">\n            <label class=\"cc-input__label\" for=\"cfg-pc-dataprovider\">" + $t('Custom Data Provider') + ":</label>\n            <input type=\"text\" name=\"cfg-pc-dataprovider\" class=\"cc-input__input\" id=\"cfg-pc-dataprovider\" v-model=\"configuration.class_overrides.dataProvider\" @change=\"onChange\">\n        </div>\n\n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-pc-filter\" class=\"cc-input__label\">" + $t('Filter') + ":</label>\n            <select name=\"cfg-pc-filter\" class=\"cc-input__select\" id=\"cfg-pc-filter\" v-model=\"configuration.filter\" @change=\"onChange\">\n                <option value=\"\">" + $t('No filter') + "</option>\n                <template v-for=\"filter in productCollectionsFilters\">\n                    <option value=\"{{ filter.value }}\" :selected=\"filter.value === configuration.filter\">{{ filter.label }}</option>\n                </template>\n            </select>\n        </div>\n\n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-pc-order-by\" class=\"cc-input__label\">" + $t('Order by') + ":</label>\n            <select name=\"cfg-pc-order-by\" class=\"cc-input__select\" id=\"cfg-pc-order-by\" v-model=\"configuration.order_by\" @change=\"onChange\">\n                <option value=\"\">" + $t('Not specified') + "</option>\n                <template v-for=\"sorter in productCollectionsSorters\">\n                    <option value=\"{{ sorter.value }}\" :selected=\"sorter.value === configuration.order_by\">{{ sorter.label }}</option>\n                </template>\n            </select>\n            <select name=\"cfg-pc-order-type\" class=\"cc-input__select\" v-model=\"configuration.order_type\" @change=\"onChange\">\n                <option value=\"ASC\">" + $t('Ascending') + "</option>\n                <option value=\"DESC\">" + $t('Descending') + "</option>\n            </select>\n        </div>\n\n        <div class=\"cc-input cc-input--type-inline\">\n            <label for=\"cfg-pc-order-by\" class=\"cc-input__label\">" + $t('Show ') + ":</label>\n            <select name=\"cfg-pc-limit\" class=\"cc-input__select\" id=\"cfg-pc-limit\" v-model=\"configuration.limit\" @change=\"onChange\">\n                <option value=\"20\">20 " + $t('products ') + "</option>\n                <option value=\"40\">40 " + $t('products ') + "</option>\n                <option value=\"60\">60 " + $t('products ') + "</option>\n                <option value=\"80\">80 " + $t('products ') + "</option>\n                <option value=\"100\">100 " + $t('products ') + "</option>\n            </select>\n        </div>\n    </form>",
    props: {
        configuration: {
            type: Object,
            default: function () {
                return {
                    category_id: '',
                    filter: '',
                    order_by: 'creation_date',
                    order_type: 'DESC',
                    limit: 20,
                    skus: '',
                    class_overrides: {
                        dataProvider: '',
                    },
                };
            },
        },
        /* Obtain endpoint for getting categories data for category picker */
        categoriesDataUrl: {
            type: String,
            default: '',
        },
        productCollectionsSorters: {
            type: [String, Array],
            default: '',
        },
        productCollectionsFilters: {
            type: [String, Array],
            default: '',
        },
    },
    data: function () {
        return {
            categoryPicker: undefined,
        };
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            if (this.configuration.class_overrides.dataProvider === '') {
                delete this.configuration.class_overrides;
            }
            this.onSave();
        },
    },
    ready: function () {
        var _this = this;
        this.productCollectionsSorters = this.productCollectionsSorters !== '' ? JSON.parse(this.productCollectionsSorters) : [];
        this.productCollectionsFilters = this.productCollectionsFilters !== '' ? JSON.parse(this.productCollectionsFilters) : [];
        if (!this.configuration.class_overrides) {
            this.configuration.class_overrides = {
                dataProvider: '',
            };
        }
        // Show loader
        $('body').trigger('showLoadingPopup');
        // Get categories JSON with AJAX
        this.$http.get(this.categoriesDataUrl).then(function (response) {
            _this.categoryPicker = new categoryPicker($('#cp-products-carousel'), JSON.parse(response.body), {
                multiple: false,
            });
            // Hide loader
            $('body').trigger('hideLoadingPopup');
        });
    },
};

var IStep = {
    "id": "",
    "additional_css_class": "",
    "title": "",
    "description": "",
    "options": [
        {
            "label": "",
            "image": "",
            "attributes": [
                {
                    "code": "",
                    "values": ["", ""]
                },
            ],
            "category_id": "",
            "next_step": ""
        },
        {
            "label": "",
            "image": "",
            "attributes": [
                {
                    "code": "",
                    "range": ["", ""]
                },
            ],
            "category_id": "",
            "next_step": ""
        },
    ],
};
/**
 * Product Finder configurator component.
 * This component is responsible for configuring Product Finder component to be displayed as CC component. It finds products based on couple of customer answers
 * @type {vuejs.ComponentOption} Vue component object.
 */
var ccProductFinderConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
        'product-finder-preview': productFinderPreview,
    },
    template: "<div class=\"cc-product-finder-configurator {{ classes }} | {{ mix }}\" {{ attributes }}>\n        <section class=\"cc-product-finder-configurator__section cc-product-finder-configurator__section--styled\">\n            <h3 class=\"cc-product-finder-configurator__subtitle\">{{ 'Default settings' | translate }}:</h3>\n            <div class=\"cc-product-finder-configurator__global-options\">\n                <div class=\"cc-input | cc-product-finder-configurator__global-option\">\n                    <label for=\"cfg-pf-layout-m\" class=\"cc-input__label | cc-product-finder-configurator__section-option-label\">{{ 'Mobile layout' | translate }}:</label>\n                    <select name=\"cfg-pf-layout-m\" class=\"cc-input__select\" id=\"cfg-pf-layout-m\" v-model=\"configuration.optionsPerRow.mobile\" @change=\"onChange\">\n                        <option value=\"1\">{{ '1 option per row' | translate }}</option>\n                        <option value=\"2\">{{ '2 options per row' | translate }}</option>\n                        <option value=\"3\">{{ '3 options per row' | translate }}</option>\n                    </select>\n                </div>\n                <div class=\"cc-input | cc-product-finder-configurator__global-option\">\n                    <label for=\"cfg-pf-layout-t\" class=\"cc-input__label | cc-product-finder-configurator__section-option-label\">{{ 'Tablet layout' | translate }}:</label>\n                    <select name=\"cfg-pf-layout-t\" class=\"cc-input__select\" id=\"cfg-pf-layout-t\" v-model=\"configuration.optionsPerRow.tablet\" @change=\"onChange\">\n                        <option value=\"2\">{{ '2 options per row' | translate }}</option>\n                        <option value=\"3\">{{ '3 options per row' | translate }}</option>\n                        <option value=\"4\">{{ '4 options per row' | translate }}</option>\n                    </select>\n                </div>\n                <div class=\"cc-input | cc-product-finder-configurator__global-option\">\n                    <label for=\"cfg-pf-layout-d\" class=\"cc-input__label | cc-product-finder-configurator__section-option-label\">{{ 'Desktop layout' | translate }}:</label>\n                    <select name=\"cfg-pf-layout-d\" class=\"cc-input__select\" id=\"cfg-pf-layout-d\" v-model=\"configuration.optionsPerRow.desktop\" @change=\"onChange\">\n                        <option value=\"3\">{{ '3 options per row' | translate }}</option>\n                        <option value=\"4\">{{ '4 options per row' | translate }}</option>\n                        <option value=\"5\">{{ '5 options per row' | translate }}</option>\n                        <option value=\"6\">{{ '6 options per row' | translate }}</option>\n                    </select>\n                </div>\n            </div>\n        </section>\n\n        <section class=\"cc-product-finder-configurator__section\">\n            <component-adder class=\"cc-component-adder cc-component-adder--static\" v-show=\"!configuration.steps.length\">\n                <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-product-finder-configurator__item-action-button\" @click=\"createStep(0)\">\n                    <svg class=\"cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon\">\n                        <use v-bind=\"{ 'xlink:href': '#icon_plus' }\"></use>\n                    </svg>\n                </button>\n            </component-adder>\n\n            <template v-for=\"step in configuration.steps\">\n                <div class=\"cc-product-finder-configurator__step\" id=\"cc-product-finder-step-{{ $index }}\">\n                    <component-adder class=\"cc-component-adder cc-component-adder--first\">\n                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-product-finder-configurator__item-action-button\" @click=\"createStep($index)\">\n                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_300\">\n                                <use xlink:href=\"#icon_plus\"></use>\n                            </svg>\n                        </button>\n                    </component-adder>\n\n                    <div class=\"cc-product-finder-configurator__step-content\">\n                        <div :class=\"[ componentConfigurationErrors[$index] ? 'cc-product-finder-configurator__preview cc-product-finder-configurator__preview--error' : 'cc-product-finder-configurator__preview' ]\">\n                            <div class=\"cc-product-finder-configurator__error\" v-if=\"componentConfigurationErrors[$index]\">\n                                {{ componentConfigurationErrors[$index] }}\n                            </div>\n\n                            <template v-if=\"!componentConfigurationErrors[$index]\">\n                                <product-finder-preview :configuration=\"configuration\" :step-index=\"$index\" :is-configurator-preview=\"true\" :image-endpoint=\"imageEndpoint\"></product-finder-preview>\n                            </template>\n\n                            <div class=\"cc-product-finder-configurator__step-actions\">\n                                <component-actions>\n                                    <template slot=\"cc-component-actions__buttons\">\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--up | cc-product-finder-configurator__item-action-button\" @click=\"moveStepUp($index)\" :class=\"[ isFirstStep($index) ? 'cc-action-button--look_disabled' : '' ]\" :disabled=\"isFirstStep($index)\">\n                                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                <use xlink:href=\"#icon_arrow-up\"></use>\n                                            </svg>\n                                        </button>\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--down | cc-product-finder-configurator__item-action-button\" @click=\"moveStepDown( $index )\" :class=\"[ isLastStep($index) ? 'cc-action-button--look_disabled' : '' ]\" :disabled=\"isLastStep($index)\">\n                                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                <use xlink:href=\"#icon_arrow-down\"></use>\n                                            </svg>\n                                        </button>\n                                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--delete | cc-product-finder-configurator__item-action-button\" @click=\"deleteStep($index)\">\n                                            <svg class=\"cc-action-button__icon\">\n                                                <use xlink:href=\"#icon_trash-can\"></use>\n                                            </svg>\n                                        </button>\n                                    </template>\n                                </component-actions>\n                            </div>\n                        </div>\n\n                        <div class=\"cc-input | cc-product-finder-configurator__source\">\n                            <div class=\"buttons-set\">\n                                <button type=\"button\" class=\"scalable action-add-image plugin\" @click=\"getImageUploader($index)\">{{ 'Insert Image' | translate }}...</button>\n                            </div>\n                            <textarea class=\"cc-input__textarea | cc-product-finder-configurator__editor\" id=\"cfg-pf-step{{ $index }}-sourcefield\" @keydown=\"saveCaretPosition($event)\" @click=\"saveCaretPosition($event)\" v-model=\"step | prettify $index\"></textarea>\n                            <input type=\"hidden\" class=\"cc-product-finder-configurator__imgholder\" data-step-index=\"{{$index}}\" id=\"pf-imgholder-{{$index}}\" />\n                        </div>\n                    </div>\n\n                    <component-adder class=\"cc-component-adder cc-component-adder--last\" v-if=\"configuration.steps.length\">\n                        <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-product-finder-configurator__item-action-button\" @click=\"createStep( $index + 1 )\">\n                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_300\">\n                                <use xlink:href=\"#icon_plus\"></use>\n                            </svg>\n                        </button>\n                    </component-adder>\n                </div>\n            </template>\n        </section>\n    </div>",
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            this.configuration.isError = false;
            for (var _i = 0, _a = this.componentConfigurationErrors; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.length) {
                    this.configuration.isError = true;
                }
            }
            this.onSave();
        },
    },
    props: {
        configuration: {
            type: Object,
            default: function () {
                return {
                    optionsPerRow: {
                        mobile: 1,
                        tablet: 3,
                        desktop: 6,
                    },
                    steps: [JSON.parse(JSON.stringify(IStep))],
                    isError: false,
                };
            },
        },
        /* Obtain base-url for the image uploader */
        uploaderBaseUrl: {
            type: String,
            default: '',
        },
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
    },
    data: function () {
        return {
            componentConfigurationErrors: this.prepareComponentErrorsArray(),
            caretPosition: 1,
        };
    },
    filters: {
        /**
          * Two-way filter for step content displaing in textarea and keeping in configuration.
         */
        prettify: {
            /** Displays stringified JSON in textarea if not step is not stringified yet.
             *  If step is already stringified because it couldn't be saved, just return back what came in.
             * @param stepContent {string} - content of textarea
             * @param stepIndex {number} - index of a single step
             * @return {String} - Stringified JSON of given step
             */
            read: function (stepContent, stepIndex) {
                if (this.componentConfigurationErrors[stepIndex].length) {
                    return stepContent;
                }
                return JSON.stringify(stepContent, null, 2);
            },
            /** Tests if step content provided in textarea can be JSON.parsed.
             *  If yes - saves in component's configuration and removes step error if there was any.
             *  If not - obtains error message and passes it to setError method. Returns what came in.
             * @param newStepContent {string} - current content of textarea
             * @param oldStepContent {string} - content of textarea in state it was before change was made
             * @param stepIndex {number} - index of a single step
             * @return {JSON, String} - if string can be parsed to JSON, returns JSON, otherwise String
             */
            write: function (newStepContent, oldStepContent, stepIndex) {
                var result;
                try {
                    result = JSON.parse(newStepContent);
                }
                catch (err) {
                    if (err.hasOwnProperty('message')) {
                        this.setError(stepIndex, err.message);
                    }
                    else {
                        this.setError(stepIndex, JSON.stringify(err));
                    }
                }
                
                if (result) {
                    this.clearError(stepIndex);
                    return result;
                }
                return newStepContent;
            },
        },
        /** Translates given string
         * @param txt {string} - original, english string to be translated
         * @return {string} - translated string
         */
        translate: function (txt) {
            return $.mage.__(txt);
        },
    },
    methods: {
        /** Pushes error message to the componentConfigurationErrors Array on given index
         * @param stepIndex {number} - index of a single step
         */
        setError: function (stepIndex, err) {
            this.componentConfigurationErrors.$set(stepIndex, err);
        },
        /** Clears error message from the given index of componentConfigurationErrors Array
         * @param stepIndex {number} - index of a single step
         */
        clearError: function (stepIndex) {
            this.componentConfigurationErrors.$set(stepIndex, '');
        },
        /** Creates new step on given position
         * @param stepIndex {number} - index of a new step to be created in
         */
        createStep: function (stepIndex) {
            this.configuration.steps.splice(stepIndex, 0, JSON.parse(JSON.stringify(IStep)));
            this.componentConfigurationErrors.splice(stepIndex, 0, '');
        },
        /** Removes given step after "Delete" button is clicked
         * @param stepIndex {number} - index of step to remove
         */
        deleteStep: function (stepIndex) {
            var component = this;
            confirm({
                content: $.mage.__('Are you sure you want to delete this step?'),
                actions: {
                    confirm: function () {
                        component.configuration.steps.splice(stepIndex, 1);
                        component.componentConfigurationErrors.splice(stepIndex, 1);
                    }
                },
            });
        },
        /** Prepares errors array for every step on each component render.
         *  It's not saved in configuration so must be called on every open
         * @return {Array} - array with as many empty entires as steps provided
         */
        prepareComponentErrorsArray: function () {
            var errorsArray = [];
            for (var _i = 0, _a = this.configuration.steps; _i < _a.length; _i++) {
                var step = _a[_i];
                errorsArray.push('');
            }
            return errorsArray;
        },
        /** Opens Magento's built-in image uploader/chooser modal
         * @param stepIndex {number} - index of a step for which image is inserted
         */
        getImageUploader: function (stepIndex) {
            MediabrowserUtility.openDialog(this.uploaderBaseUrl + "target_element_id/pf-imgholder-" + stepIndex, 'auto', 'auto', $.mage.__('Insert File...'), {
                closed: true,
            });
        },
        /* Listener for image uploader
         * Since Magento does not provide any callback after image has been chosen
         * we have to watch for target where decoded url is placed
         */
        imageUploadListener: function () {
            var component = this;
            var isAlreadyCalled = false;
            // jQuery has to be used, for some reason native addEventListener doesn't catch change of input's value
            $(document).on('change', '.cc-product-finder-configurator__imgholder', function (event) {
                if (!isAlreadyCalled) {
                    isAlreadyCalled = true;
                    component.setImageUrl(event);
                    setTimeout(function () {
                        isAlreadyCalled = false;
                    }, 100);
                }
            });
        },
        /** Action after image was uploaded
         * URL is encoded.
         * - strips it and decode Base64 to get {{ media url="..."}} format which will go to the step.image and will be used to display image on front end.
         * - escapes all double-quotes inside this new url format
         * - puts newly created string into proper place (where cursor was last time)
         * - trigger change event so that vue knows step content has changed
         * @param event {Event} - event passed from upload action
         */
        setImageUrl: function (event) {
            var input = event.target;
            var encodedImage = input.value.match('___directive\/([a-zA-Z0-9]*)')[1];
            var imageUrl = window.atob(encodedImage);
            var stepEl = input.previousElementSibling;
            var stepText = stepEl.value;
            var finalImageUrl = imageUrl.replace(/\"/g, '\\"');
            stepEl.value = stepText.substr(0, this.caretPosition) + finalImageUrl + stepText.substr(this.caretPosition);
            $(stepEl).trigger('change');
        },
        /** Saves caret position in step's textarea on every click and keydown
         * @param event {Event} - click/keyup event
         */
        saveCaretPosition: function (event) {
            var el = event.target;
            this.caretPosition = el.selectionStart || 0;
        },
        /**
         * Moves step under given index up by swaping it with previous element.
         * @param {number} stepIndex step's index in array.
         */
        moveStepUp: function (stepIndex) {
            var _this = this;
            if (stepIndex > 0) {
                var $thisItem_1 = $("#cc-product-finder-step-" + stepIndex);
                var $prevItem_1 = $("#cc-product-finder-step-" + (stepIndex - 1));
                $thisItem_1.addClass('cc-product-finder-configurator__step--animating').css('transform', "translateY(" + -Math.abs($prevItem_1.outerHeight(true)) + "px)");
                $prevItem_1.addClass('cc-product-finder-configurator__step--animating').css('transform', "translateY(" + $thisItem_1.outerHeight(true) + "px)");
                setTimeout(function () {
                    _this.configuration.steps.splice(stepIndex - 1, 0, _this.configuration.steps.splice(stepIndex, 1)[0]);
                    $thisItem_1.removeClass('cc-product-finder-configurator__step--animating').css('transform', '');
                    $prevItem_1.removeClass('cc-product-finder-configurator__step--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Moves step under given index down by swaping it with next element.
         * @param {number} stepIndex step's index in array.
         */
        moveStepDown: function (stepIndex) {
            var _this = this;
            if (stepIndex < this.configuration.steps.length - 1) {
                var $thisItem_2 = $("#cc-product-finder-step-" + stepIndex);
                var $nextItem_1 = $("#cc-product-finder-step-" + (stepIndex + 1));
                $thisItem_2.addClass('cc-product-finder-configurator__step--animating').css('transform', "translateY(" + $nextItem_1.outerHeight(true) + "px)");
                $nextItem_1.addClass('cc-product-finder-configurator__step--animating').css('transform', "translateY(" + -Math.abs($thisItem_2.outerHeight(true)) + "px)");
                setTimeout(function () {
                    _this.configuration.steps.splice(stepIndex + 1, 0, _this.configuration.steps.splice(stepIndex, 1)[0]);
                    $thisItem_2.removeClass('cc-product-finder-configurator__step--animating').css('transform', '');
                    $nextItem_1.removeClass('cc-product-finder-configurator__step--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Tells if step with given index is the first step.
         * @param  {number}  stepIndex Index of the step.
         * @return {boolean} If step is first in array.
         */
        isFirstStep: function (stepIndex) {
            return stepIndex === 0;
        },
        /**
         * Tells if step with given index is the last step.
         * @param  {number}  stepIndex Index of the step.
         * @return {boolean} If step is last in array.
         */
        isLastStep: function (stepIndex) {
            return stepIndex === this.configuration.steps.length - 1;
        },
    },
    ready: function () {
        this.imageUploadListener();
    },
};

/**
 * Product grid configurator component.
 * This component is responsible for displaying products grid  configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var productsGridConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: "<div class=\"cc-products-grid-configurator {{ classes }} | {{ mix }}\" {{ attributes }}>\n        <section class=\"cc-products-grid-configurator__section\">\n            <h3 class=\"cc-products-grid-configurator__subtitle\">" + $t('Data source') + ":</h3>\n            <div class=\"cc-products-grid-configurator__scenario-options cc-products-grid-configurator__scenario-options--inputs\">\n                <div class=\"cc-input cc-input--type-inline | cc-products-grid-configurator__section-option\">\n                    <label for=\"cfg-pg-category\" class=\"cc-input__label | cc-products-grid-configurator__section-option-label\">" + $t('Category ID') + ":</label>\n                    <select class=\"cc-input__select tmp-select\" style=\"width:25em\">\n                        <option>" + $t('Select...') + "</option>\n                    </select>\n                    <input type=\"hidden\" name=\"cfg-pg-category-select\" class=\"cc-input__input | cc-products-grid-configurator__form-input\" id=\"cfg-pg-category\" v-model=\"configuration.category_id\" @change=\"onChange\">\n                </div>\n                <div class=\"cc-input cc-input--type-inline | cc-products-grid-configurator__section-option\">\n                    <label for=\"cfg-pg-filter\" class=\"cc-input__label | cc-products-grid-configurator__section-option-label\">" + $t('Filter') + ":</label>\n                    <select name=\"cfg-pg-filter\" class=\"cc-input__select\" id=\"cfg-pg-filter\" v-model=\"configuration.filter\" @change=\"onChange\">\n                        <option value=\"\">" + $t('No filter') + "</option>\n                        <template v-for=\"filter in productCollectionsFilters\">\n                            <option value=\"{{ filter.value }}\" :selected=\"filter.value === configuration.filter\">{{ filter.label }}</option>\n                        </template>\n                    </select>\n                </div>\n                <div class=\"cc-input | cc-products-grid-configurator__section-option\">\n                    <label for=\"cfg-pg-skus\" class=\"cc-input__label\">" + $t('SKUs') + ":</label>\n                    <input type=\"text\" name=\"cfg-pg-skus\" class=\"cc-input__input\" id=\"cfg-pg-skus\" v-model=\"configuration.skus\" @change=\"onChange\">\n                    <div class=\"cc-input__hint\">" + $t('Multiple, comma-separated') + "</div>\n                </div>\n                <div class=\"cc-input cc-input--type-inline | cc-products-grid-configurator__section-option\">\n                    <label for=\"cfg-pg-order-by\" class=\"cc-input__label | cc-products-grid-configurator__section-option-label\">" + $t('Order by') + ":</label>\n                    <select name=\"cfg-pg-order-by\" class=\"cc-input__select\" id=\"cfg-pg-order-by\" v-model=\"configuration.order_by\" @change=\"onChange\">\n                        <option value=\"\">" + $t('Not specified') + "</option>\n                        <template v-for=\"sorter in productCollectionsSorters\">\n                            <option value=\"{{ sorter.value }}\" :selected=\"sorter.value === configuration.order_by\">{{ sorter.label }}</option>\n                        </template>\n                    </select>\n                    <select name=\"cfg-pg-order-type\" class=\"cc-input__select\" v-model=\"configuration.order_type\" @change=\"onChange\">\n                        <option value=\"ASC\">" + $t('Ascending') + "</option>\n                        <option value=\"DESC\">" + $t('Descending') + "</option>\n                    </select>\n                </div>\n                <div class=\"cc-input | cc-products-grid-configurator__section-option\">\n                    <label for=\"cfg-pg-dataprovider\" class=\"cc-input__label\">" + $t('Custom Data Provider') + ":</label>\n                    <input type=\"text\" name=\"cfg-pg-dataprovider\" class=\"cc-input__input\" id=\"cfg-pg-dataprovider\" v-model=\"configuration.class_overrides.dataProvider\" @change=\"onChange\">\n                </div>\n                <div class=\"cc-input__hint cc-input__hint--info-mark\" v-if=\"configuration.skus.length\">\n                    " + $t('Providing list of comma separated SKUs will disable any filtering and sorting configured for that component.  Category (if specified) will also not be taken into account. Only products with specified SKUs will be displayed in exactly the same order as they are provided in SKUs field.') + "\n                </div>\n            </div>\n        </section>\n\n        <section class=\"cc-products-grid-configurator__section\">\n            <h3 class=\"cc-products-grid-configurator__subtitle\">" + $t('Mobile Layout') + ":</h3>\n            <div class=\"cc-products-grid-configurator__scenario-options\">\n                <ul class=\"cc-products-grid-configurator__scenario-options-list\">\n                    <li\n                        :class=\"{\n                            'cc-products-grid-configurator__option--selected': isOptionSelected('rows_mobile', optionId),\n                        }\"\n                        class=\"cc-products-grid-configurator__option\"\n                        v-for=\"(optionId, option) in scenarioOptions.rows_mobile\"\n                        @click=\"setOption('rows_mobile', optionId)\">\n                        <div class=\"cc-products-grid-configurator__option-wrapper\">\n                            <svg class=\"cc-products-grid-configurator__option-icon\">\n                                <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                            </svg>\n                        </div>\n                        <p class=\"cc-products-grid-configurator__option-name\">\n                            <input v-if=\"optionId === '1000'\" type=\"text\" name=\"cfg-ml-custom\" class=\"cc-input__input cc-input__input--type-tiny\" id=\"cfg-ml-custom\" maxlength=\"3\" v-model=\"tmpConfiguration.rows_mobile\" @change=\"setOption('rows_mobile', tmpConfiguration.rows_mobile)\">\n                            {{ option.name }}\n                        </p>\n                    </li>\n                </ul>\n            </div>\n        </section>\n\n        <section class=\"cc-products-grid-configurator__section\">\n            <h3 class=\"cc-products-grid-configurator__subtitle\">" + $t('Tablet Layout') + ":</h3>\n            <div class=\"cc-products-grid-configurator__scenario-options\">\n                <ul class=\"cc-products-grid-configurator__scenario-options-list\">\n                    <li\n                        :class=\"{\n                            'cc-products-grid-configurator__option--selected': isOptionSelected('rows_tablet', optionId),\n                        }\"\n                        class=\"cc-products-grid-configurator__option\"\n                        v-for=\"(optionId, option) in scenarioOptions.rows_tablet\"\n                        @click=\"setOption('rows_tablet', optionId)\">\n                        <div class=\"cc-products-grid-configurator__option-wrapper\">\n                            <svg class=\"cc-products-grid-configurator__option-icon\">\n                                <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                            </svg>\n                        </div>\n                        <p class=\"cc-products-grid-configurator__option-name\">\n                            <input v-if=\"optionId === '1000'\" type=\"text\" name=\"cfg-tl-custom\" class=\"cc-input__input cc-input__input--type-tiny\" id=\"cfg-tl-custom\" maxlength=\"3\" v-model=\"tmpConfiguration.rows_tablet\" @change=\"setOption('rows_tablet', tmpConfiguration.rows_tablet)\">\n                            {{ option.name }}\n                        </p>\n                    </li>\n                </ul>\n            </div>\n        </section>\n\n        <section class=\"cc-products-grid-configurator__section\">\n            <h3 class=\"cc-products-grid-configurator__subtitle\">" + $t('Desktop Layout') + ":</h3>\n            <div class=\"cc-products-grid-configurator__scenario-options\">\n                <ul class=\"cc-products-grid-configurator__scenario-options-list\">\n                    <li\n                        :class=\"{\n                            'cc-products-grid-configurator__option--selected': isOptionSelected('rows_desktop', optionId),\n                        }\"\n                        class=\"cc-products-grid-configurator__option\"\n                        v-for=\"(optionId, option) in scenarioOptions.rows_desktop\"\n                        @click=\"setOption('rows_desktop', optionId)\">\n                        <div class=\"cc-products-grid-configurator__option-wrapper\">\n                            <svg class=\"cc-products-grid-configurator__option-icon\">\n                                <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                            </svg>\n                        </div>\n                        <p class=\"cc-products-grid-configurator__option-name\">\n                            <input v-if=\"optionId === '1000'\" type=\"text\" name=\"cfg-dl-custom\" class=\"cc-input__input cc-input__input--type-tiny\" id=\"cfg-dl-custom\" maxlength=\"3\" v-model=\"tmpConfiguration.rows_desktop\" @change=\"setOption('rows_desktop', tmpConfiguration.rows_desktop)\">\n                            {{ option.name }}\n                        </p>\n                    </li>\n                </ul>\n            </div>\n        </section>\n\n        <section class=\"cc-products-grid-configurator__section\">\n            <h3 class=\"cc-products-grid-configurator__subtitle\">" + $t('Hero Teaser') + ":</h3>\n            <div class=\"cc-products-grid-configurator__scenario-options\">\n                <ul class=\"cc-products-grid-configurator__scenario-options-list\">\n                    <li\n                        :class=\"{\n                            'cc-products-grid-configurator__option--selected': configuration.hero.position == optionId,\n                        }\"\n                        class=\"cc-products-grid-configurator__option\"\n                        v-for=\"(optionId, option) in scenarioOptions.hero.position\"\n                        @click=\"setOption('hero', optionId, 'position')\">\n                        <div class=\"cc-products-grid-configurator__option-wrapper\">\n                            <svg class=\"cc-products-grid-configurator__option-icon\">\n                                <use v-bind=\"{ 'xlink:href': '#' + option.iconId }\"></use>\n                            </svg>\n                        </div>\n                        <p class=\"cc-products-grid-configurator__option-name\">\n                            {{ option.name }}\n                        </p>\n                    </li>\n                </ul>\n            </div>\n        </section>\n\n        <div class=\"cc-products-grid-configurator__item\" v-show=\"configuration.hero.position\">\n            <div class=\"cc-hero-carousel-configurator__item-content\">\n                <div v-bind:class=\"[ 'cc-products-grid-configurator__item-col-left', configuration.hero.image ? 'cc-products-grid-configurator__item-col-left--look-image-uploaded' : '' ]\">\n                    <div class=\"cc-products-grid-configurator__item-image-wrapper\">\n                        <img :src=\"configuration.hero.image\" class=\"cc-image-teaser-configurator__item-image\" v-show=\"configuration.hero.image\">\n                        <input type=\"hidden\" v-model=\"configuration.hero.image\">\n                        <input type=\"hidden\" class=\"cc-products-grid-configurator__image-url\" id=\"products-grid-img\">\n                        <svg class=\"cc-products-grid-configurator__item-image-placeholder\" v-show=\"!configuration.hero.image\">\n                            <use xlink:href=\"#icon_image-placeholder\"></use>\n                        </svg>\n\n                        <div class=\"cc-products-grid-configurator__item-actions\">\n                            <component-actions>\n                                <template slot=\"cc-component-actions__buttons\">\n                                    <button is=\"action-button\" class=\"cc-action-button cc-action-button--look_default cc-action-button--type_icon | cc-component-actions__button cc-component-actions__button--upload-image | cc-products-grid-configurator__item-action-button\" @click=\"getImageUploader()\">\n                                            <svg class=\"cc-action-button__icon cc-action-button__icon--size_100\">\n                                                <use xlink:href=\"#icon_upload-image\"></use>\n                                            </svg>\n                                            {{ configuration.hero.image ? imageUploadedText : noImageUploadedText }}\n                                    </button>\n                                </template>\n                            </component-actions>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"cc-products-grid-configurator__item-col-right\">\n                    <div class=\"cc-input cc-input--group\">\n                        <div class=\"cc-input | cc-image-teaser-configurator__item-form-element\">\n                            <label for=\"cfg-pg-hero_content-position-variant\" class=\"cc-input__label\">" + $t('Display variant') + ":</label>\n                            <select name=\"cfg-pg-hero_content-position-variant\" class=\"cc-input__select\" id=\"cfg-pg-hero_content-position-variant\" v-model=\"configuration.hero.displayVariant\">\n                                <template v-for=\"(idx, scenario) in imageTeasersContentPositions\">\n                                    <option value=\"{{ idx + 1 }}\">" + $t('{{ scenario }}') + "</option>\n                                </template>\n                            </select>\n                        </div>\n                        <div class=\"cc-input | cc-image-teaser-configurator__item-form-element\">\n                            <label for=\"cfg-pg-hero_color-scheme\" class=\"cc-input__label\">" + $t('Text color scheme') + ":</label>\n                            <select name=\"cfg-pg-hero_color-scheme\" class=\"cc-input__select\" id=\"cfg-pg-hero_color-scheme\" v-model=\"configuration.hero.colorScheme\">\n                                <option value=\"light\">" + $t('Light') + "</option>\n                                <option value=\"dark\">" + $t('Dark') + "</option>\n                            </select>\n                        </div>\n                    </div>\n                    <div class=\"cc-input | cc-products-grid-configurator__item-form-element\">\n                        <label for=\"cfg-pg-hero_headline\" class=\"cc-input__label\">" + $t('Headline') + ":</label>\n                        <input type=\"text\" name=\"cfg-pg-hero_headline\" class=\"cc-input__input\" id=\"cfg-pg-hero_headline\" v-model=\"configuration.hero.headline\" @change=\"onChange\">\n                    </div>\n                    <div class=\"cc-input | cc-products-grid-configurator__item-form-element\">\n                        <label for=\"cfg-pg-hero_subheadline\" class=\"cc-input__label\">" + $t('Subheadline') + ":</label>\n                        <input type=\"text\" name=\"cfg-pg-hero_subheadline\" class=\"cc-input__input\" id=\"cfg-pg-hero_subheadline\" v-model=\"configuration.hero.subheadline\" @change=\"onChange\">\n                    </div>\n                    <div class=\"cc-input | cc-products-grid-configurator__item-form-element\">\n                        <label for=\"cfg-pg-hero_paragraph\" class=\"cc-input__label | cc-products-grid-configurator__form-label--textarea\">" + $t('Paragraph') + ":</label>\n                        <textarea type=\"text\" name=\"cfg-pg-hero_paragraph\" class=\"cc-input__textarea\" id=\"cfg-pg-hero_paragraph\" v-model=\"configuration.hero.paragraph\"></textarea>\n                    </div>\n                    <div class=\"cc-input cc-input--group\">\n                        <div class=\"cc-input | cc-products-grid-configurator__item-form-element\">\n                            <label for=\"cfg-pg-hero_button_label\" class=\"cc-input__label\">" + $t('Button label') + ":</label>\n                            <input type=\"text\" name=\"cfg-pg-hero_button_label\" class=\"cc-input__input\" id=\"cfg-pg-hero_button_label\" v-model=\"configuration.hero.button.label\" @change=\"onChange\">\n                        </div>\n                        <div class=\"cc-input cc-input--type-addon | cc-products-grid-configurator__item-form-element\">\n                            <label for=\"cfg-pg-hero_url\" class=\"cc-input__label\">" + $t('Url') + ":</label>\n                            <input type=\"text\" name=\"cfg-pg-hero_url\" class=\"cc-input__input | cc-products-grid__hero-url\" id=\"cfg-pg-hero_url\" v-model=\"configuration.hero.href\">\n                            <span class=\"cc-input__addon | cc-products-grid-configurator__widget-chooser-trigger\" @click=\"openCtaTargetModal()\">\n                                <svg class=\"cc-input__addon-icon\">\n                                    <use xlink:href=\"#icon_link\"></use>\n                                </svg>\n                            </span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>",
    /**
     * Get dependencies
     */
    components: {
        'action-button': actionButton,
        'component-actions': componentActions,
    },
    props: {
        configuration: {
            type: Object,
            default: function () {
                return {
                    category_id: '',
                    filter: '',
                    order_by: 'creation_date',
                    order_type: 'ASC',
                    rows_desktop: 1,
                    rows_tablet: 1,
                    rows_mobile: 1,
                    skus: '',
                    limit: '',
                    class_overrides: {
                        dataProvider: '',
                    },
                    hero: {
                        position: '',
                        image: '',
                        displayVariant: '1',
                        colorScheme: 'light',
                        headline: '',
                        subheadline: '',
                        paragraph: '',
                        href: '',
                        button: {
                            label: '',
                        },
                        decoded_image: '',
                    },
                };
            },
        },
        /* get assets for displaying component images */
        assetsSrc: {
            type: String,
            default: '',
        },
        /* Obtain base-url for the image uploader */
        uploaderBaseUrl: {
            type: String,
            default: '',
        },
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
        /* Obtain endpoint for getting categories data for category picker */
        categoriesDataUrl: {
            type: String,
            default: '',
        },
        /* Obtain admin url */
        adminPrefix: {
            type: String,
            default: 'admin',
        },
        /* Obtain content-constructor's config file */
        ccConfig: {
            type: Object,
            default: function () {
                return {};
            },
        },
        productCollectionsSorters: {
            type: [String, Array],
            default: '',
        },
        productCollectionsFilters: {
            type: [String, Array],
            default: '',
        },
    },
    computed: {
        imageTeasersContentPositions: function () {
            return Object.values(this.ccConfig.imageTeasersContentPositions);
        },
    },
    data: function () {
        return {
            imageUploadedText: $t('Change'),
            noImageUploadedText: $t('Upload'),
            categoryPicker: undefined,
            tmpConfiguration: {
                rows_mobile: this.getRowsSetup('rows_mobile'),
                rows_tablet: this.getRowsSetup('rows_tablet'),
                rows_desktop: this.getRowsSetup('rows_desktop'),
            },
            scenarioOptions: {
                rows_mobile: {
                    1: {
                        name: $t('1 row of products'),
                        iconId: 'pr_1',
                    },
                    2: {
                        name: $t('2 rows of products'),
                        iconId: 'pr_2',
                    },
                    3: {
                        name: $t('3 rows of products'),
                        iconId: 'pr_3',
                    },
                    4: {
                        name: $t('4 rows of products'),
                        iconId: 'pr_4',
                    },
                    1000: {
                        name: $t(' rows of products'),
                        iconId: 'pr_custom',
                    },
                },
                rows_tablet: {
                    1: {
                        name: $t('1 row of products'),
                        iconId: 'pr_1',
                    },
                    2: {
                        name: $t('2 rows of products'),
                        iconId: 'pr_2',
                    },
                    3: {
                        name: $t('3 rows of products'),
                        iconId: 'pr_3',
                    },
                    4: {
                        name: $t('4 rows of products'),
                        iconId: 'pr_4',
                    },
                    1000: {
                        name: $t(' rows of products'),
                        iconId: 'pr_custom',
                    },
                },
                rows_desktop: {
                    1: {
                        name: $t('1 row of products'),
                        iconId: 'pr_1',
                    },
                    2: {
                        name: $t('2 rows of products'),
                        iconId: 'pr_2',
                    },
                    3: {
                        name: $t('3 rows of products'),
                        iconId: 'pr_3',
                    },
                    4: {
                        name: $t('4 rows of products'),
                        iconId: 'pr_4',
                    },
                    1000: {
                        name: $t(' rows of products'),
                        iconId: 'pr_custom',
                    },
                },
                hero: {
                    position: {
                        '': {
                            name: $t('No Hero Teaser'),
                            iconId: 'no_teaser',
                        },
                        'left': {
                            name: $t('Hero Teaser on the left'),
                            iconId: 'teaser_left',
                        },
                        'right': {
                            name: $t('Hero Teaser on the right'),
                            iconId: 'teaser_right',
                        }
                    }
                },
            },
        };
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            if (this.configuration.class_overrides.dataProvider === '') {
                delete this.configuration.class_overrides;
            }
            this.onSave();
        },
    },
    methods: {
        setOption: function (optionCategory, optionId, key) {
            if (key) {
                this.configuration[optionCategory][key] = optionId;
            }
            else {
                this.configuration[optionCategory] = optionId === '1000' ? this.tmpConfiguration[optionCategory] : optionId;
            }
            this.setProductsLimit();
        },
        /* Opens M2's built-in image manager modal.
         * Manages all images: image upload from hdd, select image that was already uploaded to server.
         * @param index {number} - index of image of image teaser.
         */
        getImageUploader: function (index) {
            MediabrowserUtility.openDialog(this.uploaderBaseUrl + "target_element_id/products-grid-img/", 'auto', 'auto', $t('Insert File...'), {
                closed: true,
            });
        },
        /* Listener for image uploader
         * Since Magento does not provide any callback after image has been chosen
         * we have to watch for target where decoded url is placed
         */
        imageUploadListener: function () {
            var component = this;
            var isAlreadyCalled = false;
            // jQuery has to be used, for some reason native addEventListener doesn't catch change of input's value
            $(document).on('change', '.cc-products-grid-configurator__image-url', function (event) {
                if (!isAlreadyCalled) {
                    isAlreadyCalled = true;
                    component.onImageUploaded(event.target);
                    setTimeout(function () {
                        isAlreadyCalled = false;
                    }, 100);
                }
            });
        },
        /* Action after image was uploaded
         * URL is encoded, so strip it and decode Base64 to get {{ media url="..."}} format
         * which will go to the items.image and will be used to display image on front end
         * @param input { object } - input with raw image path which is used in admin panel
         */
        onImageUploaded: function (input) {
            var _this = this;
            // const itemIndex: any = input.id.substr( input.id.length - 1 );
            var encodedImage = input.value.match('___directive\/([a-zA-Z0-9]*)')[1];
            var imgEndpoint = this.imageEndpoint.replace('{/encoded_image}', encodedImage);
            this.configuration.hero.decoded_image = Base64 ? Base64.decode(encodedImage) : window.atob(encodedImage);
            var img = new Image();
            img.onload = function () {
                _this.configuration.hero.image = img.getAttribute('src');
                _this.onChange();
            };
            img.src = imgEndpoint;
        },
        /*
         * Opens modal with M2 built-in widget chooser
         */
        openCtaTargetModal: function () {
            widgetTools.openDialog(window.location.origin + "/" + this.adminPrefix + "/admin/widget/index/widget_target_id/cfg-pg-hero_url");
            this.wWidgetListener();
        },
        /* Sets listener for widget chooser
         * It triggers component.onChange to update component's configuration
         * after value of item.ctaTarget is changed
         */
        widgetSetListener: function () {
            var _this = this;
            $('.cc-products-grid__hero-url').on('change', function () {
                _this.onChange();
            });
        },
        /*
         * Check if widget chooser is loaded. If not, wait for it, if yes:
         * Override default onClick for "Insert Widget" button in widget's modal window
         * to clear input's value before inserting new one
         */
        wWidgetListener: function () {
            var _this = this;
            if (typeof wWidget !== 'undefined' && widgetTools.dialogWindow[0].innerHTML !== '') {
                var button = widgetTools.dialogWindow[0].querySelector('#insert_button');
                button.onclick = null;
                button.addEventListener('click', function () {
                    _this.configuration.hero.href = '';
                    wWidget.insertWidget();
                });
            }
            else {
                setTimeout(this.wWidgetListener, 300);
            }
        },
        /**
         * Checks if given option is currently selected
         * @param  optionCategory {string} - section of the option
         * @param  optionId {string} - value of the option
         * @return {boolean}
         */
        isOptionSelected: function (optionCategory, optionId) {
            return this.configuration[optionCategory] == optionId || (optionId === '1000' && this.configuration[optionCategory] > 4);
        },
        /**
         * This method is searching through ccConfig configuration
         * to find the highest value for columns across whole project
         * @return {number} the highest possible columns per row value
         */
        getMaxPossibleColumns: function () {
            return Math.max.apply(Math, Object.values(this.ccConfig.columns['one-column']));
        },
        /**
         * Calculate how many products should be returned by BE,
         * then saves result to component's configuration
         */
        setProductsLimit: function () {
            var heroWidth = parseInt(this.ccConfig.productsGrid.heroSize.x, 10);
            var heroHeight = parseInt(this.ccConfig.productsGrid.heroSize.y, 10);
            var maxRowsSet = Math.max(this.configuration.rows_mobile, this.configuration.rows_tablet, this.configuration.rows_desktop);
            var isHeroEnabled = this.configuration.hero.position !== '';
            var heroSize = isHeroEnabled ? heroWidth * heroHeight : 0;
            if (heroSize >= 1 && maxRowsSet < heroHeight) {
                heroSize = heroWidth;
            }
            this.configuration.limit = (maxRowsSet * this.getMaxPossibleColumns()) - heroSize;
        },
        /**
         * This returns number that is visible in the input of custom rows limit.
         * If value is less than 5 it wil return one of hardcoded scenarios (1-4 rows)
         * @param  layoutOption {string} - rows_mobile / rows_tablet / rows_desktop
         * @return {number} rows limit for custom input
         */
        getRowsSetup: function (layoutOption) {
            return this.configuration[layoutOption] > 5 ? this.configuration[layoutOption] : 5;
        },
    },
    ready: function () {
        var _this = this;
        this.productCollectionsSorters = this.productCollectionsSorters !== '' ? JSON.parse(this.productCollectionsSorters) : [];
        this.productCollectionsFilters = this.productCollectionsFilters !== '' ? JSON.parse(this.productCollectionsFilters) : [];
        if (!this.configuration.class_overrides) {
            this.configuration.class_overrides = {
                dataProvider: '',
            };
        }
        this.setProductsLimit();
        // Show loader
        $('body').trigger('showLoadingPopup');
        // Get categories JSON with AJAX
        this.$http.get(this.categoriesDataUrl).then(function (response) {
            _this.categoryPicker = new categoryPicker($('#cfg-pg-category'), JSON.parse(response.body), {
                multiple: false,
            });
            // Hide loader
            $('body').trigger('hideLoadingPopup');
            $('.tmp-select').remove();
        });
        this.imageUploadListener();
        this.widgetSetListener();
    },
};

/**
 * Static block configurator component.
 * This component is responsible for displaying static block's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
var staticBlockConfigurator = {
    mixins: [
        componentConfigurator,
    ],
    template: '#cc-static-block-template',
    props: {
        configuration: {
            type: Object,
            default: function () {
                return {
                    identifier: '',
                    title: '',
                    resetstyles: false,
                };
            },
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save': function () {
            var selectedOption = this.$els.cmsBlocksSelect.options[this.$els.cmsBlocksSelect.selectedIndex];
            if (this.configuration.identifier === selectedOption.value && this.configuration.identifier !== '') {
                this.configuration.title = selectedOption.text;
                this.onSave();
            }
        },
    },
};

/* tslint:disable:no-console */
// Use Vue resource
Vue.use(vr);
// Set Vue's $http headers Accept to text/html
Vue.http.headers.custom.Accept = 'text/html';
// Picker modal options
var pickerModalOptions = {
    type: 'slide',
    responsive: true,
    innerScroll: true,
    autoOpen: true,
    title: $t('Please select type of component'),
    buttons: [
        {
            text: $.mage.__('Cancel'),
            class: '',
            click: function () {
                this.closeModal();
            },
        },
    ],
};
var $pickerModal;
var configuratorModalOptions = {
    type: 'slide',
    responsive: true,
    innerScroll: true,
    autoOpen: true,
    title: $t('Configure your component'),
    buttons: [
        {
            text: $.mage.__('Cancel'),
            class: '',
            click: function () {
                this.closeModal();
            },
        },
        {
            text: $.mage.__('Save'),
            class: 'action-primary',
        },
    ],
};
var $configuratorModal;
/**
 * M2C Content Constructor component.
 * This is the final layer that is responsible for collecting and tying up all
 * of the M2C admin panel logic.
 */
var contentConstructor = {
    template: "<div class=\"content-constructor\">\n        <layout-builder\n            v-ref:layout-builder\n            :assets-src=\"assetsSrc\"\n            :cc-config=\"ccConfig\"\n            :image-endpoint=\"imageEndpoint\"\n            :cc-project-configuration=\"ccProjectConfiguration\"\n            :page-type=\"pageType\"\n            :add-component=\"getComponentPicker\"\n            :edit-component=\"editComponent\"\n            :components-configuration=\"configuration\">\n        </layout-builder>\n        <div class=\"content-constructor__modal content-constructor__modal--picker\" v-el:picker-modal></div>\n        <div class=\"content-constructor__modal content-constructor__modal--configurator\" v-el:configurator-modal></div>\n    </div>",
    components: {
        // Essentials
        'layout-builder': layoutBuilder,
        'component-picker': componentPicker,
        // CC components
        'button-configurator': buttonConfigurator,
        'category-links-configurator': categoryLinksConfigurator,
        'custom-html-configurator': customHtmlConfigurator,
        'cms-pages-teaser-configurator': cmsPagesTeaserConfigurator,
        'daily-deal-teaser-configurator': dailyDealTeaserConfigurator,
        'headline-configurator': headlineConfigurator,
        'hero-carousel-configurator': heroCarouselConfigurator,
        'image-teaser-configurator': imageTeaserConfigurator,
        'magento-product-grid-teasers-configurator': magentoProductGridTeasersConfigurator,
        'paragraph-configurator': paragraphConfigurator,
        'product-carousel-configurator': productCarouselConfigurator,
        'product-finder-configurator': ccProductFinderConfigurator,
        'products-grid-configurator': productsGridConfigurator,
        'static-block-configurator': staticBlockConfigurator,
    },
    props: {
        configuration: {
            type: String,
            default: '',
        },
        adminPrefix: {
            type: String,
            default: 'admin',
        },
        assetsSrc: {
            type: String,
            default: '',
        },
        configuratorEndpoint: {
            type: String,
            default: '',
        },
        uploaderUrl: {
            type: String,
            default: '',
        },
        restTokenEndpoint: {
            type: String,
            default: '',
        },
        imageEndpoint: {
            type: String,
            default: '',
        },
        categoryDataProviderEndpoint: {
            type: String,
            default: '',
        },
        pageType: {
            type: String,
            default: 'cms_page_form.cms_page_form',
        },
        productsPerPage: {
            type: String,
            default: '30',
        },
        ccProjectConfig: {
            type: String,
            default: '',
        },
        sorters: {
            type: [String, Array],
            default: '',
        },
        filters: {
            type: [String, Array],
            default: '',
        },
    },
    data: function () {
        return {
            ccConfig: this.getCCconfig(),
            initialComponentConfiguration: undefined,
            restToken: undefined,
        };
    },
    ready: function () {
        this.dumpConfiguration();
        this._isPickerLoaded = false;
        this._cleanupConfiguratorModal = '';
        this._configuratorSaveCallback = function () { return undefined; };
        this.setRestToken();
        // Initialize M2 loader for m2c modals
        $('body').loadingPopup({
            timeout: false,
        }).trigger('hideLoadingPopup');
    },
    events: {
        /**
         * We update provided input with new components information each time leyout
         * builder updates.
         */
        'layout-builder__update': function () {
            this.dumpConfiguration();
        },
        'component-configurator__saved': function (data) {
            if (!data.hasOwnProperty('isError') || (data.hasOwnProperty('isError') && !data.isError)) {
                this._configuratorSavedCallback(data);
                if ($configuratorModal && $configuratorModal.closeModal) {
                    $configuratorModal.closeModal();
                }
                if ($pickerModal && $pickerModal.closeModal) {
                    $pickerModal.closeModal();
                }
            }
            else {
                alert({
                    title: $t('Hey,'),
                    content: $.mage.__('Something is wrong with configuration of your component. Please fix all errors before saving.'),
                });
            }
        },
        'layout-builder__cmsblock-delete-request': function (cmsBlockId) {
            this.deleteStaticBlock(cmsBlockId);
        },
    },
    methods: {
        getCCconfig: function () {
            var ccConfig = this.ccProjectConfig ? JSON.parse(this.ccProjectConfig) : {};
            return !$.isEmptyObject(ccConfig) ? ccConfig.vars.MageSuite_ContentConstructor : ccConfig;
        },
        /**
         * Callback that will be invoked when user clicks plus button.
         * This method should open magento modal with component picker.
         * @param  {IComponentInformation} addComponentInformation Callback that let's us add component asynchronously.
         */
        getComponentPicker: function (addComponentInformation) {
            var component = this;
            // Save adding callback for async use.
            this._addComponentInformation = addComponentInformation;
            pickerModalOptions.opened = function () {
                if (!component._isPickerLoaded) {
                    // Show ajax loader
                    $('body').trigger('showLoadingPopup');
                    // Get picker via AJAX
                    component.$http.get(component.configuratorEndpoint + "picker").then(function (response) {
                        component.$els.pickerModal.innerHTML = response.body;
                        component.$compile(component.$els.pickerModal);
                        component._isPickerLoaded = true;
                        // Hide loader
                        $('body').trigger('hideLoadingPopup');
                    });
                }
            };
            // Create or Show picker modal depending if exists
            if ($pickerModal) {
                $pickerModal.openModal();
            }
            else {
                $pickerModal = modal(pickerModalOptions, $(this.$els.pickerModal));
            }
        },
        /**
         * Callback that will be invoked when user choses component in picker.
         * This method should open magento modal with component configurator.
         * @param {componentType} String - type of component chosen
         */
        getComponentConfigurator: function (componentType) {
            var _this = this;
            var newComponentId = 'component' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            var section = this.ccConfig.sections.defaults[this.pageType] ? this.ccConfig.sections.defaults[this.pageType] : this.ccConfig.sections[this.pageType][0];
            this._configuratorSavedCallback = function (componentData) {
                _this._addComponentInformation({
                    type: componentType,
                    id: newComponentId,
                    section: section,
                    data: componentData,
                });
            };
            if (componentType === 'brand-carousel' || componentType === 'separator') {
                this.$emit('component-configurator__saved', {
                    componentVisibility: {
                        mobile: true,
                        desktop: true,
                    },
                });
            }
            else {
                this.initConfiguratorModal({
                    type: componentType,
                    id: newComponentId,
                    section: section,
                    data: undefined,
                });
            }
        },
        /**
         * Callback that will be invoked when user clicks edit button.
         * This method should open magento modal with component editor.
         * @param  {IComponentInformation} setComponentInformation Callback that let's us add component asynchronously.
         */
        editComponent: function (prevComponentData, setComponentInformation) {
            this._configuratorSavedCallback = function (componentData) {
                setComponentInformation({
                    type: prevComponentData.type,
                    id: prevComponentData.id,
                    section: prevComponentData.section,
                    data: componentData,
                });
            };
            this.initConfiguratorModal(prevComponentData);
        },
        initConfiguratorModal: function (componentInformation) {
            var component = this;
            var cleanupConfiguratorModal = function () { return undefined; };
            configuratorModalOptions.buttons[1].click = function () {
                component.$broadcast('component-configurator__save');
            };
            configuratorModalOptions.title = $t('Configure your component') + "<span class=\"m2c-content-constructor__modal-subheadline\">" + this.transformComponentTypeToText(componentInformation.type) + "</span>";
            // Configurator modal opened callback
            configuratorModalOptions.opened = function () {
                // Show ajax loader
                $('body').trigger('showLoadingPopup');
                // Get twig component
                component.$http.get(component.configuratorEndpoint + componentInformation.type).then(function (response) {
                    component.$els.configuratorModal.innerHTML = response.body;
                    // Set current component configuration data
                    component.initialComponentConfiguration = componentInformation.data;
                    // compile fetched component
                    cleanupConfiguratorModal = component.$compile(component.$els.configuratorModal);
                    // Hide loader
                    $('body').trigger('hideLoadingPopup');
                });
            };
            configuratorModalOptions.closed = function () {
                // Cleanup configurator component and then remove modal
                cleanupConfiguratorModal();
                component.$els.configuratorModal.innerHTML = '';
                $configuratorModal.modal[0].parentNode.removeChild($configuratorModal.modal[0]);
                component.initialComponentConfiguration = undefined;
            };
            // Create & Show $configuratorModal
            $configuratorModal = modal(configuratorModalOptions, $(this.$els.configuratorModal));
        },
        dumpConfiguration: function () {
            uiRegistry.get(this.pageType).source.set('data.components', JSON.stringify(this.$refs.layoutBuilder.getComponentInformation()));
        },
        setRestToken: function () {
            var component = this;
            // send request for token
            this.$http.get(this.restTokenEndpoint).then(function (response) {
                component.restToken = "Bearer " + response.body;
            });
        },
        deleteStaticBlock: function (cmsBlockId) {
            var component = this;
            // Send request to REST API
            this.$http({
                headers: {
                    Accept: 'application/json',
                    Authorization: component.restToken,
                },
                method: 'delete',
                url: window.location.origin + "/rest/V1/cmsBlock/" + cmsBlockId,
            }).then(function (response) {
                if (response.body !== 'true') {
                    console.warn("Something went wrong, CMS block wasn't removed, please check if block with ID: " + cmsBlockId + " exists in database");
                }
            });
        },
        transformComponentTypeToText: function (componentType) {
            var txt = componentType.replace('-', ' ');
            return txt.charAt(0).toUpperCase() + txt.slice(1);
        },
    },
};

return contentConstructor;

})));
//# sourceMappingURL=content-constructor.js.map
