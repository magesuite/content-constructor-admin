import $ from 'jquery';
import $t from 'mage/translate';
import alert from 'Magento_Ui/js/modal/alert';
import confirm from 'Magento_Ui/js/modal/confirm';

import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';
import componentAdder from '../../../utils/component-adder/component-adder';

import componentConfigurator from '../../_component-configurator/component-configurator';

// Pattern for teaser Item
const heroItemDataPattern: any = {
    image: '',
    decodedImage: '',
    displayVariant: 'variant-1',
    colorScheme: 'light',
    headline: '',
    subheadline: '',
    paragraph: '',
    ctaLabel: $t( 'Check offer' ),
    href: '',
    sizeInfo: '',
    aspectRatio: '',
};

/**
 * Hero carousel configurator component.
 * This component is responsible for displaying image teaser's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const heroCarouselConfigurator: vuejs.ComponentOption = {
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
    template: `<div class="cc-hero-carousel-configurator | {{ class }}">
        <section class="cc-hero-carousel-configurator__section">
            <h3 class="cc-hero-carousel-configurator__subtitle">Mobile Devices Scenario</h3>
            <div class="cc-hero-carousel-configurator__scenario-options">
                <ul class="cc-hero-carousel-configurator__scenario-options-list">
                    <li
                        :class="{
                            'cc-hero-carousel-configurator__option--selected': configuration.mobileDisplayVariant.id == optionId,
                        }"
                        class="cc-hero-carousel-configurator__option"
                        v-for="(optionId, option) in scenarioOptions.mobileDisplayVariant"
                        @click="setOption('mobileDisplayVariant', optionId)">
                        <div class="cc-hero-carousel-configurator__option-wrapper">
                            <svg class="cc-hero-carousel-configurator__option-icon">
                                <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                            </svg>
                        </div>
                        <p class="cc-hero-carousel-configurator__option-name">
                            {{ option.name }}
                        </p>
                    </li>
                </ul>
            </div>
        </section>

        <h3 class="cc-hero-carousel-configurator__title">Content</h3>

        <component-adder class="cc-component-adder cc-component-adder--static" v-show="!configuration.items.length">
            <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-hero-carousel-configurator__item-action-button" @click="createNewHeroItem( 0 )">
                <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                    <use xlink:href="#icon_plus"></use>
                </svg>
            </button>
        </component-adder>

        <template v-for="item in configuration.items">
            <div class="cc-hero-carousel-configurator__item" id="cc-hero-carousel-item-{{ $index }}">
                <component-adder class="cc-component-adder cc-component-adder--first">
                    <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-hero-carousel-configurator__item-action-button" @click="createNewHeroItem( $index )">
                        <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                            <use xlink:href="#icon_plus"></use>
                        </svg>
                    </button>
                </component-adder>

                <div class="cc-hero-carousel-configurator__item-content">
                    <div v-bind:class="[ 'cc-hero-carousel-configurator__item-col-left', configuration.items[$index].image ? 'cc-hero-carousel-configurator__item-col-left--look-image-uploaded' : '' ]">
                        <div class="cc-hero-carousel-configurator__item-image-wrapper">
                            <img :src="configuration.items[$index].image" class="cc-hero-carousel-configurator__item-image" v-show="configuration.items[$index].image">
                            <input type="hidden" v-model="configuration.items[$index].image">
                            <input type="hidden" class="cc-hero-carousel-configurator__image-url" id="hero-img-{{$index}}">
                            <svg class="cc-hero-carousel-configurator__item-image-placeholder" v-show="!configuration.items[$index].image">
                                <use xlink:href="#icon_image-placeholder"></use>
                            </svg>

                            <div class="cc-hero-carousel-configurator__item-actions">
                                <component-actions>
                                    <template slot="cc-component-actions__buttons">
                                        <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--up | cc-hero-carousel-configurator__item-action-button" @click="moveHeroItemUp( $index )" :class="[ isFirstHeroItem( $index ) ? 'cc-action-button--look_disabled' : '' ]" :disabled="isFirstHeroItem( $index )">
                                            <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                                <use xlink:href="#icon_arrow-up"></use>
                                            </svg>
                                        </button>
                                        <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--down | cc-hero-carousel-configurator__item-action-button" @click="moveHeroItemDown( $index )" :class="[ isLastHeroItem( $index ) ? 'cc-action-button--look_disabled' : '' ]" :disabled="isLastHeroItem( $index )">
                                            <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                                <use xlink:href="#icon_arrow-down"></use>
                                            </svg>
                                        </button>
                                        <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon | cc-component-actions__button cc-component-actions__button--upload-image | cc-hero-carousel-configurator__item-action-button" @click="getImageUploader( $index )">
                                                <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                                    <use xlink:href="#icon_upload-image"></use>
                                                </svg>
                                                {{ configuration.items[$index].image ? imageUploadedText : noImageUploadedText }}
                                        </button>
                                        <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--delete | cc-hero-carousel-configurator__item-action-button" @click="deleteHeroItem( $index )">
                                            <svg class="cc-action-button__icon">
                                                <use xlink:href="#icon_trash-can"></use>
                                            </svg>
                                        </button>
                                    </template>
                                </component-actions>
                            </div>
                        </div>
                    </div>
                    <div class="cc-hero-carousel-configurator__item-col-right">
                        <div class="cc-input cc-input--group">
                            <div class="cc-input | cc-hero-carousel-configurator__item-form-element">
                                <label for="cfg-hc-item{{ $index }}-variant" class="cc-input__label">${$t( 'Display variant' )}:</label>
                                <select name="cfg-hc-item{{ $index }}-variant" class="cc-input__select | cc-hero-carousel-configurator__select" id="cfg-hc-item{{ $index }}-variant" v-model="configuration.items[$index].displayVariant"">
                                    <template v-for="(idx, scenario) in imageTeasersContentPositions">
                                        <option value="variant-{{ idx + 1 }}">${$t( '{{ scenario }}' )}</option>
                                    </template>
                                </select>
                            </div>
                            <div class="cc-input | cc-hero-carousel-configurator__item-form-element">
                                <label for="cfg-hc-item{{ $index }}-color-scheme" class="cc-input__label">${$t( 'Text color scheme' )}:</label>
                                <select name="cfg-hc-item{{ $index }}-color-scheme" class="cc-input__select | cc-hero-carousel-configurator__select" id="cfg-hc-item{{ $index }}-color-scheme" v-model="configuration.items[$index].colorScheme">
                                    <option value="light">${$t( 'Light' )}</option>
                                    <option value="dark">${$t( 'Dark' )}</option>
                                </select>
                            </div>
                        </div>
                        <div class="cc-input | cc-hero-carousel-configurator__item-form-element">
                            <label for="cfg-hc-item{{ $index }}-headline" class="cc-input__label">${$t( 'Headline' )}:</label>
                            <input type="text" v-model="configuration.items[$index].headline" id="cfg-hc-item{{ $index }}-headline" class="cc-input__input">
                        </div>
                        <div class="cc-input | cc-hero-carousel-configurator__item-form-element">
                            <label for="cfg-hc-item{{ $index }}-subheadline" class="cc-input__label">${$t( 'Subheadline' )}:</label>
                            <input type="text" v-model="configuration.items[$index].subheadline" id="cfg-hc-item{{ $index }}-subheadline" class="cc-input__input">
                        </div>
                        <div class="cc-input | cc-hero-carousel-configurator__item-form-element">
                            <label for="cfg-hc-item{{ $index }}-paragraph" class="cc-input__label">${$t( 'Paragraph' )}:</label>
                            <textarea type="text" v-model="configuration.items[$index].paragraph" id="cfg-hc-item{{ $index }}-paragraph" class="cc-input__textarea"></textarea>
                        </div>
                        <div class="cc-input cc-input--group">
                            <div class="cc-input | cc-hero-carousel-configurator__item-form-element">
                                <label for="cfg-hc-item{{ $index }}-cta-label" class="cc-input__label">${$t( 'CTA label' )}:</label>
                                <input type="text" v-model="configuration.items[$index].ctaLabel" id="cfg-hc-item{{ $index }}-cta-label" class="cc-input__input">
                            </div>
                            <div class="cc-input cc-input--type-addon | cc-hero-carousel-configurator__item-form-element">
                                <label for="hero-ctatarget-output-{{ $index }}" class="cc-input__label">${$t( 'CTA target link' )}:</label>
                                <input type="text" class="cc-input__input | cc-hero-carousel-configurator__cta-target-link" v-model="configuration.items[$index].href" id="hero-ctatarget-output-{{ $index }}">
                                <span class="cc-input__addon | cc-hero-carousel-configurator__widget-chooser-trigger" @click="openCtaTargetModal( $index )">
                                    <svg class="cc-input__addon-icon">
                                        <use xlink:href="#icon_link"></use>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <component-adder class="cc-component-adder cc-component-adder--last">
                    <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-hero-carousel-configurator__item-action-button" @click="createNewHeroItem( $index + 1 )">
                        <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                            <use xlink:href="#icon_plus"></use>
                        </svg>
                    </button>
                </component-adder>
            </div>
        </template>

        <div class="cc-hero-carousel-configurator__modal" v-el:error-modal></div>
    </div>`,
    props: {
        /*
         * Single's component configuration
         */
        configuration: {
            type: Object,
            default(): any {
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
            default(): any {
                return {};
            },
        },
    },
    computed: {
        imageTeasersContentPositions: function(): object {
            const data: object = this.ccConfig.image_teasers_content_positions;
            return Object.keys(data).map(key => (<any>data)[key]);
        },
    },
    data(): any {
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
        'component-configurator__save'(): void {
            //this.cleanupConfiguration();
            this.onSave();
        },
    },
    methods: {
        setOption(optionCategory: string, optionId: string): void {
            this.configuration[optionCategory] = this.scenarioOptions[optionCategory][optionId];
            this.configuration[optionCategory].id = optionId;
        },
        /* Opens M2's built-in image manager modal
         * Manages all images: image upload from hdd, select image that was already uploaded to server
         * @param index {number} - index of image of hero item
         */
        getImageUploader(index: number): void {
            MediabrowserUtility.openDialog(`${this.uploaderBaseUrl}target_element_id/hero-img-${index}/`,
                'auto',
                'auto',
                $t('Insert File...'),
                {
                    closed: true,
                },
            );
        },

        /* Listener for image uploader
         * Since Magento does not provide any callback after image has been chosen
         * we have to watch for target where decoded url is placed
         */
        imageUploadListener(): void {
            const component: any = this;
            let isAlreadyCalled: boolean = false;

            // jQuery has to be used, for some reason native addEventListener doesn't catch change of input's value
            $(document).on('change', '.cc-hero-carousel-configurator__image-url', (event: Event): void => {
                if (!isAlreadyCalled) {
                    isAlreadyCalled = true;
                    component.onImageUploaded(event.target);
                    setTimeout((): void => {
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
        onImageUploaded(input: any): void {
            const _this: any = this;
            const itemIndex: any = input.id.substr(input.id.lastIndexOf('-') + 1);
            const encodedImage: any = input.value.match('___directive\/([a-zA-Z0-9]*)')[1];
            const imgEndpoint: string = this.imageEndpoint.replace('{/encoded_image}', encodedImage);

            this.configuration.items[itemIndex].decodedImage = Base64 ? Base64.decode(encodedImage) : window.atob(encodedImage);

            const img: any = new Image();
            img.onload = function(): void {
                const ar: string = _this.getAspectRatio(img.naturalWidth, img.naturalHeight);
                _this.configuration.items[itemIndex].image = img.getAttribute('src');
                _this.configuration.items[itemIndex].sizeInfo = `${img.naturalWidth}x${img.naturalHeight}px (${ar})`;
                _this.configuration.items[itemIndex].aspectRatio = ar;
                setTimeout((): void => {
                    _this.checkImageSizes();
                    _this.onChange();
                }, 400);
            };
            img.src = imgEndpoint;
        },
        /* Opens modal with M2 built-in widget chooser
         * @param index {number} - index of teaser item to know where to place output of widget chooser
         */
        openCtaTargetModal(index: number): void {
            widgetTools.openDialog(`${window.location.origin}/${this.adminPrefix}/admin/widget/index/filter_widgets/Link/widget_target_id/hero-ctatarget-output-${index}`);
            this.wWidgetListener(index);
        },
        /* Sets listener for widget chooser
         * It triggers component.onChange to update component's configuration
         * after value of item.href is changed
         */
        widgetSetListener(): void {
            $('.cc-hero-carousel-configurator__cta-target-link').on('change', (): void => {
                this.onChange();
            });
        },
        /*
         * Check if widget chooser is loaded. If not, wait for it, if yes:
         * Override default onClick for "Insert Widget" button in widget's modal window
         * to clear input's value before inserting new one
         * @param {number} index Hero item's index in array.
         */
        wWidgetListener(itemIndex: number): void {
            if (typeof wWidget !== 'undefined' && widgetTools.dialogWindow[0].innerHTML !== '') {
                const button: any = widgetTools.dialogWindow[0].querySelector('#insert_button');

                button.onclick = null;
                button.addEventListener('click', (): void => {
                    this.configuration.items[itemIndex].href = '';
                    wWidget.insertWidget();
                });
            } else {
                window.setTimeout((): void => {
                    this.wWidgetListener(itemIndex);
                }, 300);
            }
        },
        /**
         * Creates new hero item and adds it to a specified index.
         * @param {number} index New component's index in components array.
         */
        createNewHeroItem(index: number): void {
            this.configuration.items.splice(index, 0, JSON.parse(JSON.stringify(heroItemDataPattern)));
            this.onChange();
        },
        /**
         * Moves hero item under given index up by swaping it with previous element.
         * @param {number} index Hero item's index in array.
         */
        moveHeroItemUp(index: number): void {
            if (index > 0) {
                const $thisItem: any = $(`#m2c-hero-carousel-item-${ index }`);
                const $prevItem: any = $(`#m2c-hero-carousel-item-${ index - 1 }`);

                $thisItem.addClass('cc-hero-carousel-configurator__item--animating').css('transform', `translateY( ${ -Math.abs($prevItem.outerHeight(true)) }px)`);
                $prevItem.addClass( 'cc-hero-carousel-configurator__item--animating' ).css( 'transform', `translateY(${ $thisItem.outerHeight(true) }px)`);

                setTimeout((): void => {
                    this.configuration.items.splice(index - 1, 0, this.configuration.items.splice(index, 1)[0]);
                    this.onChange();
                    $thisItem.removeClass('cc-hero-carousel-configurator__item--animating').css('transform', '');
                    $prevItem.removeClass('cc-hero-carousel-configurator__item--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Moves hero item under given index down by swaping it with next element.
         * @param {number} index Hero item's index in array.
         */
        moveHeroItemDown(index: number): void {
            if (index < this.configuration.items.length - 1) {
                const $thisItem: any = $(`#cc-hero-carousel-item-${ index }`);
                const $nextItem: any = $(`#cc-hero-carousel-item-${ index + 1 }`);

                $thisItem.addClass('cc-hero-carousel-configurator__item--animating').css('transform', `translateY(${ $nextItem.outerHeight(true) }px)`);
                $nextItem.addClass('cc-hero-carousel-configurator__item--animating').css('transform', `translateY(${ -Math.abs($thisItem.outerHeight(true)) }px)`);

                setTimeout((): void => {
                    this.configuration.items.splice(index + 1, 0, this.configuration.items.splice(index, 1)[0]);
                    this.onChange();
                    $thisItem.removeClass('cc-hero-carousel-configurator__item--animating').css('transform', '');
                    $nextItem.removeClass('cc-hero-carousel-configurator__item--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Tells if item with given index is the first hero item.
         * @param  {number}  index Index of the hero item.
         * @return {boolean}       If hero item is first in array.
         */
        isFirstHeroItem(index: number): boolean {
            return index === 0;
        },
        /**
         * Tells if hero item with given index is the last hero item.
         * @param  {number}  index Index of the hero item.
         * @return {boolean}       If hero item is last in array.
         */
        isLastHeroItem(index: number): boolean {
            return index === this.configuration.items.length - 1;
        },
        /* Removes hero item after Delete button is clicked
         * and triggers hero item's onChange to update it's configuration
         * @param index {number} - index of hero item to remove
         */
        deleteHeroItem(index: number): void {
            const component: any = this;

            confirm({
                content: $t('Are you sure you want to delete this item?'),
                actions: {
                    confirm(): void {
                        component.configuration.items.splice(index, 1);
                        component.onChange();
                    },
                },
            });
        },
        /* Cleans configuration for M2C content constructor after Saving component
         * All empty hero items has to be removed to not get into configuration object
         */
        cleanupConfiguration(): void {
            const filteredArray: any = this.configuration.items.filter((item: any): any => item.image !== '');
            this.configuration.items = filteredArray;
            this.onChange();
        },
        /* Checks if images are all the same size
         * If not - displays error by firing up this.displayImageSizeMismatchError()
         * @param images {array} - array of all uploaded images
         */
        checkImageSizes(): boolean {
            const itemsToCheck = JSON.parse(JSON.stringify(this.configuration.items)).filter((item: any): boolean => {
                return Boolean(item.aspectRatio); // Filter out items without aspect ratio set yet.
            });

            for (let i: number = 0; i < itemsToCheck.length; i++) {
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
        getGreatestCommonDivisor(a: number, b: number): number {
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
        getAspectRatio(a: number, b: number): string {
            let c: number = this.getGreatestCommonDivisor(a, b);

            return `${(a / c)}:${(b / c)}`;
        },
    },
    ready(): void {
        this.imageUploadListener();
        this.widgetSetListener();

        if (!this.configuration.mobileDisplayVariant.id) {
            $('.cc-hero-carousel-configurator__option:first-child').click();
        }
    },
};

export default heroCarouselConfigurator;
