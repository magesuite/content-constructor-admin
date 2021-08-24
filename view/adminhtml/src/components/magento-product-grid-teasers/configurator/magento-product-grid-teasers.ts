import $ from 'jquery';
import $t from 'mage/translate';

import {
    default as teaserConfigurator,
    teaserPrototype as teaserItemPrototype,
} from '../../_teaser/configurator/teaser';

import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';
import componentAdder from '../../../utils/component-adder/component-adder';

import componentConfigurator from '../../_component-configurator/component-configurator';

/**
 * Magento product-grid teasers configurator component.
 * This component will be responsible for configuration of image teasers inside native products grid on M2 category pages
 * @type {vuejs.ComponentOption} Vue component object.
 */
const magentoProductGridTeasersConfigurator: vuejs.ComponentOption = {
    mixins: [componentConfigurator],
    template: `<div class="cc-magento-product-grid-teasers-configurator | {{ class }}">
        <component-adder class="cc-component-adder cc-component-adder--static" v-show="!configuration.teasers.length">
            <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-magento-product-grid-teasers-configurator__item-action-button" @click="createNewTeaser( 0 )">
                <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                    <use xlink:href="#icon_plus"></use>
                </svg>
            </button>
        </component-adder>

        <template v-for="item in configuration.teasers">
            <div class="cc-magento-product-grid-teasers-configurator__item" id="cc-magento-pg-teaser-{{ $index }}">
                <component-adder class="cc-component-adder cc-component-adder--first">
                    <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-magento-product-grid-teasers-configurator__item-action-button" @click="createNewTeaser( $index )">
                        <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                            <use xlink:href="#icon_plus"></use>
                        </svg>
                    </button>
                </component-adder>

                <teaser-configurator :teaser-index="$index" :configuration="item[$index]" :parent-configuration="configuration" :uploader-base-url="uploaderBaseUrl" :image-endpoint="imageEndpoint" :admin-prefix="adminPrefix" :cc-config="ccConfig" :caller-component-type="'magento-product-grid-teasers'" :products-per-page="productsPerPage"></teaser-configurator>

                <component-adder class="cc-component-adder cc-component-adder--last">
                    <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-magento-product-grid-teasers-configurator__item-action-button" @click="createNewTeaser( $index + 1 )">
                        <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                            <use xlink:href="#icon_plus"></use>
                        </svg>
                    </button>
                </component-adder>
            </div>
        </template>

        <div class="cc-magento-product-grid-teasers-configurator__modal" v-el:error-modal></div>
    </div>`,
    /**
     * Get dependencies
     */
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
        'teaser-configurator': teaserConfigurator,
    },
    props: {
        /*
         * Single's component configuration
         */
        configuration: {
            type: Object,
            default(): any {
                return {
                    teasers: [JSON.parse(JSON.stringify(teaserItemPrototype))],
                    json: [],
                };
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
        /* Set prop with component name in order to
         * pass it to `component-configurator` methods
        */
        componentCcEntry: {
            type: String,
            default: 'image_teaser',
        },
    },
    data(): any {
        return {
            configuration: this.getInitialConfiguration(),
        };
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            // this.cleanupConfiguration();
            this._collectTeasersCssClasses();
            this._collectComponentCssClasses();
            this.generateTeasersConfig();
            this.onSave();
        },
    },
    methods: {
        getInitialConfiguration(): any {
            if (!this.configuration) {
                this.configuration = {
                    teasers: [JSON.parse(JSON.stringify(teaserItemPrototype))],
                }
            }

            Object.values(this.configuration.teasers).filter(
                (teaser: any, index: number) => {
                    return (teaser.decodedImage ? this.updateTeaser(teaser, index) : teaser);
                }
            );

            if(this.configuration.scenario == null) {
                this.$set('configuration.scenario.contentPlacement.id', 'over');
            }

            return this.configuration;
        },
        /**
         * Runs this function if teaser is using old image teaser
         * in order to update the values in admin panel
         */
        updateTeaser(teaser: object, index: number): void {
            const oldTeaser: object = Object.assign({}, teaser);
            this.configuration.teasers.splice(index, 1);
            this.createNewTeaser(index);

            Object.entries(oldTeaser).map(
                (oldConfig: any) => {
                    if(oldConfig[0] === 'colorScheme') {
                        this.configuration.teasers[index].optimizers.color_scheme = oldConfig[1];
                    }

                    if(oldConfig[0] === 'image') {
                        this.configuration.teasers[index].image.raw = oldConfig[1];
                    }

                    if(oldConfig[0] === 'decodedImage') {
                        this.configuration.teasers[index].image.decoded = oldConfig[1];
                    }

                    if(oldConfig[0] === 'ctaLabel') {
                        this.configuration.teasers[index].cta.label = oldConfig[1];
                    }

                    if(oldConfig[0] === 'href') {
                        this.configuration.teasers[index].cta.href = oldConfig[1];
                    }

                    if(oldConfig[0] === 'headline') {
                        this.configuration.teasers[index].slogan = oldConfig[1];
                    }

                    if(oldConfig[0] === 'subheadline') {
                        this.configuration.teasers[index].description = oldConfig[1];
                    }

                    if(oldConfig[0] === 'paragraph') {
                        this.configuration.teasers[index].description += "<br>" + oldConfig[1];
                    }

                    if(oldConfig[0] === 'displayVariant') {
                        switch(oldConfig[1]) {
                            case ('variant-1'):
                                this.configuration.teasers[index].content_align.x = 1;
                                this.configuration.teasers[index].content_align.y = 2;
                                break;
                            case ('variant-2'):
                                this.configuration.teasers[index].content_align.x = 1;
                                this.configuration.teasers[index].content_align.y = 3;
                                break;
                            case ('variant-3'):
                                this.configuration.teasers[index].content_align.x = 2;
                                this.configuration.teasers[index].content_align.y = 2;
                                break;
                            case ('variant-3'):
                                this.configuration.teasers[index].content_align.x = 2;
                                this.configuration.teasers[index].content_align.y = 3;
                                break;
                            default:
                                this.configuration.teasers[index].content_align.x = 1;
                                this.configuration.teasers[index].content_align.y = 1;
                                break;
                        }
                    }

                    if(oldConfig[0] === 'position') {
                        this.configuration.teasers[index].position = oldConfig[1];
                    }

                    if(oldConfig[0] === 'row') {
                        this.configuration.teasers[index].row = oldConfig[1];
                    }

                    if(oldConfig[0] === 'size') {
                        this.configuration.teasers[index].size = oldConfig[1];
                    }

                    if(oldConfig[0] === 'sizeSelect') {
                        this.configuration.teasers[index].sizeSelect = oldConfig[1];
                    }

                    if(oldConfig[0] === 'isAvailableForMobile') {
                        this.configuration.teasers[index].isAvailableForMobile = oldConfig[1];
                    }
                }
            );
        },
        /**
         * Creates new hero item and adds it to a specified index.
         * @param {number} index New component's index in components array.
         */
        createNewTeaser(index: number): void {
            this.configuration.teasers.splice(
                index,
                0,
                JSON.parse(JSON.stringify(teaserItemPrototype))
            );
            this.onChange();
        },
        /* Cleans configuration for M2C content constructor after Saving component
         * All empty teasers have to be removed to not get into configuration object
         */
        cleanupConfiguration(): void {
            const filteredArray: any = this.configuration.teasers.filter(
                (teaser: any): any => teaser.image !== ''
            );
            this.configuration.teasers = filteredArray;
            this.onChange();
        },

        _collectTeasersCssClasses(): void {
            if (this.configuration.teasers != null) {
                const cssClassFields: Array<any> = this._getCustomCssFields(this.ccConfig.teaser.tabs);

                this.configuration.teasers.forEach(
                    (teaser: any, index: number) => {
                        const cssClasses: Array<string> = [];

                        cssClassFields.forEach(
                            (model: string) => {
                                if (teaser[model] && typeof teaser[model] === 'string') {
                                    cssClasses.push(teaser[model]);
                                }
                            }
                        );

                        teaser.cc_css_classes = cssClasses.join(' ');
                    }
                );
            }
        },

        /* Generates 1:1 JSON for grid-layout component so it can be simply passed without any modifications within templates
         */
        generateTeasersConfig(): void {
            this.configuration.json = [];

            for (
                let i: number = 0;
                i < this.configuration.teasers.length;
                i++
            ) {
                const teaser: any = {
                    id: i + 1,
                    mobile: Number(
                        this.configuration.teasers[i].isAvailableForMobile
                    ),
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
};

export default magentoProductGridTeasersConfigurator;
