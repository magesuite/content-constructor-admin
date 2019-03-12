import $ from 'jquery';

import teaserPreview from '../../_teaser/preview/teaser';

/**
 * Image teaser preview component.
 * This component is responsible for displaying preview of image teaser component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const imageTeaserPreview: vuejs.ComponentOption = {
    components: {
        'teaser-preview': teaserPreview,
    },
    template: `<div data-role="spinner" class="cc-component-placeholder__loading" v-show="isLoading">
        <div class="spinner">
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
    </div>
    <div class="cc-image-teaser-preview" v-show="!isLoading">
        <div class="cc-image-teaser-preview__wrapper">
            <ul class="cc-image-teaser-preview__scene cc-image-teaser-preview__scene--{{ configuration.scenario.desktopLayout.id }}-in-row" v-el:scene>
                <template v-for="item in configuration.items">
                    <li class="cc-image-teaser-preview__item">
                        <teaser-preview :configuration="configuration.items[$index]" :parent-configuration="configuration"></teaser-preview>
                    </li>
                </template>
            </ul>
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
                $images
                    .load(function(): void {
                        imagesCount--;
                        if (!imagesCount) {
                            _this.isLoading = false;
                            $images.each(function(): void {
                                $(this).addClass(
                                    'cc-image-teaser-preview__item-image--border'
                                );
                            });
                        }
                    })
                    .filter(function(): boolean {
                        return this.complete;
                    })
                    .load();
            } else {
                _this.isLoading = false;
            }
        },
        hideEmptySlideContents(): any {
            $(this.$els.scene)
                .find('.cc-image-teaser-preview__item-content')
                .each(function(): void {
                    if (!$(this).children().length) {
                        $(this).hide();
                    }
                });
        },
    },
};

export default imageTeaserPreview;
