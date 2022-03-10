import $ from 'jquery';
import $t from 'mage/translate';

import categoryPicker from '../../../utils/category-picker/category-picker';
import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';

import componentConfigurator from '../../_component-configurator/component-configurator';

import {
    default as teaserConfigurator,
    teaserPrototype as teaserItemPrototype,
} from '../../_teaser/configurator/teaser';

/**
 * Product grid configurator component.
 * This component is responsible for displaying products grid  configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const productsGridConfigurator: vuejs.ComponentOption = {
    mixins: [componentConfigurator],
    components: {
        'action-button': actionButton,
        'component-actions': componentActions,
        'teaser-configurator': teaserConfigurator,
    },
    template: `<div class="cc-products-grid-configurator {{ classes }} | {{ mix }}" {{ attributes }}>
        <section class="cc-products-grid-configurator__section" v-if="ccConfig.products_grid != null && ccConfig.products_grid.custom_sections != null" v-for="section in ccConfig.products_grid.custom_sections">
            <h3 class="cc-products-grid-configurator__subtitle" v-if="section.label">{{section.label | translate}}</h3>
            <div class="cc-hero-carousel-configurator__custom-sections">
                <div class="cc-custom-fields">
                    <div class="cc-custom-fields__form-group" v-for="field in section.content.fields">
                        <component
                            :is="'custom-element-' + field.type"
                            :configuration="configuration"
                            :field-configuration="field"
                        ></component>
                    </div>
                </div>
            </div>
        </section>

        <section class="cc-products-grid-configurator__section">
            <h3 class="cc-products-grid-configurator__subtitle">${$t(
                'Data source'
            )}:</h3>
            <div class="cc-products-grid-configurator__scenario-options cc-products-grid-configurator__scenario-options--inputs">
                <div class="cc-input cc-input--type-inline | cc-products-grid-configurator__section-option">
                    <label for="cfg-pg-category" class="cc-input__label | cc-products-grid-configurator__section-option-label">${$t(
                        'Category ID'
                    )}:</label>
                    <select class="cc-input__select tmp-select" style="width:25em">
                        <option>${$t('Select...')}</option>
                    </select>
                    <input type="hidden" name="cfg-pg-category-select" class="cc-input__input | cc-products-grid-configurator__form-input" id="cfg-pg-category" v-model="configuration.category_id" @change="onChange">
                </div>
                <div class="cc-input cc-input--type-inline | cc-products-grid-configurator__section-option">
                    <label for="cfg-pg-filter" class="cc-input__label | cc-products-grid-configurator__section-option-label">${$t(
                        'Filter'
                    )}:</label>
                    <select name="cfg-pg-filter" class="cc-input__select" id="cfg-pg-filter" v-model="configuration.filter" @change="onChange">
                        <option value="">${$t('No filter')}</option>
                        <template v-for="filter in productCollectionsFilters">
                            <option value="{{ filter.value }}" :selected="filter.value === configuration.filter">{{ filter.label }}</option>
                        </template>
                    </select>
                </div>
                <div class="cc-input | cc-products-grid-configurator__section-option">
                    <label for="cfg-pg-skus" class="cc-input__label">${$t(
                        'SKUs'
                    )}:</label>
                    <input type="text" name="cfg-pg-skus" class="cc-input__input" id="cfg-pg-skus" v-model="configuration.skus" @change="onChange">
                    <div class="cc-input__hint">${$t(
                        'Multiple, comma-separated'
                    )}</div>
                </div>
                <div class="cc-input cc-input--type-inline | cc-products-grid-configurator__section-option">
                    <label for="cfg-pg-order-by" class="cc-input__label | cc-products-grid-configurator__section-option-label">${$t(
                        'Order by'
                    )}:</label>
                    <select name="cfg-pg-order-by" class="cc-input__select" id="cfg-pg-order-by" v-model="configuration.order_by" @change="onChange">
                        <option value="">${$t('Not specified')}</option>
                        <template v-for="sorter in productCollectionsSorters">
                            <option value="{{ sorter.value }}" :selected="sorter.value === configuration.order_by">{{ sorter.label }}</option>
                        </template>
                    </select>
                    <select name="cfg-pg-order-type" class="cc-input__select" v-model="configuration.order_type" @change="onChange">
                        <option value="ASC">${$t('Ascending')}</option>
                        <option value="DESC">${$t('Descending')}</option>
                    </select>
                </div>
                <div class="cc-input | cc-products-grid-configurator__section-option">
                    <label for="cfg-pg-dataprovider" class="cc-input__label">${$t(
                        'Custom Data Provider'
                    )}:</label>
                    <input type="text" name="cfg-pg-dataprovider" class="cc-input__input" id="cfg-pg-dataprovider" v-model="configuration.class_overrides.dataProvider" @change="onChange">
                </div>
                <div class="cc-input__hint cc-input__hint--info-mark" v-if="configuration.skus.length">
                    ${$t(
                        'Providing list of comma separated SKUs will disable any filtering and sorting configured for that component.  Category (if specified) will also not be taken into account. Only products with specified SKUs will be displayed in exactly the same order as they are provided in SKUs field.'
                    )}
                </div>
            </div>
        </section>

        <section class="cc-products-grid-configurator__section">
            <h3 class="cc-products-grid-configurator__subtitle">${$t(
                'Mobile Layout'
            )}:</h3>
            <div class="cc-products-grid-configurator__scenario-options">
                <ul class="cc-products-grid-configurator__scenario-options-list">
                    <li
                        :class="{
                            'cc-products-grid-configurator__option--selected': isOptionSelected('rows_mobile', optionId),
                        }"
                        class="cc-products-grid-configurator__option"
                        v-for="(optionId, option) in scenarioOptions.rows_mobile"
                        @click="setOption('rows_mobile', optionId)">
                        <div class="cc-products-grid-configurator__option-wrapper">
                            <svg class="cc-products-grid-configurator__option-icon">
                                <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                            </svg>
                        </div>
                        <p class="cc-products-grid-configurator__option-name">
                            <input v-if="optionId === '1000'" type="text" name="cfg-ml-custom" class="cc-input__input cc-input__input--type-tiny" id="cfg-ml-custom" maxlength="3" v-model="tmpConfiguration.rows_mobile" @change="setOption('rows_mobile', tmpConfiguration.rows_mobile)">
                            {{ option.name }}
                        </p>
                    </li>
                </ul>
            </div>
        </section>

        <section class="cc-products-grid-configurator__section">
            <h3 class="cc-products-grid-configurator__subtitle">${$t(
                'Tablet Layout'
            )}:</h3>
            <div class="cc-products-grid-configurator__scenario-options">
                <ul class="cc-products-grid-configurator__scenario-options-list">
                    <li
                        :class="{
                            'cc-products-grid-configurator__option--selected': isOptionSelected('rows_tablet', optionId),
                        }"
                        class="cc-products-grid-configurator__option"
                        v-for="(optionId, option) in scenarioOptions.rows_tablet"
                        @click="setOption('rows_tablet', optionId)">
                        <div class="cc-products-grid-configurator__option-wrapper">
                            <svg class="cc-products-grid-configurator__option-icon">
                                <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                            </svg>
                        </div>
                        <p class="cc-products-grid-configurator__option-name">
                            <input v-if="optionId === '1000'" type="text" name="cfg-tl-custom" class="cc-input__input cc-input__input--type-tiny" id="cfg-tl-custom" maxlength="3" v-model="tmpConfiguration.rows_tablet" @change="setOption('rows_tablet', tmpConfiguration.rows_tablet)">
                            {{ option.name }}
                        </p>
                    </li>
                </ul>
            </div>
        </section>

        <section class="cc-products-grid-configurator__section">
            <h3 class="cc-products-grid-configurator__subtitle">${$t(
                'Desktop Layout'
            )}:</h3>
            <div class="cc-products-grid-configurator__scenario-options">
                <ul class="cc-products-grid-configurator__scenario-options-list">
                    <li
                        :class="{
                            'cc-products-grid-configurator__option--selected': isOptionSelected('rows_desktop', optionId),
                        }"
                        class="cc-products-grid-configurator__option"
                        v-for="(optionId, option) in scenarioOptions.rows_desktop"
                        @click="setOption('rows_desktop', optionId)">
                        <div class="cc-products-grid-configurator__option-wrapper">
                            <svg class="cc-products-grid-configurator__option-icon">
                                <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                            </svg>
                        </div>
                        <p class="cc-products-grid-configurator__option-name">
                            <input v-if="optionId === '1000'" type="text" name="cfg-dl-custom" class="cc-input__input cc-input__input--type-tiny" id="cfg-dl-custom" maxlength="3" v-model="tmpConfiguration.rows_desktop" @change="setOption('rows_desktop', tmpConfiguration.rows_desktop)">
                            {{ option.name }}
                        </p>
                    </li>
                </ul>
            </div>
        </section>

        <section class="cc-products-grid-configurator__section">
            <h3 class="cc-products-grid-configurator__subtitle">${$t(
                'Image Teaser'
            )}:</h3>
            <div class="cc-products-grid-configurator__scenario-options">
                <ul class="cc-products-grid-configurator__scenario-options-list">
                    <li
                        :class="{
                            'cc-products-grid-configurator__option--selected': configuration.useTeaser == optionId,
                        }"
                        class="cc-products-grid-configurator__option"
                        v-for="(optionId, option) in scenarioOptions.useTeaser"
                        @click="setOption('useTeaser', optionId)">
                        <div class="cc-products-grid-configurator__option-wrapper">
                            <svg class="cc-products-grid-configurator__option-icon">
                                <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                            </svg>
                        </div>
                        <p class="cc-products-grid-configurator__option-name">
                            {{ option.name }}
                        </p>
                    </li>
                </ul>
            </div>
        </section>

        <teaser-configurator :configuration="configuration.items" :parent-configuration="configuration" :uploader-base-url="uploaderBaseUrl" :image-endpoint="imageEndpoint" :admin-prefix="adminPrefix" :cc-config="ccConfig" :caller-component-type="'products-grid'" :products-per-page="productsPerPage" v-show="configuration.useTeaser" :video-teaser-placeholder-error="invalidVideoPlaceholderTeaserIndexes.indexOf(0) != -1"></teaser-configurator>

    </div>`,
    props: {
        configuration: {
            type: Object,
            default(): Object {
                return {
                    customCssClass: '',
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
                    useTeaser: '',
                    scenario: {
                        contentPlacement: {
                            id: 'over',
                        }
                    },
                    items: [JSON.parse(JSON.stringify(teaserItemPrototype))],
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
        productCollectionsSorters: {
            type: [String, Array],
            default: '',
        },
        productCollectionsFilters: {
            type: [String, Array],
            default: '',
        },
        /* Set prop with component name in order to
         * pass it to `component-configurator` methods
        */
        xmlConfigEntry: {
            type: String,
            default: 'products_grid',
        },
    },
    data(): Object {
        return {
            invalidVideoPlaceholderTeaserIndexes: [],
            configuration: this.getInitialConfiguration(),
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
                useTeaser: {
                    '': {
                        name: $t('No image teaser'),
                        iconId: 'no_teaser',
                    },
                    true: {
                        name: $t('With image teaser'),
                        iconId: 'teaser_left',
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
            if (this.configuration.class_overrides && this.configuration.class_overrides.dataProvider === '') {
                delete this.configuration.class_overrides;
            }

            this.configuration.isError = false;
            this._validateVideoPlaceholders();
            this.setProductsLimit();
            this._collectTeasersCssClasses();
            this.onSave();
        },
    },
    methods: {
        getInitialConfiguration(): any {
            if (this.configuration.hero) {
                this.$set('configuration.scenario.contentPlacement.id', 'over');
                this.$set('configuration.useTeaser', 'true');
                this.$set('configuration.items', [JSON.parse(JSON.stringify(teaserItemPrototype))]);

                Object.entries(this.configuration.hero).map(
                    (oldConfig: any) => {
                        if(oldConfig[0] === 'colorScheme') {
                            this.configuration.items[0].optimizers.color_scheme = oldConfig[1];
                        }

                        if(oldConfig[0] === 'image') {
                            this.configuration.items[0].image.raw = oldConfig[1];
                        }

                        if(oldConfig[0] === 'decoded_image') {
                            this.configuration.items[0].image.decoded = oldConfig[1];
                        }

                        if(oldConfig[0] === 'button') {
                            this.configuration.items[0].cta.label = oldConfig[1].label;
                        }

                        if(oldConfig[0] === 'href') {
                            this.configuration.items[0].cta.href = oldConfig[1];
                        }

                        if(oldConfig[0] === 'headline') {
                            this.configuration.items[0].slogan = oldConfig[1];
                        }

                        if(oldConfig[0] === 'subheadline') {
                            this.configuration.items[0].description = oldConfig[1];
                        }

                        if(oldConfig[0] === 'paragraph') {
                            this.configuration.items[0].description += "<br>" + oldConfig[1];
                        }

                        if(oldConfig[0] === 'displayVariant') {
                            switch(oldConfig[1]) {
                                case ('1'):
                                    this.configuration.items[0].content_align.x = 1;
                                    this.configuration.items[0].content_align.y = 2;
                                    break;
                                case ('2'):
                                    this.configuration.items[0].content_align.x = 1;
                                    this.configuration.items[0].content_align.y = 3;
                                    break;
                                case ('3'):
                                    this.configuration.items[0].content_align.x = 2;
                                    this.configuration.items[0].content_align.y = 2;
                                    break;
                                case ('4'):
                                    this.configuration.items[0].content_align.x = 2;
                                    this.configuration.items[0].content_align.y = 3;
                                    break;
                                default:
                                    this.configuration.items[0].content_align.x = 1;
                                    this.configuration.items[0].content_align.y = 1;
                                    break;
                            }
                        }

                        if(oldConfig[0] === 'position') {
                            this.configuration.items[0].position = oldConfig[1];
                        }
                    }
                );

                delete(this.configuration.hero);
            }

            return this.configuration;
        },
        setOption(
            optionCategory: string,
            optionId: string,
            key?: string
        ): void {
            if (key) {
                this.configuration[optionCategory][key] = optionId;
            } else {
                this.configuration[optionCategory] =
                    optionId === '1000'
                        ? this.tmpConfiguration[optionCategory]
                        : optionId;
            }

            this.setProductsLimit();
        },
        /**
         * Checks if given option is currently selected
         * @param  optionCategory {string} - section of the option
         * @param  optionId {string} - value of the option
         * @return {boolean}
         */
        isOptionSelected(optionCategory: string, optionId: string): boolean {
            return (
                this.configuration[optionCategory] == optionId ||
                (optionId === '1000' && this.configuration[optionCategory] > 4)
            );
        },

        /**
         * This method is searching through ccConfig configuration
         * to find the highest value for columns across whole project
         * @return {number} the highest possible columns per row value
         */
        getMaxPossibleColumns(): number {
            const maxColumns: object = this.ccConfig.columns['one-column'];
            return Math.max.apply(
                Math,
                Object.keys(maxColumns).map(key => (<any>maxColumns)[key])
            );
        },

        /**
         * Calculate how many products should be returned by BE,
         * then saves result to component's configuration
         */
        setProductsLimit(): void {
            const teaserWidth: number = parseInt(
                this.configuration.items[0].size.x,
                10
            );

            const teaserHeight: number = parseInt(
                this.configuration.items[0].size.y,
                10
            );

            const maxRowsSet: number = Math.max(
                this.configuration.rows_mobile,
                this.configuration.rows_tablet,
                this.configuration.rows_desktop
            );

            const isTeaserEnabled: boolean =
                this.configuration.useTeaser !== '';

            let teaserSize: number = isTeaserEnabled ? teaserWidth * teaserHeight : 0;

            if (teaserSize >= 1 && maxRowsSet < teaserHeight) {
                teaserSize = teaserWidth;
            }

            this.configuration.limit =
                maxRowsSet * this.getMaxPossibleColumns() - teaserSize;
        },


        /**
         * This returns number that is visible in the input of custom rows limit.
         * If value is less than 5 it wil return one of hardcoded scenarios (1-4 rows)
         * @param  layoutOption {string} - rows_mobile / rows_tablet / rows_desktop
         * @return {number} rows limit for custom input
         */
        getRowsSetup(layoutOption: string): number {
            return this.configuration[layoutOption] > 5
                ? this.configuration[layoutOption]
                : 5;
        },

        _collectTeasersCssClasses(): void {
            if (this.configuration.items != null) {
                const cssClassFields: Array<any> = this._getCustomCssFields(this.ccConfig.teaser.tabs);

                this.configuration.items.forEach(
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
        _validateVideoPlaceholders(): void {
            this.invalidVideoPlaceholderTeaserIndexes = [];
            this.configuration.items.forEach((teaser: any, index: number) => {
                if (
                    teaser.video &&
                    teaser.video.url.length &&
                    !teaser.image.raw
                ) {
                    this.invalidVideoPlaceholderTeaserIndexes.push(index);
                    this.configuration.isError = true;
                }
            });
        },
    },
    ready(): void {
        this.productCollectionsSorters =
            this.productCollectionsSorters !== ''
                ? JSON.parse(this.productCollectionsSorters)
                : [];
        this.productCollectionsFilters =
            this.productCollectionsFilters !== ''
                ? JSON.parse(this.productCollectionsFilters)
                : [];

        if (!this.configuration.class_overrides) {
            this.configuration.class_overrides = {
                dataProvider: '',
            };
        }

        this.setProductsLimit();

        // Show loader
        $('body').trigger('showLoadingPopup');

        // Get categories JSON with AJAX
        this.$http.get(this.categoriesDataUrl).then(
            (response: any): void => {
                this.categoryPicker = new categoryPicker(
                    $('#cfg-pg-category'),
                    JSON.parse(response.body),
                    {
                        multiple: false,
                    }
                );

                // Hide loader
                $('body').trigger('hideLoadingPopup');
                $('.tmp-select').remove();
            }
        );
    },
};

export default productsGridConfigurator;
