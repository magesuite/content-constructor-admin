import $ from 'jquery';
import $t from 'mage/translate';
import alert from 'Magento_Ui/js/modal/alert';
import confirm from 'Magento_Ui/js/modal/confirm';

import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';
import componentAdder from '../../../utils/component-adder/component-adder';

import componentConfigurator from '../../_component-configurator/component-configurator';

const teaserItemPrototype: any = {
    image: '',
    decodedImage: '',
    displayVariant: '1',
    colorScheme: 'light',
    headline: '',
    subheadline: '',
    paragraph: '',
    ctaLabel: $t( 'More' ),
    href: '',
    sizeInfo: '',
    aspectRatio: '',
};

/**
 * Image teaser configurator component.
 * This component is responsible for displaying image teaser's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const imageTeaserConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
    },
    template: `<div class="cc-image-teaser-configurator {{ classes }} | {{ mix }}" {{ attributes }}>
        <section class="cc-image-teaser-configurator__section">
            <h3 class="cc-image-teaser-configurator__subtitle">Teaser Width</h3>
            <div class="cc-image-teaser-configurator__scenario-options">
                <div
                    :class="{
                        'cc-image-teaser-configurator__option--selected': configuration.currentScenario.teaserWidth.id == optionId,
                        'cc-image-teaser-configurator__option--disabled': option.disabled,
                    }"
                    class="cc-image-teaser-configurator__option"
                    v-for="(optionId, option) in scenarioOptions.teaserWidth"
                    @click="!option.disabled && toggleOption('teaserWidth', optionId)">
                    <div class="cc-image-teaser-configurator__option-wrapper">
                        <svg class="cc-image-teaser-configurator__option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                    <p class="cc-image-teaser-configurator__option-name">
                        {{ option.name }}
                    </p>
                </div>
            </div>

        </section>
        <section class="cc-image-teaser-configurator__section">
            <h3 class="cc-image-teaser-configurator__subtitle">Desktop Layout</h3>
            <div class="cc-image-teaser-configurator__scenario-options">
                <div
                    :class="{
                        'cc-image-teaser-configurator__option--selected': configuration.currentScenario.desktopLayout.id == optionId,
                        'cc-image-teaser-configurator__option--disabled': option.disabled,
                    }"
                    class="cc-image-teaser-configurator__option"
                    v-for="(optionId, option) in scenarioOptions.desktopLayout"
                    @click="!option.disabled && toggleOption('desktopLayout', optionId)">
                    <div class="cc-image-teaser-configurator__option-wrapper">
                        <svg class="cc-image-teaser-configurator__option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                    <p class="cc-image-teaser-configurator__option-name">
                        {{ option.name }}
                    </p>
                </div>
            </div>
        </section>
        <section class="cc-image-teaser-configurator__section">
            <h3 class="cc-image-teaser-configurator__subtitle">Text Positioning</h3>
            <div class="cc-image-teaser-configurator__scenario-options">
                <div
                    :class="{
                        'cc-image-teaser-configurator__option--selected': configuration.currentScenario.textPositioning.id == optionId,
                        'cc-image-teaser-configurator__option--disabled': option.disabled,
                    }"
                    class="cc-image-teaser-configurator__option"
                    v-for="(optionId, option) in scenarioOptions.textPositioning"
                    @click="!option.disabled && toggleOption('textPositioning', optionId)">
                    <div class="cc-image-teaser-configurator__option-wrapper">
                        <svg class="cc-image-teaser-configurator__option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                    <p class="cc-image-teaser-configurator__option-name">
                        {{ option.name }}
                    </p>
                </div>
            </div>
        </section>
        <section class="cc-image-teaser-configurator__section">
            <h3 class="cc-image-teaser-configurator__subtitle">Mobile Layout</h3>
            <div class="cc-image-teaser-configurator__scenario-options">
                <div
                    :class="{
                        'cc-image-teaser-configurator__option--selected': configuration.currentScenario.mobileLayout.id == optionId,
                        'cc-image-teaser-configurator__option--disabled': option.disabled,
                    }"
                    class="cc-image-teaser-configurator__option"
                    v-for="(optionId, option) in scenarioOptions.mobileLayout"
                    @click="!option.disabled && toggleOption('mobileLayout', optionId)">
                    <div class="cc-image-teaser-configurator__option-wrapper">
                        <svg class="cc-image-teaser-configurator__option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                    <p class="cc-image-teaser-configurator__option-name">
                        {{ option.name }}
                    </p>
                </div>
            </div>
        </section>

        <section class="cc-image-teaser-configurator__section">
            <component-adder class="cc-component-adder cc-component-adder--static" v-show="!configuration.items.length">
                <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-image-teaser-configurator__item-action-button" @click="createTeaserItem( 0 )">
                    <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                        <use v-bind="{ 'xlink:href': '#icon_plus' }"></use>
                    </svg>
                </button>
            </component-adder>

            <template v-for="item in configuration.items">
                <div class="cc-image-teaser-configurator__item" id="cc-image-teaser-item-{{ $index }}">
                    <component-adder class="cc-component-adder cc-component-adder--first" v-if="canAddTeaser()">
                        <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-image-teaser-configurator__item-action-button" @click="createTeaserItem( $index )">
                            <svg class="cc-action-button__icon cc-action-button__icon--size_300">
                                <use xlink:href="#icon_plus"></use>
                            </svg>
                        </button>
                    </component-adder>

                    <div class="cc-image-teaser-configurator__item-content">
                        <div v-bind:class="[ 'cc-image-teaser-configurator__item-col-left', configuration.items[$index].image ? 'cc-image-teaser-configurator__item-col-left--look-image-uploaded' : '' ]">
                            <div class="cc-image-teaser-configurator__item-image-wrapper">
                                <img :src="configuration.items[$index].image" class="cc-image-teaser-configurator__item-image" v-show="configuration.items[$index].image">
                                <input type="hidden" v-model="configuration.items[$index].image">
                                <input type="hidden" class="cc-image-teaser-configurator__image-url" id="image-teaser-img-{{$index}}">
                                <svg class="cc-image-teaser-configurator__item-image-placeholder" v-show="!configuration.items[$index].image">
                                    <use xlink:href="#icon_image-placeholder"></use>
                                </svg>

                                <div class="cc-image-teaser-configurator__item-actions">
                                    <component-actions>
                                        <template slot="cc-component-actions__buttons">
                                            <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--up | cc-image-teaser-configurator__item-action-button" @click="moveImageTeaserUp( $index )" :class="[ isFirstImageTeaser( $index ) ? 'cc-action-button--look_disabled' : '' ]" :disabled="isFirstImageTeaser( $index )">
                                                <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                                    <use xlink:href="#icon_arrow-up"></use>
                                                </svg>
                                            </button>
                                            <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--down | cc-image-teaser-configurator__item-action-button" @click="moveImageTeaserDown( $index )" :class="[ isLastImageTeaser( $index ) ? 'cc-action-button--look_disabled' : '' ]" :disabled="isLastImageTeaser( $index )">
                                                <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                                    <use xlink:href="#icon_arrow-down"></use>
                                                </svg>
                                            </button>
                                            <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon | cc-component-actions__button cc-component-actions__button--upload-image | cc-image-teaser-configurator__item-action-button" @click="getImageUploader( $index )">
                                                    <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                                        <use xlink:href="#icon_upload-image"></use>
                                                    </svg>
                                                    {{ configuration.items[$index].image ? imageUploadedText : noImageUploadedText }}
                                            </button>
                                            <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--delete | cc-image-teaser-configurator__item-action-button" @click="deleteTeaserItem( $index )">
                                                <svg class="cc-action-button__icon">
                                                    <use xlink:href="#icon_trash-can"></use>
                                                </svg>
                                            </button>
                                        </template>
                                    </component-actions>
                                </div>

                            </div>
                        </div>
                        <div class="cc-image-teaser-configurator__item-col-right">
                            <div class="cc-input cc-input--group">
                                <div class="cc-input | cc-image-teaser-configurator__item-form-element">
                                    <label for="cfg-it-item{{ $index }}-variant" class="cc-input__label">${$t( 'Display variant' )}:</label>
                                    <select name="cfg-it-item{{ $index }}-variant" class="cc-input__select" id="cfg-it-item{{ $index }}-variant" v-model="configuration.items[$index].displayVariant">
                                        <template v-for="(idx, scenario) in imageTeasersContentPositions">
                                            <option value="{{ idx + 1 }}">${$t( '{{ scenario }}' )}</option>
                                        </template>
                                    </select>
                                </div>
                                <div class="cc-input | cc-image-teaser-configurator__item-form-element">
                                    <label for="cfg-it-item{{ $index }}-color-scheme" class="cc-input__label">${$t( 'Text color scheme' )}:</label>
                                    <select name="cfg-it-item{{ $index }}-color-scheme" class="cc-input__select" id="cfg-it-item{{ $index }}-color-scheme" v-model="configuration.items[$index].colorScheme">
                                        <option value="light">${$t( 'Light' )}</option>
                                        <option value="dark">${$t( 'Dark' )}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="cc-input | cc-image-teaser-configurator__item-form-element">
                                <label for="cfg-hc-item{{ $index }}-headline" class="cc-input__label">${$t( 'Headline' )}:</label>
                                <input type="text" v-model="configuration.items[$index].headline" id="cfg-hc-item{{ $index }}-headline" class="cc-input__input">
                            </div>
                            <div class="cc-input | cc-image-teaser-configurator__item-form-element">
                                <label for="cfg-hc-item{{ $index }}-subheadline" class="cc-input__label">${$t( 'Subheadline' )}:</label>
                                <input type="text" v-model="configuration.items[$index].subheadline" id="cfg-hc-item{{ $index }}-subheadline" class="cc-input__input">
                            </div>
                            <div class="cc-input | cc-image-teaser-configurator__item-form-element">
                                <label for="cfg-hc-item{{ $index }}-paragraph" class="cc-input__label">${$t( 'Paragraph' )}:</label>
                                <textarea type="text" v-model="configuration.items[$index].paragraph" id="cfg-hc-item{{ $index }}-paragraph" class="cc-input__textarea"></textarea>
                            </div>
                            <div class="cc-input cc-input--group">
                                <div class="cc-input | cc-image-teaser-configurator__item-form-element">
                                    <label for="cfg-hc-item{{ $index }}-cta-label" class="cc-input__label">${$t( 'CTA label' )}:</label>
                                    <input type="text" v-model="configuration.items[$index].ctaLabel" id="cfg-hc-item{{ $index }}-cta-label" class="cc-input__input">
                                </div>
                                <div class="cc-input cc-input--type-addon | cc-image-teaser-configurator__item-form-element">
                                    <label for="image-teaser-ctatarget-output-{{ $index }}" class="cc-input__label">${$t( 'CTA target link' )}:</label>
                                    <input type="text" class="cc-input__input | cc-image-teaser-configurator__cta-target-link" v-model="configuration.items[$index].href" id="image-teaser-ctatarget-output-{{ $index }}">
                                    <span class="cc-input__addon | cc-image-teaser-configurator__widget-chooser-trigger" @click="openCtaTargetModal( $index )">
                                        <svg class="cc-input__addon-icon">
                                            <use xlink:href="#icon_link"></use>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <component-adder class="cc-component-adder cc-component-adder--last" v-if="configuration.items.length && canAddTeaser()">
                        <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-image-teaser-configurator__item-action-button" @click="createTeaserItem( $index + 1 )">
                            <svg class="cc-action-button__icon cc-action-button__icon--size_300">
                                <use xlink:href="#icon_plus"></use>
                            </svg>
                        </button>
                    </component-adder>
                </div>
            </template>
        </section>
    </div>`,
    data(): any {
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
            default(): Object {
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
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            this.onSave();
        },
    },
    created(): void {
        if (this.configuration.ignoredItems === undefined) {
            this.configuration.ignoredItems = [];
        }
    },
    methods: {
        _collectPossibleOptions(filteredScenarios: Array<Array<any>>): any {
            const teaserWidthIndex: number = 0;
            const desktopLayoutIndex: number = 1;
            const textPositionIndex: number = 2;
            const mobileLayoutsIndex: number = 3;
            let possibleOptions: any = {
                teaserWidth: {},
                desktopLayout: {},
                textPositioning: {},
                mobileLayout: {},
            };

            filteredScenarios.forEach((filteredScenario: Array<any>) => {
                possibleOptions.teaserWidth[filteredScenario[teaserWidthIndex]] = true;
                possibleOptions.desktopLayout[filteredScenario[desktopLayoutIndex]] = true;
                possibleOptions.textPositioning[filteredScenario[textPositionIndex]] = true;
                filteredScenario[mobileLayoutsIndex].forEach((mobileLayout: string) => {
                    possibleOptions.mobileLayout[mobileLayout] = true;
                } );
            } );

            Object.keys(possibleOptions).forEach((scenarioElement: string): void => {
                possibleOptions[scenarioElement] = Object.keys(possibleOptions[scenarioElement]);
            });

            return possibleOptions;
        },

        _findPossibleOptions(teaserWidth: string, desktopLayout: string, textPosition: string, mobileLayout: string): void {
            const teaserWidthIndex: number = 0;
            const desktopLayoutIndex: number = 1;
            const textPositionIndex: number = 2;
            const mobileLayoutsIndex: number = 3;
            // Make a copy of available scenarios to prevent reference copying.
            let filteredScenarios: Array<Array<string>> = JSON.parse(JSON.stringify(this.availableScenarios));

            if (teaserWidth) {
                filteredScenarios = filteredScenarios.filter((availableScenario: any) => {
                    return availableScenario[teaserWidthIndex] === teaserWidth;
                });
            }

            if (desktopLayout) {
                filteredScenarios = filteredScenarios.filter((availableScenario: any) => {
                    return availableScenario[desktopLayoutIndex] === desktopLayout;
                });
            }

            if (textPosition) {
                filteredScenarios = filteredScenarios.filter((availableScenario: any) => {
                    return !textPosition || availableScenario[textPositionIndex] === textPosition;
                });
            }

            if (mobileLayout) {
                filteredScenarios = filteredScenarios.filter((availableScenario: any) => {
                    return availableScenario[mobileLayoutsIndex].indexOf(mobileLayout) !== -1;
                });
                filteredScenarios = filteredScenarios.map((availableScenario: any) => {
                    availableScenario[mobileLayoutsIndex] = [mobileLayout];
                    return availableScenario;
                });
            }

            return this._collectPossibleOptions(filteredScenarios);
        },

        toggleOption(optionCategory: string, optionId: string): void {
            if (this.configuration.currentScenario[optionCategory].id) {
                this.configuration.currentScenario[optionCategory] = {};
            } else {
                this.configuration.currentScenario[optionCategory] = this.scenarioOptions[optionCategory][optionId];
                this.configuration.currentScenario[optionCategory].id = optionId;
            }

            this.togglePossibleOptions();
            this.adjustVisibleItems();
        },

        adjustVisibleItems(): void {
            const items: Array<TeaserItem> = this.configuration.items;
            const itemsNumber: number = this.configuration.currentScenario.desktopLayout.teasersNum;
            const itemsLimit: boolean = this.configuration.currentScenario.teaserWidth.teasersLimit;

            if (itemsLimit && items.length > itemsNumber) {
                const removedItems: Array<any> = items.splice(itemsNumber, items.length - itemsNumber);
                this.configuration.ignoredItems = removedItems.concat(this.configuration.ignoredItems);
            } else if (items.length < itemsNumber) {
                items.concat(this.configuration.ignoredItems.splice(0, itemsNumber - items.length));

                for (let addedItems: number = 0; addedItems < itemsNumber - items.length; addedItems++) {
                    items.push(JSON.parse(JSON.stringify(teaserItemPrototype)));
                }
            }
        },

        togglePossibleOptions(): void {
            const currentScenario: any = this.configuration.currentScenario;
            const possibleOptions: any = this._findPossibleOptions(
                currentScenario.teaserWidth.id,
                currentScenario.desktopLayout.id,
                currentScenario.textPositioning.id,
                currentScenario.mobileLayout.id,
            );

            Object.keys(this.scenarioOptions).forEach((optionCategory: string) => {
                Object.keys(this.scenarioOptions[optionCategory]).forEach((scenarioOptionId: string) => {
                    this.scenarioOptions[optionCategory][scenarioOptionId].disabled = possibleOptions[optionCategory].indexOf(scenarioOptionId) === -1;
                } );
            } );
        },

        canAddTeaser(): boolean {
            const items: Array<TeaserItem> = this.configuration.items;
            const itemsLimit: number = this.configuration.currentScenario.teaserWidth.teasersLimit;

            return (!itemsLimit || items.length < itemsLimit);
        },

        /* Opens M2's built-in image manager modal.
         * Manages all images: image upload from hdd, select image that was already uploaded to server.
         * @param index {number} - index of image of image teaser.
         */
        getImageUploader(index: number): void {
            MediabrowserUtility.openDialog(`${this.uploaderBaseUrl}target_element_id/image-teaser-img-${index}/`,
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
            $(document).on('change', '.cc-image-teaser-configurator__image-url', (event: Event): void => {
                if (!isAlreadyCalled) {
                    isAlreadyCalled = true;
                    component.onImageUploaded(event.target);
                    setTimeout((): void => {
                        isAlreadyCalled = false;
                    }, 100);
                }
            } );
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

        /* Creates another teaser item using teaserItemPrototype */
        createTeaserItem(index: number): void {
            this.configuration.items.splice(index, 0, JSON.parse(JSON.stringify(teaserItemPrototype)));
            this.onChange();
        },

        /**
         * Moves image teaser item under given index up by swaping it with previous element.
         * @param {number} index Image teaser's index in array.
         */
        moveImageTeaserUp(index: number): void {
            if (index > 0) {
                const $thisItem: any = $(`#cc-image-teaser-item-${ index }`);
                const $prevItem: any = $(`#cc-image-teaser-item-${ index - 1 }`);

                $thisItem.addClass('cc-image-teaser-configurator__item--animating').css('transform', `translateY(${ -Math.abs($prevItem.outerHeight(true)) }px)`);
                $prevItem.addClass('cc-image-teaser-configurator__item--animating').css('transform', `translateY(${ $thisItem.outerHeight(true) }px )`);

                setTimeout((): void => {
                    this.configuration.items.splice(index - 1, 0, this.configuration.items.splice(index, 1)[0]);
                    this.onChange();
                    $thisItem.removeClass('cc-image-teaser-configurator__item--animating').css('transform', '');
                    $prevItem.removeClass('cc-image-teaser-configurator__item--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Moves image teaser item under given index down by swaping it with next element.
         * @param {number} index Image teaser's index in array.
         */
        moveImageTeaserDown(index: number): void {
            if (index < this.configuration.items.length - 1) {
                const $thisItem: any = $(`#cc-image-teaser-item-${ index }`);
                const $nextItem: any = $(`#cc-image-teaser-item-${ index + 1 }`);

                $thisItem.addClass('cc-image-teaser-configurator__item--animating').css('transform', `translateY(${ $nextItem.outerHeight(true) }px)`);
                $nextItem.addClass('cc-image-teaser-configurator__item--animating' ).css('transform', `translateY(${ -Math.abs($thisItem.outerHeight(true)) }px)`);

                setTimeout((): void => {
                    this.configuration.items.splice(index + 1, 0, this.configuration.items.splice(index, 1)[0]);
                    this.onChange();
                    $thisItem.removeClass('cc-image-teaser-configurator__item--animating').css('transform', '');
                    $nextItem.removeClass('cc-image-teaser-configurator__item--animating').css('transform', '');
                }, 400);
            }
        },
        /**
         * Tells if item with given index is the first image teaser.
         * @param  {number}  index Index of the image teaser.
         * @return {boolean}       If image teaser is first in array.
         */
        isFirstImageTeaser(index: number): boolean {
            return index === 0;
        },
        /**
         * Tells if image teaser with given index is the last image teaser.
         * @param  {number}  index Index of the image teaser.
         * @return {boolean}       If image teaser is last in array.
         */
        isLastImageTeaser(index: number): boolean {
            return index === this.configuration.items.length - 1;
        },

        /* Opens modal with M2 built-in widget chooser
         * @param index {number} - index of teaser item to know where to place output of widget chooser
         */
        openCtaTargetModal(index: number): void {
            widgetTools.openDialog(`${window.location.origin}/${this.adminPrefix}/admin/widget/index/filter_widgets/Link/widget_target_id/image-teaser-ctatarget-output-${index}`);

            this.wWidgetListener(index);
        },
        /* Sets listener for widget chooser
         * It triggers component.onChange to update component's configuration
         * after value of item.ctaTarget is changed
         */
        widgetSetListener(): void {
            $('.cc-image-teaser-configurator__cta-target-link').on('change', (): void => {
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
                } );
            } else {
                window.setTimeout((): void => {
                    this.wWidgetListener(itemIndex);
                }, 300);
            }
        },

        /* Checks if it's possible to display Delete button
         * This function is used in component's template
         * Button can be displayed only on items that have item uploaded
         * @param index {number} - index of teaser item
         * @returns Boolean
         */
        isPossibleToDelete(index: number): Boolean {
            if ((index !== 0 || this.configuration.items.length > 1) && this.configuration.items[index].image !== '') {
                return true;
            }

            return false;
        },

        /* Removes teaser item after Delete button is clicked
         * and triggers component's onChange to update it's configuration
         * @param index {number} - index of teaser item to remove
         */
        deleteTeaserItem(index: number): void {
            const component: any = this;

            confirm({
                content: $t('Are you sure you want to delete this item?'),
                actions: {
                    confirm(): void {
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
        /* Cleans configuration for M2C content constructor after Saving component
         * All empty teaser items has to be removed to not get into configuration object
         */
        cleanupConfiguration(): void {
            this.configuration.items = this.configuration.items.filter((item: any): any => item.image !== '');
            this.configuration.ignoredItems = this.configuration.ignoredItems.filter((item: any): any => item.image !== '');
            this.onChange();
        },
    },
    ready(): void {
        this.imageUploadListener();
        this.widgetSetListener();
    },
};

export default imageTeaserConfigurator;
