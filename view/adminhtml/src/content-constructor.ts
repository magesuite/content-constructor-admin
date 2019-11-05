/* tslint:disable:no-console */

// Vue & jQuery
import $ from 'jquery';
import Vue from 'Vue';
import vr from 'VueResource';

// Magento modules
import 'loadingPopup';
import $t from 'mage/translate';
import modal from 'Magento_Ui/js/modal/modal';
import alert from 'Magento_Ui/js/modal/alert';
import uiRegistry from 'uiRegistry';

// CC essentials
import componentPicker from './components/_component-picker/component-picker';
import {
    IComponentInformation,
    layoutBuilder,
} from './components/_layout-builder/layout-builder';

// CC components
import buttonConfigurator from './components/button/configurator/button';
import categoryLinksConfigurator from './components/category-links/configurator/category-links';
import cmsPagesTeaserConfigurator from './components/cms-pages-teaser/configurator/cms-pages-teaser';
import customHtmlConfigurator from './components/custom-html/configurator/custom-html';
import dailyDealTeaserConfigurator from './components/daily-deal-teaser/configurator/daily-deal-teaser';
import headlineConfigurator from './components/headline/configurator/headline';
import heroCarouselConfigurator from './components/hero-carousel/configurator/hero-carousel';
import iconConfigurator from './components/icon/configurator/icon';
import imageTeaserConfigurator from './components/image-teaser/configurator/image-teaser';
import imageTeaserLegacyConfigurator from './components/image-teaser/configurator/image-teaser-legacy';
import magentoProductGridTeasersConfigurator from './components/magento-product-grid-teasers/configurator/magento-product-grid-teasers';
import paragraphConfigurator from './components/paragraph/configurator/paragraph';
import productCarouselConfigurator from './components/product-carousel/configurator/product-carousel';
import productFinderConfigurator from './components/product-finder/configurator/product-finder';
import productsGridConfigurator from './components/products-grid/configurator/products-grid';
import staticBlockConfigurator from './components/static-block/configurator/static-block';
import teaserAndTextConfigurator from './components/teaser-and-text/configurator/teaser-and-text';
import instagramFeedConfigurator from './components/instagram-feed/configurator/instagram-feed';
import mosaicConfigurator from './components/mosaic/configurator/mosaic';

// Use Vue resource
Vue.use(vr);

// Set Vue's $http headers Accept to text/html
Vue.http.headers.custom.Accept = 'text/html';

// Picker modal options
const pickerModalOptions: any = {
    type: 'slide',
    responsive: true,
    innerScroll: true,
    autoOpen: true,
    title: $t('Please select type of component'),
    buttons: [
        {
            text: $.mage.__('Cancel'),
            class: '',
            click(): void {
                this.closeModal();
            },
        },
    ],
};
let $pickerModal: any;

const configuratorModalOptions: any = {
    type: 'slide',
    responsive: true,
    innerScroll: true,
    autoOpen: true,
    title: $t('Configure your component'),
    buttons: [
        {
            text: $.mage.__('Cancel'),
            class: '',
            click(): void {
                this.closeModal();
            },
        },
        {
            text: $.mage.__('Save'),
            class: 'action-primary',
        },
    ],
};
let $configuratorModal: any;

/**
 * M2C Content Constructor component.
 * This is the final layer that is responsible for collecting and tying up all
 * of the M2C admin panel logic.
 */
