import $ from 'jquery';
import $t from 'mage/translate';

import categoryPicker from '../../../utils/category-picker/category-picker';
import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';

import componentConfigurator from '../../_component-configurator/component-configurator';

/**
 * Product grid configurator component.
 * This component is responsible for displaying products grid  configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const productsGridConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    template: `<div class="cc-products-grid-configurator {{ classes }} | {{ mix }}" {{ attributes }}>
        <section class="cc-products-grid-configurator__section">
            <h3 class="cc-products-grid-configurator__subtitle">${$t( 'Data source' )}:</h3>
            <div class="cc-products-grid-configurator__scenario-options cc-products-grid-configurator__scenario-options--inputs">
                <div class="cc-input cc-input--type-inline | cc-products-grid-configurator__section-option">
                    <label for="cfg-pg-category" class="cc-input__label | cc-products-grid-configurator__section-option-label">${$t( 'Category ID' )}:</label>
                    <select class="cc-input__select tmp-select" style="width:25em">
                        <option>${$t( 'Select...' )}</option>
                    </select>
                    <input type="hidden" name="cfg-pg-category-select" class="cc-input__input | cc-products-grid-configurator__form-input" id="cfg-pg-category" v-model="configuration.category_id" @change="onChange">
                </div>
                <div class="cc-input cc-input--type-inline | cc-products-grid-configurator__section-option">
                    <label for="cfg-pg-filter" class="cc-input__label | cc-products-grid-configurator__section-option-label">${$t( 'Filter' )}:</label>
                    <select name="cfg-pg-filter" class="cc-input__select" id="cfg-pg-filter" v-model="configuration.filter" @change="onChange">
                        <option value="">${$t( 'No filter' )}</option>
                        <template v-for="filter in productCollectionsFilters">
                            <option value="{{ filter.value }}" :selected="filter.value === configuration.filter">{{ filter.label }}</option>
                        </template>
                    </select>
                </div>
                <div class="cc-input | cc-products-grid-configurator__section-option">
                    <label for="cfg-pg-skus" class="cc-input__label">${$t( 'SKUs' )}:</label>
                    <input type="text" name="cfg-pg-skus" class="cc-input__input" id="cfg-pg-skus" v-model="configuration.skus" @change="onChange">
                    <div class="cc-input__hint">${$t( 'Multiple, comma-separated' )}</div>
                </div>
                <div class="cc-input cc-input--type-inline | cc-products-grid-configurator__section-option">
                    <label for="cfg-pg-order-by" class="cc-input__label | cc-products-grid-configurator__section-option-label">${$t( 'Order by' )}:</label>
                    <select name="cfg-pg-order-by" class="cc-input__select" id="cfg-pg-order-by" v-model="configuration.order_by" @change="onChange">
                        <option value="">${$t( 'Not specified' )}</option>
                        <template v-for="sorter in productCollectionsSorters">
                            <option value="{{ sorter.value }}" :selected="sorter.value === configuration.order_by">{{ sorter.label }}</option>
                        </template>
                    </select>
                    <select name="cfg-pg-order-type" class="cc-input__select" v-model="configuration.order_type" @change="onChange">
                        <option value="ASC">${$t( 'Ascending' )}</option>
                        <option value="DESC">${$t( 'Descending' )}</option>
                    </select>
                </div>
                <div class="cc-input | cc-products-grid-configurator__section-option">
                    <label for="cfg-pg-dataprovider" class="cc-input__label">${$t( 'Custom Data Provider' )}:</label>
                    <input type="text" name="cfg-pg-dataprovider" class="cc-input__input" id="cfg-pg-dataprovider" v-model="configuration.class_overrides.dataProvider" @change="onChange">
                </div>
                <div class="cc-input__hint cc-input__hint--info-mark" v-if="configuration.skus.length">
                    ${$t( 'Providing list of comma separated SKUs will disable any filtering and sorting configured for that component.  Category (if specified) will also not be taken into account. Only products with specified SKUs will be displayed in exactly the same order as they are provided in SKUs field.' )}
                </div>
            </div>
        </section>

        <section class="cc-products-grid-configurator__section">
            <h3 class="cc-products-grid-configurator__subtitle">${$t( 'Mobile Layout' )}:</h3>
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
            <h3 class="cc-products-grid-configurator__subtitle">${$t( 'Tablet Layout' )}:</h3>
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
            <h3 class="cc-products-grid-configurator__subtitle">${$t( 'Desktop Layout' )}:</h3>
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
            <h3 class="cc-products-grid-configurator__subtitle">${$t( 'Hero Teaser' )}:</h3>
            <div class="cc-products-grid-configurator__scenario-options">
                <ul class="cc-products-grid-configurator__scenario-options-list">
                    <li
                        :class="{
                            'cc-products-grid-configurator__option--selected': configuration.hero.position == optionId,
                        }"
                        class="cc-products-grid-configurator__option"
                        v-for="(optionId, option) in scenarioOptions.hero.position"
                        @click="setOption('hero', optionId, 'position')">
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

        <div class="cc-products-grid-configurator__item" v-show="configuration.hero.position">
            <div class="cc-hero-carousel-configurator__item-content">
                <div v-bind:class="[ 'cc-products-grid-configurator__item-col-left', configuration.hero.image ? 'cc-products-grid-configurator__item-col-left--look-image-uploaded' : '' ]">
                    <div class="cc-products-grid-configurator__item-image-wrapper">
                        <img :src="configuration.hero.image" class="cc-image-teaser-configurator__item-image" v-show="configuration.hero.image">
                        <input type="hidden" v-model="configuration.hero.image">
                        <input type="hidden" class="cc-products-grid-configurator__image-url" id="products-grid-img">
                        <svg class="cc-products-grid-configurator__item-image-placeholder" v-show="!configuration.hero.image">
                            <use xlink:href="#icon_image-placeholder"></use>
                        </svg>

                        <div class="cc-products-grid-configurator__item-actions">
                            <component-actions>
                                <template slot="cc-component-actions__buttons">
                                    <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon | cc-component-actions__button cc-component-actions__button--upload-image | cc-products-grid-configurator__item-action-button" @click="getImageUploader()">
                                            <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                                <use xlink:href="#icon_upload-image"></use>
                                            </svg>
                                            {{ configuration.hero.image ? imageUploadedText : noImageUploadedText }}
                                    </button>
                                </template>
                            </component-actions>
                        </div>
                    </div>
                </div>

                <div class="cc-products-grid-configurator__item-col-right">
                    <div class="cc-input cc-input--group">
                        <div class="cc-input | cc-image-teaser-configurator__item-form-element">
                            <label for="cfg-pg-hero_content-position-variant" class="cc-input__label">${$t( 'Display variant' )}:</label>
                            <select name="cfg-pg-hero_content-position-variant" class="cc-input__select" id="cfg-pg-hero_content-position-variant" v-model="configuration.hero.displayVariant">
                                <template v-for="(idx, scenario) in imageTeasersContentPositions">
                                    <option value="{{ idx + 1 }}">${$t( '{{ scenario }}' )}</option>
                                </template>
                            </select>
                        </div>
                        <div class="cc-input | cc-image-teaser-configurator__item-form-element">
                            <label for="cfg-pg-hero_color-scheme" class="cc-input__label">${$t( 'Text color scheme' )}:</label>
                            <select name="cfg-pg-hero_color-scheme" class="cc-input__select" id="cfg-pg-hero_color-scheme" v-model="configuration.hero.colorScheme">
                                <option value="light">${$t( 'Light' )}</option>
                                <option value="dark">${$t( 'Dark' )}</option>
                            </select>
                        </div>
                    </div>
                    <div class="cc-input | cc-products-grid-configurator__item-form-element">
                        <label for="cfg-pg-hero_headline" class="cc-input__label">${$t( 'Headline' )}:</label>
                        <input type="text" name="cfg-pg-hero_headline" class="cc-input__input" id="cfg-pg-hero_headline" v-model="configuration.hero.headline" @change="onChange">
                    </div>
                    <div class="cc-input | cc-products-grid-configurator__item-form-element">
                        <label for="cfg-pg-hero_subheadline" class="cc-input__label">${$t( 'Subheadline' )}:</label>
                        <input type="text" name="cfg-pg-hero_subheadline" class="cc-input__input" id="cfg-pg-hero_subheadline" v-model="configuration.hero.subheadline" @change="onChange">
                    </div>
                    <div class="cc-input | cc-products-grid-configurator__item-form-element">
                        <label for="cfg-pg-hero_paragraph" class="cc-input__label | cc-products-grid-configurator__form-label--textarea">${$t( 'Paragraph' )}:</label>
                        <textarea type="text" name="cfg-pg-hero_paragraph" class="cc-input__textarea" id="cfg-pg-hero_paragraph" v-model="configuration.hero.paragraph"></textarea>
                    </div>
                    <div class="cc-input cc-input--group">
                        <div class="cc-input | cc-products-grid-configurator__item-form-element">
                            <label for="cfg-pg-hero_button_label" class="cc-input__label">${$t( 'Button label' )}:</label>
                            <input type="text" name="cfg-pg-hero_button_label" class="cc-input__input" id="cfg-pg-hero_button_label" v-model="configuration.hero.button.label" @change="onChange">
                        </div>
                        <div class="cc-input cc-input--type-addon | cc-products-grid-configurator__item-form-element">
                            <label for="cfg-pg-hero_url" class="cc-input__label">${$t( 'Url' )}:</label>
                            <input type="text" name="cfg-pg-hero_url" class="cc-input__input | cc-products-grid__hero-url" id="cfg-pg-hero_url" v-model="configuration.hero.href">
                            <span class="cc-input__addon | cc-products-grid-configurator__widget-chooser-trigger" @click="openCtaTargetModal()">
                                <svg class="cc-input__addon-icon">
                                    <use xlink:href="#icon_link"></use>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
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
            default(): Object {
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
            default(): any {
                return {};
            },
        },
        /* Obtain content of etc/view.json of the current theme */
        viewXml: {
            type: Object,
            default(): any {
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
        imageTeasersContentPositions: function(): object {
            const data: object = this.ccConfig.image_teasers_content_positions;
            return Object.keys(data).map(key => (<any>data)[key]);
        },
    },
    data(): Object {
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
                        name:  $t('1 row of products'),
                        iconId: 'pr_1',
                    },
                    2: {
                        name:  $t('2 rows of products'),
                        iconId: 'pr_2',
                    },
                    3: {
                        name:  $t('3 rows of products'),
                        iconId: 'pr_3',
                    },
                    4: {
                        name:  $t('4 rows of products'),
                        iconId: 'pr_4',
                    },
                    1000: {
                        name: $t(' rows of products'),
                        iconId: 'pr_custom',
                    },
                },
                rows_tablet: {
                    1: {
                        name:  $t('1 row of products'),
                        iconId: 'pr_1',
                    },
                    2: {
                        name:  $t('2 rows of products'),
                        iconId: 'pr_2',
                    },
                    3: {
                        name:  $t('3 rows of products'),
                        iconId: 'pr_3',
                    },
                    4: {
                        name:  $t('4 rows of products'),
                        iconId: 'pr_4',
                    },
                    1000: {
                        name: $t(' rows of products'),
                        iconId: 'pr_custom',
                    },
                },
                rows_desktop: {
                    1: {
                        name:  $t('1 row of products'),
                        iconId: 'pr_1',
                    },
                    2: {
                        name:  $t('2 rows of products'),
                        iconId: 'pr_2',
                    },
                    3: {
                        name:  $t('3 rows of products'),
                        iconId: 'pr_3',
                    },
                    4: {
                        name:  $t('4 rows of products'),
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
                            name:  $t('No Hero Teaser'),
                            iconId: 'no_teaser',
                        },
                        'left': {
                            name:  $t('Hero Teaser on the left'),
                            iconId: 'teaser_left',
                        },
                        'right': {
                            name:  $t('Hero Teaser on the right'),
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
        'component-configurator__save'(): void {
            if (this.configuration.class_overrides.dataProvider === '') {
                delete this.configuration.class_overrides;
            }

            this.onSave();
        },
    },
    methods: {
        setOption(optionCategory: string, optionId: string, key?: string): void {
            if (key) {
                this.configuration[optionCategory][key] = optionId;
            } else {
                this.configuration[optionCategory] = optionId === '1000' ? this.tmpConfiguration[optionCategory] : optionId;
            }

            this.setProductsLimit();
        },
        /* Opens M2's built-in image manager modal.
         * Manages all images: image upload from hdd, select image that was already uploaded to server.
         * @param index {number} - index of image of image teaser.
         */
        getImageUploader( index: number ): void {
            MediabrowserUtility.openDialog(`${this.uploaderBaseUrl}target_element_id/products-grid-img/`,
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
            $(document).on('change', '.cc-products-grid-configurator__image-url', (event: Event): void => {
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
            // const itemIndex: any = input.id.substr( input.id.length - 1 );
            const encodedImage: any = input.value.match('___directive\/([a-zA-Z0-9]*)')[1];
            const imgEndpoint: string = this.imageEndpoint.replace('{/encoded_image}', encodedImage);

            this.configuration.hero.decoded_image = Base64 ? Base64.decode(encodedImage) : window.atob(encodedImage);

            const img: any = new Image();
            img.onload = function(): void {
                _this.configuration.hero.image = img.getAttribute('src');
                _this.onChange();
            };
            img.src = imgEndpoint;
        },

        /*
         * Opens modal with M2 built-in widget chooser
         */
        openCtaTargetModal(): void {
            widgetTools.openDialog(`${window.location.origin}/${this.adminPrefix}/admin/widget/index/widget_target_id/cfg-pg-hero_url`);

            this.wWidgetListener();
        },

        /* Sets listener for widget chooser
         * It triggers component.onChange to update component's configuration
         * after value of item.ctaTarget is changed
         */
        widgetSetListener(): void {
            $('.cc-products-grid__hero-url').on('change', (): void => {
                this.onChange();
            });
        },

        /*
         * Check if widget chooser is loaded. If not, wait for it, if yes:
         * Override default onClick for "Insert Widget" button in widget's modal window
         * to clear input's value before inserting new one
         */
        wWidgetListener(): void {
            if (typeof wWidget !== 'undefined' && widgetTools.dialogWindow[0].innerHTML !== '') {
                const button: any = widgetTools.dialogWindow[0].querySelector('#insert_button');

                button.onclick = null;
                button.addEventListener( 'click', (): void => {
                    this.configuration.hero.href = '';
                    wWidget.insertWidget();
                } );
            } else {
                setTimeout(this.wWidgetListener, 300);
            }
        },
        /**
         * Checks if given option is currently selected
         * @param  optionCategory {string} - section of the option
         * @param  optionId {string} - value of the option
         * @return {boolean}
         */
        isOptionSelected(optionCategory: string, optionId: string): boolean {
            return this.configuration[optionCategory] == optionId || (optionId === '1000' && this.configuration[optionCategory] > 4);
        },

        /**
         * This method is searching through ccConfig configuration
         * to find the highest value for columns across whole project
         * @return {number} the highest possible columns per row value
         */
        getMaxPossibleColumns(): number {
            const maxColumns: object = this.ccConfig.columns['one-column'];
            return Math.max.apply(Math, Object.keys(maxColumns).map(key => (<any>maxColumns)[key]));
        },

        /**
         * Calculate how many products should be returned by BE, 
         * then saves result to component's configuration
         */
        setProductsLimit(): void {
            const heroWidth: number = parseInt(this.viewXml.vars.MageSuite_ContentConstructorFrontend.product_grid.teasers_configuration.size.x, 10);
            const heroHeight: number = parseInt(this.viewXml.vars.MageSuite_ContentConstructorFrontend.product_grid.teasers_configuration.size.y, 10);
            const maxRowsSet: number = Math.max(this.configuration.rows_mobile, this.configuration.rows_tablet, this.configuration.rows_desktop);
            const isHeroEnabled: boolean = this.configuration.hero.position !== '';
            let heroSize: number = isHeroEnabled ? heroWidth * heroHeight : 0;

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
        getRowsSetup(layoutOption: string): number {
            return this.configuration[layoutOption] > 5 ? this.configuration[layoutOption] : 5;
        },
    },
    ready(): void {
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
        this.$http.get(this.categoriesDataUrl).then((response: any): void => {
            this.categoryPicker = new categoryPicker($('#cfg-pg-category'), JSON.parse(response.body), {
                multiple: false,
            });

            // Hide loader
            $('body').trigger('hideLoadingPopup');
            $('.tmp-select').remove();
        });

        this.imageUploadListener();
        this.widgetSetListener();
    },
}

export default productsGridConfigurator;
