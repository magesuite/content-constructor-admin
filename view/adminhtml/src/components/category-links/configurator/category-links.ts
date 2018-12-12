import $ from 'jquery';
import $t from 'mage/translate';

import componentConfigurator from '../../_component-configurator/component-configurator';
import categoryPicker from '../../../utils/category-picker/category-picker';

/**
 * Category links configurator component.
 * This component is responsible for displaying category links configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const categoryLinksConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    template: `<form class="cc-category-links-configurator {{ classes }} | {{ mix }}" {{ attributes }} @submit.prevent="onSave">
        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label">${$t( 'Category' )}</label>
            <input type="hidden" v-model="configuration.main_category_id" id="cp-main">
        </div>
        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label">${$t( 'Subcategories' )}</label>
            <input type="hidden" v-model="configuration.sub_categories_ids" id="cp-sub">
        </div>
        
        <div class="cc-input cc-input--type-inline">
            <label for="cfg-shownumbers" class="cc-input__label">${$t( 'Show products count' )}</label>
            <div class="admin__actions-switch" data-role="switcher">
                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-shownumbers" name="use_name_in_product_search" v-model="configuration.shownumbers" @change="onChange">
                <label class="admin__actions-switch-label" for="cfg-shownumbers">
                    <span class="admin__actions-switch-text" data-text-on="${$t( 'Yes' )}" data-text-off="${$t( 'No' )}"></span>
                </label>
            </div>
        </div>
    </form>`,
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            this.configuration.main_category_labels = this.categoryPicker._categoriesLabels;
            this.configuration.sub_categories_labels = this.subCategoriesPicker._categoriesLabels;
            this.onSave();
        },
    },
    props: {
        configuration: {
            type: Object,
            default(): Object {
                return {
                    main_category_id: '',
                    sub_categories_ids: '',
                    shownumbers: false,
                };
            },
        },
        /* Obtain endpoint for getting categories data for category picker */
        categoriesDataUrl: {
            type: String,
            default: '',
        },
    },
    data(): Object {
        return {
            categoryPicker: undefined,
            subCategoriesPicker: undefined,
        };
    },
    ready(): void {
        // Show loader
        $('body').trigger('showLoadingPopup');

        this.$http.get(this.categoriesDataUrl).then((response: any): void => {
            this.initializePickers(JSON.parse(response.body));
            
            // Hide loader
            $('body').trigger('hideLoadingPopup');
        } );
    },
    methods: {
        initializePickers(categories: any): void {
            this.subCategoriesPicker = new categoryPicker($('#cp-sub'), categories, {
                showSearch: false,
                disabled: this.configuration.main_category_id === '',
            });

            this.categoryPicker = new categoryPicker($('#cp-main'), categories, {
                multiple: false,
            });

            if (this.configuration.main_category_id !== '') {
                this.subCategoriesPicker.showChildrenOnly(this.configuration.main_category_id);
            }

            $('#cp-main').on('change', (): void => {
                this.updateSubcategoriesPicker(this.configuration.main_category_id);
            });
        },

        updateSubcategoriesPicker(catId: string): void {
            this.subCategoriesPicker.resetAll();

            if (catId !== '') {
                this.subCategoriesPicker.showChildrenOnly(catId);
                this.subCategoriesPicker.enable();
            } else {
                this.subCategoriesPicker.disable();
            }
        }
    },
};

export default categoryLinksConfigurator;
