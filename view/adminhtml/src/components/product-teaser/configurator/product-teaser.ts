import $ from 'jquery';
import $t from 'mage/translate';
import { customFieldColor } from '../../_custom-fields/custom-fields';

import componentConfigurator from '../../_component-configurator/component-configurator';

/**
 * Product teaser configurator component.
 * This component is responsible for displaying product teaser configuration modal
 * @type {vuejs.ComponentOption} Vue component object.
 */
const productTeaserConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    template: `
    <form class="cc-product-teaser-configurator {{ classes }} | {{ mix }}" {{ attributes }}>
        <section class="cc-product-teaser-configurator__section cc-product-teaser-configurator__section--{{section.label | sectionID}}" v-if="ccConfig.product_teaser != null && ccConfig.product_teaser.custom_sections != null" v-for="section in ccConfig.product_teaser.custom_sections">
            <h3 class="cc-product-teaser-configurator__subtitle" v-if="section.label">{{section.label | translate}}</h3>
            <div class="cc-product-teaser-configurator__custom-sections">
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
        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label" for="cfg-pc-sku">${$t('SKU')}:</label>
            <input type="text" name="cfg-pc-sku" class="cc-input__input" id="cfg-pc-sku" v-model="configuration.sku" @change="onChange">
        </div>
        <div class="cc-product-teaser-configurator__input-hint">
            <div class="cc-input__hint">${$t('Provide only one SKU per component instance.')}</div>
        </div>
        <br>
        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label" for="cfg-pc-slogan">${$t('Slogan')}:</label>
            <input type="text" name="cfg-pc-slogan" class="cc-input__input" id="cfg-pc-slogan" v-model="configuration.slogan" @change="onChange">
        </div>
        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label" for="cfg-pc-subslogan">${$t('Subslogan')}:</label>
            <input type="text" name="cfg-pc-subslogan" class="cc-input__input" id="cfg-pc-subslogan" v-model="configuration.subslogan" @change="onChange">
        </div>
        <div class="cc-input cc-input--type-inline">
            <label for="cfg-pc-background" class="cc-input__label">${ $t('Component background color') }:</label>
            <div class="cc-input__wrapper">
                <input type="text" class="cc-input__input" id="cfg-pc-background" v-model="configuration.background" pattern="#[a-fA-F0-9]{6}" maxlength="7">
                <input type="color" class="cc-input__input cc-input__input--type-color" :value="configuration.background" @change="updateBackgroundValue($event)">
            </div>        
        </div>
        <div class="cc-product-teaser-configurator__input-hint">
            <div class="cc-input__hint">${$t('Can be left empty. Product images of component with background should have transparency.')}</div>
        </div>
        <br>
        <div class="cc-input cc-input--type-inline">
            <label for="cfg-pc-border" class="cc-input__label">${$t('Show border around teaser')}</label>
            <div class="admin__actions-switch" data-role="switcher">
                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-pc-border" v-model="configuration.border" @change="onChange">
                <label class="admin__actions-switch-label" for="cfg-pc-border">
                    <span class="admin__actions-switch-text" data-text-on="${$t('Yes')}" data-text-off="${$t('No')}"></span>
                </label>
            </div>
        </div>
        <div class="cc-input cc-input--type-inline">
            <label for="cfg-pc-shadow" class="cc-input__label">${$t('Show shadow around teaser')}</label>
            <div class="admin__actions-switch" data-role="switcher">
                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-pc-shadow" v-model="configuration.shadow" @change="onChange">
                <label class="admin__actions-switch-label" for="cfg-pc-shadow">
                    <span class="admin__actions-switch-text" data-text-on="${$t('Yes')}" data-text-off="${$t('No')}"></span>
                </label>
            </div>
        </div>
        <div class="cc-product-teaser-configurator__error-wrapper" v-if="errorMessage.length">
            <span class="cc-product-teaser-configurator__error">{{ errorMessage }}</span>
        </div>
    </form>
    `,
    events: {
        /**
         * Listen on save event from Content Configurator component.
         * Reset all errors at first and make sure error alert won't popup as validation error is visible instantly (alert appears for Product Finder so this flag is needed)
         * Checks if SKU is provided. If it is, runs AJAX request by running getProductData method. If not, sets error state and message.
         */
        'component-configurator__save'(): void {
            this.$set('configuration.isError', false);
            this.$set('configuration.showErrorAlert', false);

            if (this.configuration.sku !== '') {
                this.getProductData();
            } else {
                this.$set('configuration.isError', true);
                this.$set('errorMessage', $t('SKU is required.'));
                this.onSave();
            }
        },
    },
    props: {
        configuration: {
            type: Object,
            default(): any {
                return {
                    customCssClass: '',
                    sku: '',
                    slogan: '',
                    subslogan: '',
                    border: false,
                    shadow: false
                };
            },
        },
        productDataEndpoint: {
            type: String,
            default: '',
        },
        /* Set prop with component name in order to
         * pass it to `component-configurator` methods
        */
        xmlConfigEntry: {
            type: String,
            default: 'product_teaser',
        },
    },
    data(): Object {
        return {
            errorMessage: '',
            product: null,
        };
    },
    methods: {
        /**
         * Saves product's name to configuration object for preview to display in Layout Builder
         * @param productName - Product's name from the AJAX response object.
         */
        setProductData(productName: string): void {
            this.$set('configuration.product', {});
            this.$set('configuration.product.name', productName);
        },

        /**
         * Handles AJAX Success.
         * Checks if product data are available and passes product's name to setProductData method for further processing.
         * Then Hides loader
         * @param response full AJAX response
         */
        handleUpdate(response: vuejs.HttpResponse): void {
            if (response.ok && response.body && response.body.length) {
                const productData: any = JSON.parse(response.body);

                if (productData.product && productData.product.name) {
                    this.setProductData(productData.product.name);
                }
            }

            this.validate();
            $('body').trigger('hideLoadingPopup');
        },

        /**
         * Sends AJAX request to fetch product data
         * Starts loader at first, then:
         * On Success passes response to handeUpdate for further processing
         * On Error runs validate method and hide the loader
         */
        getProductData(): void {
            $('body').trigger('showLoadingPopup');

            this.$http
                .get(`${this.productDataEndpoint}?sku=${this.configuration.sku}`)
                .then(
                    (response: vuejs.HttpResponse): void => this.handleUpdate(response),
                    (): void => {
                        this.validate();
                        $('body').trigger('hideLoadingPopup');
                    }
                );
        },

        /**
         * Validates product data and set up error message if product data is not available.
         */
        validate(): void {
            if (!this.configuration.product || this.configuration.product.name === '') {
                this.$set('configuration.isError', true);
                this.$set('errorMessage', $t('Can\'t find product with given SKU. Please verify SKU and try again.'));
            }

            this.onSave();
        },
        updateBackgroundValue(e: Event) {
            this.$set(`configuration.background`, (e.target as HTMLInputElement).value);
        }
    },
};

export default productTeaserConfigurator;
