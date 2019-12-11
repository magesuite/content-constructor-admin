import $ from 'jquery';
import $t from 'mage/translate';
import alert from 'Magento_Ui/js/modal/alert';
import confirm from 'Magento_Ui/js/modal/confirm';

import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';
import componentAdder from '../../../utils/component-adder/component-adder';

import componentConfigurator from '../../_component-configurator/component-configurator';

import {
    default as teaserConfigurator,
    teaserPrototype as teaserItemPrototype,
} from '../../_teaser/configurator/teaser';

/**
 * Hero carousel configurator component.
 * This component is responsible for displaying image teaser's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const heroCarouselConfigurator: vuejs.ComponentOption = {
    mixins: [componentConfigurator],
    /**
     * Get dependencies
     */
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
        'teaser-configurator': teaserConfigurator
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
                
                <teaser-configurator 
                    :class="cc-teaser-configurator--image-teaser"
                    :teaser-index="$index" 
                    :configuration="items[$index]" 
                    :parent-configuration="configuration" 
                    :uploader-base-url="uploaderBaseUrl" 
                    :image-endpoint="imageEndpoint" 
                    :admin-prefix="adminPrefix" 
                    :cc-config="ccConfig" 
                    :caller-component-type="hero-carousel"  
                ></teaser-configurator>

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
                    items: [JSON.parse(JSON.stringify(teaserItemPrototype))],
                    ignoredItems: [],
                    scenario: {
                        teaserWidth: {},
                        desktopLayout: {},
                        contentPlacement: {},
                        mobileLayout: {},
                    }
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
                    list: {
                        name: 'Large teaser',
                        iconId: 'ml_col',
                    },
                    slider: {
                        name: 'Slider',
                        iconId: 'ml_slider',
                    }
                },
            },
        };
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            this.onSave();
        },
    },
    methods: {
        setOption(optionCategory: string, optionId: string): void {
            this.configuration[optionCategory] = this.scenarioOptions[
                optionCategory
            ][optionId];
            this.configuration[optionCategory].id = optionId;
        },

        /**
         * Creates new hero item and adds it to a specified index.
         * @param {number} index New component's index in components array.
         */
        createNewHeroItem(index: number): void {
            this.configuration.items.splice(
                index,
                0,
                JSON.parse(JSON.stringify(teaserItemPrototype))
            );
            this.onChange();
        },
        /**
         * If there are some legacy teasers saved, maps their configuration to
         * Image Teaser 2.0 interface and updates hero configuration
         */
        mapLegacyConfiguration(): void {
            if (this.configuration.items[0].headline) {
                this.configuration.items.forEach((item: any, index: any) => {
                    let newItem: any = JSON.parse(JSON.stringify(teaserItemPrototype));
                    newItem.image = {
                        raw: item.image,
                        decoded: item.decodedImage,
                        aspect_ratio: item.aspectRatio,
                        image: item.image
                    };
                    newItem.slogan = item.headline;
                    newItem.description = item.subheadline + item.paragraph;
                    newItem.cta = {
                        label: item.ctaLabel,
                        href: item.href
                    };
                    newItem.content_align = {
                        x: 1,
                        y: 2
                    }
                    newItem.optimizers.color_scheme = item.colorScheme;
                    this.$set(`configuration.items[${index}]`, newItem);
                });
                this.configuration.scenario = {
                    contentPlacement: {
                        id: 'over'
                    },
                    teaserWidth: {
                        id: 'window-slider'
                    },
                    mobileLayout: {
                        id: 'mobile-slider'
                    },
                    desktopLayout: {
                        id: '1'
                    }
                };
            }
        }
    },
    ready(): void {
        if (!this.configuration.mobileDisplayVariant.id) {
            $('.cc-hero-carousel-configurator__option:first-child').click();
        }
    },
    created(): void {
        this.mapLegacyConfiguration();
    }
};

export default heroCarouselConfigurator;
