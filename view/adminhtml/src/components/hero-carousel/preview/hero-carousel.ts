import $ from 'jquery';

import teaserPreview from '../../_teaser/preview/teaser';

/**
 * Image teaser preview component.
 * This component is responsible for displaying preview of image teaser component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const heroCarouselPreview: vuejs.ComponentOption = {
    components: {
        'teaser-preview': teaserPreview,
    },
    template: `<div data-role="spinner" class="cc-component-placeholder__loading" v-show="isLoading">
        <div class="spinner">
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
    </div>
    <div v-if="configuration.items[0].headline" style="padding-bottom: 1rem">This component has been updated, please configure it.</div>
    <div class="cc-hero-carousel-preview" v-show="!isLoading">
        <div v-bind:class="sceneClass" v-el:scene>
            <div class="cc-hero-carousel-preview__slide" v-if="configuration.items.length > 1">
                <teaser-preview :configuration="configuration.items[configuration.items.length - 1]" :parent-configuration="configuration"></teaser-preview>
            </div>

            <template v-for="(index, item) in configuration.items">
                <div class="cc-hero-carousel-preview__slide" v-if="index < 2">
                    <teaser-preview :configuration="configuration.items[$index]" :parent-configuration="configuration"></teaser-preview>
                </div>
            </template>
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
        isLoading: {
            type: Boolean,
            default: true,
        },
    },
    ready(): void {
        this.setImagesLoadListener();
        this.hideEmptySlideContents();
    },
    computed: {
        sceneClass(): string {
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
        setImagesLoadListener(): void {
            const _this: any = this;
            const $images = $(this.$els.scene).find('img');
            let imagesCount: number = $images.length;

            if (imagesCount) {
                $images.on('load',
                    function(): void {
                        imagesCount--;
                        if (!imagesCount) {
                            _this.isLoading = false;
                            $images.each(function(): void {
                                $(this).addClass(
                                    'cc-hero-carousel-preview__item-image--border'
                                );
                            });
                        }
                    })
                    .filter(function(): boolean {
                        return this.complete;
                    });
            } else {
                _this.isLoading = false;
            }
        },
        hideEmptySlideContents(): any {
            $(this.$els.scene).find('.cc-hero-carousel-preview__slide-content-info').each(function(): void {
                if (!$(this).children().length) {
                    $(this).hide();
                }
            });
        },
    },
};

export default heroCarouselPreview;
