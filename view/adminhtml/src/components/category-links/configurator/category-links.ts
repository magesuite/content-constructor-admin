import $ from 'jquery';
import $t from 'mage/translate';

import categoryPicker from '../../../utils/category-picker/category-picker';
import componentConfigurator from '../../_component-configurator/component-configurator';

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
        <section class="cc-category-links-configurator__section cc-category-links-configurator__section--{{section.label | sectionID}}" v-if="ccConfig.category_links != null && ccConfig.category_links.custom_sections != null" v-for="section in ccConfig.category_links.custom_sections">
            <h3 class="cc-category-links-configurator__subtitle" v-if="section.label">{{section.label | translate}}</h3>
            <div class="cc-custom-fields">
                <div class="cc-custom-fields__form-group" :class="{'cc-custom-fields__form-group--full': section.type === 'full-width'}" v-for="field in section.content.fields">
                    <component
                        :is="'custom-element-' + field.type"
                        :configuration="configuration"
                        :field-configuration="field"
                    ></component>
                </div>
            </div>
        </section>

        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label">${$t('Category')}</label>
            <input type="hidden" v-model="configuration.main_category_id" id="cp-main">
        </div>
        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label">${$t('Subcategories')}</label>
            <input type="hidden" v-model="configuration.sub_categories_ids" id="cp-sub">
        </div>

        <div class="cc-input cc-input--type-inline">
            <label for="cfg-shownumbers" class="cc-input__label">${$t('Show products count')}</label>
            <div class="admin__actions-switch" data-role="switcher">
                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-shownumbers" name="use_name_in_product_search" v-model="configuration.shownumbers" @change="onChange">
                <label class="admin__actions-switch-label" for="cfg-shownumbers">
                    <span class="admin__actions-switch-text" data-text-on="${$t('Yes')}" data-text-off="${$t('No')}"></span>
                </label>
            </div>
        </div>

        <div
            class="cc-input cc-input--type-inline"
            v-bind:class="{ '_disabled': !subCategoriesPicker._categoriesLabels.length}"
        >
            <label for="hide_link_to_all_products" class="cc-input__label">${$t('Hide link to all products')}</label>
            <div class="admin__actions-switch" data-role="switcher">
                <input
                    type="checkbox"
                    class="admin__actions-switch-checkbox"
                    id="cfg-hidelinktoall"
                    name="hide_link_to_all_products"
                    v-model="configuration.hide_link_to_all_products"
                    @change="onChange"
                    :checked="subCategoriesPicker._categoriesLabels.length && configuration.hide_link_to_all_products"
                    :disabled="!subCategoriesPicker._categoriesLabels.length">
                <label class="admin__actions-switch-label" for="cfg-hidelinktoall">
                    <span class="admin__actions-switch-text" data-text-on="${$t('Yes')}" data-text-off="${$t('No')}"></span>
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
            /**
             * Link to all products can only be hidden when there are any subcategories selected.
             * When only main category is selected - "All products" link is the only link displayed by the component.
             */
            this.configuration.hide_link_to_all_products = this.subCategoriesPicker._categoriesLabels.length ? this.configuration.hide_link_to_all_products : false;
            this.onSave();
        },
    },
    props: {
        configuration: {
            type: Object,
            default(): Object {
                return {
                    customCssClass: '',
                    main_category_id: '',
                    sub_categories_ids: '',
                    shownumbers: false,
                    hide_link_to_all_products: false,
                };
            },
        },
        /* Obtain endpoint for getting categories data for category picker */
        categoriesDataUrl: {
            type: String,
            default: '',
        },
        /* Set prop with component name in order to
         * pass it to `component-configurator` methods
        */
        xmlConfigEntry: {
            type: String,
            default: 'category_links',
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
        });
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
                // Reset the hide link to all products config because the subcategory list is being cleared
                this.configuration.hide_link_to_all_products = false;
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
        },
    },
};

export default categoryLinksConfigurator;