const contentConstructor: vuejs.ComponentOption = {
    template: `<div class="content-constructor">
        <layout-builder
            v-ref:layout-builder
            :assets-src="assetsSrc"
            :cc-config="ccConfig"
            :image-endpoint="imageEndpoint"
            :cc-project-configuration="ccProjectConfiguration"
            :page-type="pageType"
            :add-component="getComponentPicker"
            :edit-component="editComponent"
            :components-configuration="configuration">
        </layout-builder>
        <div class="content-constructor__modal content-constructor__modal--picker" v-el:picker-modal></div>
        <div class="content-constructor__modal content-constructor__modal--configurator" v-el:configurator-modal></div>
    </div>`,
    components: {
        // Essentials
        'layout-builder': layoutBuilder,
        'component-picker': componentPicker,
        // CC components
        'button-configurator': buttonConfigurator,
        'category-links-configurator': categoryLinksConfigurator,
        'custom-html-configurator': customHtmlConfigurator,
        'cms-pages-teaser-configurator': cmsPagesTeaserConfigurator,
        'daily-deal-teaser-configurator': dailyDealTeaserConfigurator,
        'headline-configurator': headlineConfigurator,
        'hero-carousel-configurator': heroCarouselConfigurator,
        'image-teaser-configurator': imageTeaserConfigurator,
        'image-teaser-legacy-configurator': imageTeaserLegacyConfigurator,
        'magento-product-grid-teasers-configurator': magentoProductGridTeasersConfigurator,
        'paragraph-configurator': paragraphConfigurator,
        'product-carousel-configurator': productCarouselConfigurator,
        'product-finder-configurator': productFinderConfigurator,
        'products-grid-configurator': productsGridConfigurator,
        'static-block-configurator': staticBlockConfigurator,
        'icon-configurator': iconConfigurator,
        'teaser-and-text-configurator': teaserAndTextConfigurator,
        'instagram-feed-configurator': instagramFeedConfigurator,
        'mosaic-configurator': mosaicConfigurator,
    },
    props: {
        configuration: {
            type: String,
            default: '',
        },
        adminPrefix: {
            type: String,
            default: 'admin',
        },
        assetsSrc: {
            type: String,
            default: '',
        },
        configuratorEndpoint: {
            type: String,
            default: '',
        },
        uploaderUrl: {
            type: String,
            default: '',
        },
        restTokenEndpoint: {
            type: String,
            default: '',
        },
        imageEndpoint: {
            type: String,
            default: '',
        },
        categoryDataProviderEndpoint: {
            type: String,
            default: '',
        },
        pageType: {
            type: String,
            default: 'cms_page_form.cms_page_form',
        },
        productsPerPage: {
            type: String,
            default: '30',
        },
        ccProjectConfig: {
            type: String,
            default: '',
        },
        sorters: {
            type: [String, Array],
            default: '',
        },
        filters: {
            type: [String, Array],
            default: '',
        },
    },
    data(): object {
        return {
            ccConfig: this.getCCconfig(),
            viewXml: JSON.parse(this.ccProjectConfig),
            initialComponentConfiguration: undefined,
            restToken: undefined,
        };
    },
    ready(): void {
        const targetComponentMatch = $(this.$el)
            .closest('.entry-edit.form-inline')
            .attr('data-bind')
            .match(/scope: '([^']+)'/);
        if (targetComponentMatch && !targetComponentMatch[1]) {
            this.pageType = targetComponentMatch[1];
        }

        this.disableDesignInheritance();
        this.dumpConfiguration();
        this._isPickerLoaded = false;
        this._cleanupConfiguratorModal = '';
        this._configuratorSaveCallback = (): undefined => undefined;
        this.setRestToken();

        // Initialize M2 loader for m2c modals
        $('body')
            .loadingPopup({
                timeout: false,
            })
            .trigger('hideLoadingPopup');
    },
    events: {
        /**
         * We update provided input with new components information each time leyout
         * builder updates.
         */
        'layout-builder__update'(): void {
            this.dumpConfiguration();
        },
        'component-configurator__saved'(data: any): void {
            if (
                !data.hasOwnProperty('isError') ||
                (data.hasOwnProperty('isError') && !data.isError)
            ) {
                this._configuratorSavedCallback(data);

                if ($configuratorModal && $configuratorModal.closeModal) {
                    $configuratorModal.closeModal();
                }
                if ($pickerModal && $pickerModal.closeModal) {
                    $pickerModal.closeModal();
                }
            } else {
                alert({
                    title: $t('Hey,'),
                    content: $.mage.__(
                        'Something is wrong with configuration of your component. Please fix all errors before saving.'
                    ),
                });
            }
        },
        'layout-builder__cmsblock-delete-request'(cmsBlockId: string): void {
            this.deleteStaticBlock(cmsBlockId);
        },
    },
    methods: {
        getCCconfig(): JSON {
            const ccConfig: any = this.ccProjectConfig
                ? JSON.parse(this.ccProjectConfig)
                : {};
            return !$.isEmptyObject(ccConfig)
                ? ccConfig.vars.MageSuite_ContentConstructor
                : ccConfig;
        },

        /**
         * Callback that will be invoked when user clicks plus button.
         * This method should open magento modal with component picker.
         * @param  {IComponentInformation} addComponentInformation Callback that let's us add component asynchronously.
         */
        getComponentPicker(
            addComponentInformation: (
                componentInfo: IComponentInformation
            ) => void
        ): void {
            const component: any = this;

            // Save adding callback for async use.
            this._addComponentInformation = addComponentInformation;

            pickerModalOptions.opened = function(): void {
                if (!component._isPickerLoaded) {
                    // Show ajax loader
                    $('body').trigger('showLoadingPopup');

                    // Get picker via AJAX
                    component.$http
                        .get(`${component.configuratorEndpoint}picker`)
                        .then((response: any): void => {
                            component.$els.pickerModal.innerHTML =
                                response.body;
                            component.$compile(component.$els.pickerModal);
                            component._isPickerLoaded = true;
                            // Hide loader
                            $('body').trigger('hideLoadingPopup');
                        });
                }
            };
            // Create or Show picker modal depending if exists
            if ($pickerModal) {
                $pickerModal.openModal();
            } else {
                $pickerModal = modal(
                    pickerModalOptions,
                    $(this.$els.pickerModal)
                );
            }
        },

        /**
         * Callback that will be invoked when user choses component in picker.
         * This method should open magento modal with component configurator.
         * @param {componentType} String - type of component chosen
         */
        getComponentConfigurator(
            componentType: string,
            componentName: string
        ): void {
            const newComponentId: string =
                'component' +
                Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            const section: string = this.ccConfig.sections.defaults[
                this.pageType
            ]
                ? this.ccConfig.sections.defaults[this.pageType]
                : this.ccConfig.sections[this.pageType][0];

            this._configuratorSavedCallback = (componentData: any): void => {
                this._addComponentInformation({
                    type: componentType,
                    name: componentName,
                    id: newComponentId,
                    section: section,
                    data: componentData,
                });
            };

            if (
                componentType === 'brand-carousel' ||
                componentType === 'separator'
            ) {
                this.$emit('component-configurator__saved', {
                    componentVisibility: {
                        mobile: true,
                        desktop: true,
                    },
                });
            } else {
                this.initConfiguratorModal({
                    type: componentType,
                    name: componentName,
                    id: newComponentId,
                    section: section,
                    data: undefined,
                });
            }
        },
        /**
         * Callback that will be invoked when user clicks edit button.
         * This method should open magento modal with component editor.
         * @param  {IComponentInformation} setComponentInformation Callback that let's us add component asynchronously.
         */
        editComponent(
            prevComponentData: IComponentInformation,
            setComponentInformation: (
                componentInfo: IComponentInformation
            ) => void
        ): void {
            this._configuratorSavedCallback = (componentData: any): void => {
                setComponentInformation({
                    name: prevComponentData.name,
                    type: prevComponentData.type,
                    id: prevComponentData.id,
                    section: prevComponentData.section,
                    data: componentData,
                });
            };

            this.initConfiguratorModal(prevComponentData);
        },

        initConfiguratorModal(
            componentInformation: IComponentInformation
        ): void {
            const component: any = this;
            let cleanupConfiguratorModal = (): undefined => undefined;

            configuratorModalOptions.buttons[1].click = function(): void {
                component.$broadcast('component-configurator__save');
            };
            configuratorModalOptions.title = `${$t(
                'Configure your component'
            )}<span class="m2c-content-constructor__modal-subheadline">${this.transformComponentTypeToText(
                componentInformation.type
            )}</span>`;

            // Configurator modal opened callback
            configuratorModalOptions.opened = function(): void {
                // Show ajax loader
                $('body').trigger('showLoadingPopup');

                // Get twig component
                component.$http
                    .get(
                        component.configuratorEndpoint +
                            componentInformation.type
                    )
                    .then((response: any): void => {
                        component.$els.configuratorModal.innerHTML =
                            response.body;

                        // Set current component configuration data
                        component.initialComponentConfiguration =
                            componentInformation.data;

                        // compile fetched component
                        cleanupConfiguratorModal = component.$compile(
                            component.$els.configuratorModal
                        );

                        // Hide loader
                        $('body').trigger('hideLoadingPopup');
                    });
            };

            configuratorModalOptions.closed = function(): void {
                // Cleanup configurator component and then remove modal
                cleanupConfiguratorModal();
                component.$els.configuratorModal.innerHTML = '';
                $configuratorModal.modal[0].parentNode.removeChild(
                    $configuratorModal.modal[0]
                );
                component.initialComponentConfiguration = undefined;
            };
            // Create & Show $configuratorModal
            $configuratorModal = modal(
                configuratorModalOptions,
                $(this.$els.configuratorModal)
            );
        },

        /**
         * Makes sure that certain CMS page, product or category won't inherit
         * design update contents which prevents content constructor to show any changes.
         */
        disableDesignInheritance(): void {
            uiRegistry
                .get(this.pageType)
                .source.set('data.use_default.custom_layout_update', 0);
        },

        dumpConfiguration(): void {
            uiRegistry
                .get(this.pageType)
                .source.set(
                    'data.components',
                    JSON.stringify(
                        this.$refs.layoutBuilder.getComponentInformation()
                    )
                );
        },

        setRestToken(): void {
            const component: any = this;

            // send request for token
            this.$http
                .get(this.restTokenEndpoint)
                .then((response: any): void => {
                    component.restToken = `Bearer ${response.body}`;
                });
        },

        deleteStaticBlock(cmsBlockId: string): void {
            const component: any = this;

            // Send request to REST API
            this.$http({
                headers: {
                    Accept: 'application/json',
                    Authorization: component.restToken,
                },
                method: 'delete',
                url: `${window.location.origin}/rest/V1/cmsBlock/${cmsBlockId}`,
            }).then((response: any): void => {
                if (response.body !== 'true') {
                    console.warn(
                        `Something went wrong, CMS block wasn\'t removed, please check if block with ID: ${cmsBlockId} exists in database`
                    );
                }
            });
        },

        transformComponentTypeToText(componentType: string): string {
            const txt: string = componentType
                .replace(/\-+/g, ' ')
                .replace(/[0-9]/g, '');
            return (
                txt
                    .trim()
                    .charAt(0)
                    .toUpperCase() + txt.slice(1)
            );
        },
    },
};

export default contentConstructor;
