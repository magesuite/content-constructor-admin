import $ from 'jquery';
import $t from 'mage/translate';

import componentConfigurator from '../../_component-configurator/component-configurator';
import categoryPicker from '../../../utils/category-picker/category-picker';

/**
 * Product carousel configurator component.
 * This component is responsible for displaying product carousel's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const productCarouselConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    template: `<form class="cc-product-carousel-configurator {{ classes }} | {{ mix }}" {{ attributes }}>

        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label">${$t( 'Categories' )}:</label>
            <input type="hidden" v-model="configuration.category_id" @change="onChange" id="cp-products-carousel">
        </div>

        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label" for="cfg-pc-skus">${$t( 'SKUs' )}:</label>
            <input type="text" name="cfg-pc-skus" class="cc-input__input" id="cfg-pc-skus" v-model="configuration.skus" @change="onChange">
        </div>
        <div class="cc-input cc-input--type-inline cc-input--type-hint">
            <label class="cc-input__label"> </label>
            <span class="cc-input__hint cc-input__hint--under-field">${$t( 'Multiple, comma-separated' )}</span>
        </div>
        <div class="cc-input cc-input--type-inline cc-input--type-hint" v-if="configuration.skus.length">
            <label class="cc-input__label"> </label>
            <span class="cc-input__hint cc-input__hint--under-field cc-input__hint--info-mark">${$t( 'Providing list of comma separated SKUs will disable any filtering and sorting configured for that component.  Category (if specified) will also not be taken into account. Only products with specified SKUs will be displayed in exactly the same order as they are provided in SKUs field.' )}</span>
        </div>

        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label" for="cfg-pc-dataprovider">${$t( 'Custom Data Provider' )}:</label>
            <input type="text" name="cfg-pc-dataprovider" class="cc-input__input" id="cfg-pc-dataprovider" v-model="configuration.class_overrides.dataProvider" @change="onChange">
        </div>

        <div class="cc-input cc-input--type-inline">
            <label for="cfg-pc-filter" class="cc-input__label">${$t( 'Filter' )}:</label>
            <select name="cfg-pc-filter" class="cc-input__select" id="cfg-pc-filter" v-model="configuration.filter" @change="onChange">
                <option value="">${$t( 'No filter' )}</option>
                <template v-for="filter in productCollectionsFilters">
                    <option value="{{ filter.value }}" :selected="filter.value === configuration.filter">{{ filter.label }}</option>
                </template>
            </select>
        </div>

        <div class="cc-input cc-input--type-inline">
            <label for="cfg-pc-order-by" class="cc-input__label">${$t( 'Order by' )}:</label>
            <select name="cfg-pc-order-by" class="cc-input__select" id="cfg-pc-order-by" v-model="configuration.order_by" @change="onChange">
                <option value="">${$t( 'Not specified' )}</option>
                <template v-for="sorter in productCollectionsSorters">
                    <option value="{{ sorter.value }}" :selected="sorter.value === configuration.order_by">{{ sorter.label }}</option>
                </template>
            </select>
            <select name="cfg-pc-order-type" class="cc-input__select" v-model="configuration.order_type" @change="onChange">
                <option value="ASC">${$t( 'Ascending' )}</option>
                <option value="DESC">${$t( 'Descending' )}</option>
            </select>
        </div>

        <div class="cc-input cc-input--type-inline">
            <label for="cfg-pc-order-by" class="cc-input__label">${$t( 'Show ')}:</label>
            <select name="cfg-pc-limit" class="cc-input__select" id="cfg-pc-limit" v-model="configuration.limit" @change="onChange">
                <option value="20">20 ${$t( 'products ')}</option>
                <option value="40">40 ${$t( 'products ')}</option>
                <option value="60">60 ${$t( 'products ')}</option>
                <option value="80">80 ${$t( 'products ')}</option>
                <option value="100">100 ${$t( 'products ')}</option>
            </select>
        </div>
    </form>`,
    props: {
        configuration: {
            type: Object,
            default(): Object {
                return {
                    category_id: '',
                    filter: '',
                    order_by: 'creation_date',
                    order_type: 'DESC',
                    limit: 20,
                    skus: '',
                    class_overrides: {
                        dataProvider: '',
                    },
                };
            },
        },
        /* Obtain endpoint for getting categories data for category picker */
        categoriesDataUrl: {
            type: String,
            default: '',
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
    data(): Object {
        return {
            categoryPicker: undefined,
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
    ready(): void {
        this.productCollectionsSorters = this.productCollectionsSorters !== '' ? JSON.parse(this.productCollectionsSorters) : [];
        this.productCollectionsFilters = this.productCollectionsFilters !== '' ? JSON.parse(this.productCollectionsFilters) : [];

        if (!this.configuration.class_overrides) {
            this.configuration.class_overrides = {
                dataProvider: '',
            };
        }

        // Show loader
        $('body').trigger('showLoadingPopup');

        // Get categories JSON with AJAX
        this.$http.get(this.categoriesDataUrl).then((response: any): void => {
            this.categoryPicker = new categoryPicker($('#cp-products-carousel'), JSON.parse(response.body), {
                multiple: false,
            });
            
            // Hide loader
            $('body').trigger('hideLoadingPopup');
        });
    },
};

export default productCarouselConfigurator;
