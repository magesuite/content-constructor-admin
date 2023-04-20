import $ from 'jquery';

import teaserPreview from '../../_teaser/preview/teaser';

/**
 * Single component information interface.
 */
interface IComponentInformation {
    category_id: string;
    order_by: string;
    rows_desktop: number;
    rows_tablet: number;
    rows_mobile: number;
    item: any;
};

/**
 * Product carousel preview component.
 * This component is responsible for displaying preview of product carousel component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const productGridPreview: vuejs.ComponentOption = {
    components: {
        'teaser-preview': teaserPreview,
    },
    template: `<div data-role="spinner" class="cc-component-placeholder__loading" v-show="isLoading">
        <div class="spinner">
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
    </div>
    <div class="cc-products-grid-preview" v-show="!isLoading" v-el:scene>
        <template v-if="heroExists && !teaserExists">
            <div class="cc-products-grid-preview__hero" v-if="configuration.hero.position == 'left'">
                <img v-if="configuration.hero.image" :src="configuration.hero.image" class="cc-products-grid-preview__hero-image">
                <div class="cc-products-grid-preview__hero-placeholder-wrapper" v-show="!configuration.hero.image">
                    <svg class="cc-products-grid-preview__hero-placeholder">
                        <use xlink:href="#icon_image-placeholder"></use>
                    </svg>
                </div>
                <div class="cc-products-grid-preview__hero-content">
                    <h2 class="cc-products-grid-preview__headline" v-if="configuration.hero.headline">{{ configuration.hero.headline }}</h2>
                    <h3 class="cc-products-grid-preview__subheadline" v-if="configuration.hero.subheadline">{{ configuration.hero.subheadline }}</h3>
                    <p class="cc-products-grid-preview__paragraph" v-if="configuration.hero.paragraph">{{ configuration.hero.paragraph }}</p>
                    <template v-if="configuration.hero.href">
                        <button type="button" class="cc-products-grid-preview__button" v-if="configuration.hero.button.label">{{ configuration.hero.button.label }}</button>
                    </template>
                </div>
            </div>

            <ul v-bind:class="itemsGridClass">
                <template v-for="item in getItemsCount()">
                    <li class="cc-products-grid-preview__list-item">
                        <div class="cc-products-grid-preview__product-wrapper">
                            <svg class="cc-products-grid-preview__product">
                                <use xlink:href="#icon_component-cc-product-teaser-item"></use>
                            </svg>
                        </div>
                    </li>
                </template>
            </ul>

            <div class="cc-products-grid-preview__hero" v-if="configuration.hero.position == 'right'">
                <img v-if="configuration.hero.image" :src="configuration.hero.image" class="cc-products-grid-preview__hero-image">
                <div class="cc-products-grid-preview__hero-placeholder-wrapper" v-show="!configuration.hero.image">
                    <svg class="cc-products-grid-preview__hero-placeholder">
                        <use xlink:href="#icon_image-placeholder"></use>
                    </svg>
                </div>
                <div class="cc-products-grid-preview__hero-content">
                    <h2 class="cc-products-grid-preview__headline" v-if="configuration.hero.headline">{{ configuration.hero.headline }}</h2>
                    <h3 class="cc-products-grid-preview__subheadline" v-if="configuration.hero.subheadline">{{ configuration.hero.subheadline }}</h3>
                    <p class="cc-products-grid-preview__paragraph" v-if="configuration.hero.paragraph">{{ configuration.hero.paragraph }}</p>
                    <template v-if="configuration.hero.href">
                        <button type="button" class="cc-products-grid-preview__button" v-if="configuration.hero.button.label">{{ configuration.hero.button.label }}</button>
                    </template>
                </div>
            </div>
        </template>


        <template v-if="teaserExists && !heroExists">
            <teaser-preview :configuration="configuration.items[0]" :parent-configuration="configuration" v-if="configuration.items[0].position == 'left'"></teaser-preview>

            <ul v-bind:class="itemsGridClass">
                <template v-for="item in getItemsCount()">
                    <li class="cc-products-grid-preview__list-item">
                        <div class="cc-products-grid-preview__product-wrapper">
                            <svg class="cc-products-grid-preview__product">
                                <use xlink:href="#icon_component-cc-product-teaser-item"></use>
                            </svg>
                        </div>
                    </li>
                </template>
            </ul>

            <teaser-preview :configuration="configuration.items[0]" :parent-configuration="configuration" v-if="configuration.useTeaser && (configuration.items[0].position == 'right' || configuration.items[0].position == 'center')"></teaser-preview>


            <ul v-bind:class="itemsGridClass" v-if="configuration.items[0].position == 'center'">
                <template v-for="item in getItemsCount()">
                    <li class="cc-products-grid-preview__list-item">
                        <div class="cc-products-grid-preview__product-wrapper">
                            <svg class="cc-products-grid-preview__product">
                                <use xlink:href="#icon_component-cc-product-teaser-item"></use>
                            </svg>
                        </div>
                    </li>
                </template>
            </ul>
        </template>

        <template v-if="!teaserExists && !heroExists">
            <ul v-bind:class="itemsGridClass">
                <template v-for="item in getItemsCount()">
                    <li class="cc-products-grid-preview__list-item">
                        <div class="cc-products-grid-preview__product-wrapper">
                            <svg class="cc-products-grid-preview__product">
                                <use xlink:href="#icon_component-cc-product-teaser-item"></use>
                            </svg>
                        </div>
                    </li>
                </template>
            </ul>
        </template>
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
        isLoading: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        itemsGridClass(): string {
            if (this.teaserExists) {
                return `cc-products-grid-preview__list cc-products-grid-preview__list--${ this.configuration.items[0].position }`;
            }

            if (this.heroExists) {
                return `cc-products-grid-preview__list cc-products-grid-preview__list--${ this.configuration.hero.position }`;
            }

            return 'cc-products-grid-preview__list';
        },
        heroExists(): Boolean {
            return (this.configuration.hero && this.configuration.hero.position) ? true : false;
        },
        teaserExists(): Boolean {
            return (this.configuration.useTeaser === 'true' && this.configuration.items[0].position) ? true : false;
        },
    },
    ready(): void {
        this.setImagesLoadListener();
        this.hideEmptySlideContents();
    },
    methods: {
        /**
         * Checks for status of images if they're loaded.
         * After they're all loaded spinner is hidden and content displayed.
         */
        setImagesLoadListener(): void {
            const _this: any = this;
            const $images = $(this.$els.scene).find('img');
            let imagesCount: number = $images.length;

            if (imagesCount) {
                $images.on('load', function(): void {
                    imagesCount--;
                    if (!imagesCount) {
                        _this.isLoading = false;
                    }
                }).filter(function(): boolean {
                    return this.complete;
                });
            } else {
                _this.isLoading = false;
            }
        },
        getItemsCount(): number {
            let itemsCountWithTeaser;

            if (this.heroExists) {
                itemsCountWithTeaser = 3;
            }

            if (this.teaserExists) {
                itemsCountWithTeaser = this.configuration.items[0].position === 'center' ? 2 : 3;
            }

            return (this.heroExists || this.teaserExists) ? itemsCountWithTeaser : 10;
        },
        hideEmptySlideContents(): any {
            $(this.$els.scene).find('.cc-products-grid-preview__hero-content').each(function(): void {
                if (!$(this).children().length) {
                    $(this).hide();
                }
            });
        },
    },
};

export default productGridPreview;
