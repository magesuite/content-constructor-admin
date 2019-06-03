import $ from 'jquery';
import $t from 'mage/translate';
import confirm from 'Magento_Ui/js/modal/confirm';

import actionButton from '../../utils/action-button/action-button';
import componentActions from '../../utils/component-actions/component-actions';
import componentAdder from '../../utils/component-adder/component-adder';
import componentDisplayController from '../../utils/component-display-controller/component-display-controller';
import componentPlaceholder from '../../utils/component-placeholder/component-placeholder';

import brandCarouselPreview from '../brand-carousel/preview/brand-carousel';
import buttonPreview from '../button/preview/button';
import categoryLinksPreview from '../category-links/preview/category-links';
import cmsPagesTeaserPreview from '../cms-pages-teaser/preview/cms-pages-teaser';
import customHtmlPreview from '../custom-html/preview/custom-html';
import dailyDealTeaserPreview from '../daily-deal-teaser/preview/daily-deal-teaser';
import headlinePreview from '../headline/preview/headline';
import heroCarouselPreview from '../hero-carousel/preview/hero-carousel';
import iconPreview from '../icon/preview/icon';
import imageTeaserPreview from '../image-teaser/preview/image-teaser';
import imageTeaserLegacyPreview from '../image-teaser/preview/image-teaser-legacy';
import magentoProductGridTeasersPreview from '../magento-product-grid-teasers/preview/magento-product-grid-teasers';
import paragraphPreview from '../paragraph/preview/paragraph';
import productCarouselPreview from '../product-carousel/preview/product-carousel';
import productFinderPreview from '../product-finder/preview/product-finder';
import productGridPreview from '../products-grid/preview/products-grid';
import separatorPreview from '../separator/preview/separator';
import staticBlockPreview from '../static-block/preview/static-block';
import teaserAndTextPreview from '../teaser-and-text/preview/teaser-and-text';

/**
 * Single component information interface.
 */
interface IComponentInformation {
    name?: string;
    id: string;
    type: string;
    section: string;
    data?: any;
}

/**
 * Layout builder component.
 * This component is responsible for displaying and handling user interactions of
 * entire Content Constructor
 * @type {vuejs.ComponentOption} Vue component object.
 */
const layoutBuilder: vuejs.ComponentOption = {
    template: `<div class="cc-layout-builder | {{ class }}">
        <div class="cc-layout-builder__filters" v-if="filters">
            <template v-for="(filterKey, filter) in filters">
                <div class="cc-layout-builder__filter">
                    <div class="cc-layout-builder__filter-content">
                        <svg class="cc-layout-builder__filter-icon">
                            <use xlink:href="{{ filter.icon }}"></use>
                        </svg>
                        <span class="cc-layout-builder__filter-title">
                            {{ getTranslatedText( filter.title ) }}:
                        </span>
                        <template v-for="(optionKey, option) in filter.options">
                            <div class="cc-layout-builder__filter-control">
                                <label :class="[ option.value ? 'cc-input__checkbox-label cc-input__checkbox-label--checked' : 'cc-input__checkbox-label' ]">
                                    <input type="checkbox" v-model="option.value" class="cc-input__checkbox" @change="saveFiltersState()">
                                    {{ getTranslatedText( option.label ) }}
                                </label>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>

        <div class="cc-layout-builder__component cc-layout-builder__component--static">
            <div class="cc-layout-builder__component-wrapper">
                <div class="cc-component-placeholder__component cc-component-placeholder__component--decorated cc-component-placeholder__component--header">
                    <svg class="cc-component-placeholder__component-icon">
                        <use xlink:href="#icon_component-cc-header"></use>
                    </svg>
                </div>
            </div>

            <component-adder class="cc-component-adder cc-component-adder--last">
                <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button" @click="createNewComponent( 0 )">
                    <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                        <use xlink:href="#icon_plus"></use>
                    </svg>
                </button>
            </component-adder>
        </div>

        <template v-for="component in components">
            <div v-bind:class="{ 'cc-layout-builder__component': true, 'cc-layout-builder__component--special': getIsSpecialComponent( component.type ), 'cc-layout-builder__component--invisible': getIsComponentHiddenFE( component.data ), 'cc-layout-builder__component--filtered-out': !getIsComponentVisibleDashboard( component.data ) }" id="{{ component.id }}">
                <component-adder class="cc-component-adder cc-component-adder--first">
                    <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button" @click="createNewComponent( $index )">
                        <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                            <use xlink:href="#icon_plus"></use>
                        </svg>
                    </button>
                </component-adder>

                <div class="cc-layout-builder__component-actions">
                    <component-actions>
                        <template slot="cc-component-actions__buttons">
                            <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--up" @click="moveComponentUp( $index )" :class="[ isFirstComponent( $index ) ? 'cc-action-button--look_disabled' : '' ]" :disabled="isFirstComponent( $index )">
                                <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                    <use xlink:href="#icon_arrow-up"></use>
                                </svg>
                            </button>
                            <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--down" @click="moveComponentDown( $index )" :class="[ isLastComponent( $index ) ? 'cc-action-button--look_disabled' : '' ]" :disabled="isLastComponent( $index )">
                                <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                    <use xlink:href="#icon_arrow-down"></use>
                                </svg>
                            </button>
                            <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--settings" :class="[ isPossibleToEdit( component.type ) ? '' : 'cc-action-button--look_disabled' ]" :disabled="!isPossibleToEdit( component.type )" @click="editComponentSettings( $index )" title="{{ getTranslatedText('Edit component') }}">
                                <svg class="cc-action-button__icon">
                                    <use xlink:href="#icon_edit"></use>
                                </svg>
                            </button>
                            <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--duplicate" :class="[ isPossibleToDuplicate( component.type ) ? '' : 'cc-action-button--look_disabled' ]" :disabled="!isPossibleToDuplicate( component.type )" @click="duplicateComponent( $index )" title="{{ getTranslatedText('Duplicate component') }}">
                                <svg class="cc-action-button__icon">
                                    <use xlink:href="#icon_duplicate"></use>
                                </svg>
                            </button>
                            <div class="cc-component-display-controller" v-if="isPossibleToControlDisplay( component.type )">
                                <svg class="cc-component-display-controller__icon">
                                    <use xlink:href="#icon_eye"></use>
                                </svg>
                                <div class="cc-component-display-controller__control">
                                    <label :class="[ component.data.componentVisibility.mobile ? 'cc-input__checkbox-label cc-input__checkbox-label--checked' : 'cc-input__checkbox-label' ]">
                                        <input type="checkbox" v-model="component.data.componentVisibility.mobile" class="cc-input__checkbox" @change="updateLayout()">
                                        {{ getTranslatedText('Mobile') }}
                                    </label>
                                </div>
                                <div class="cc-component-display-controller__control">
                                    <label :class="[ component.data.componentVisibility.desktop ? 'cc-input__checkbox-label cc-input__checkbox-label--checked' : 'cc-input__checkbox-label' ]">
                                        <input type="checkbox" v-model="component.data.componentVisibility.desktop" class="cc-input__checkbox" @change="updateLayout()">
                                        {{ getTranslatedText('Tablet and Desktop') }}
                                    </label>
                                </div>
                            </div>
                            <button is="action-button" class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only | cc-component-actions__button cc-component-actions__button--delete" :class="[ isPossibleToDelete( component.type ) ? '' : 'cc-action-button--look_disabled' ]" :disabled="!isPossibleToDelete( component.type )" @click="deleteComponent( $index )">
                                <svg class="cc-action-button__icon">
                                    <use xlink:href="#icon_trash-can"></use>
                                </svg>
                            </button>
                        </template>
                    </component-actions>
                </div>
                <div class="cc-layout-builder__component-wrapper">
                    <component-placeholder>
                        <h3 class="cc-component-placeholder__headline" v-text="transformComponentTypeToText( component.name || component.type )"></h3>
                        <div class="cc-component-placeholder__component">
                            <component :is="component.type + '-preview'" :configuration="component.data" :index="$index" :assets-src="assetsSrc" :image-endpoint="imageEndpoint"></component>
                        </div>
                    </component-placeholder>
                </div>

                <component-adder class="cc-component-adder cc-component-adder--last">
                    <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button" @click="createNewComponent( $index + 1 )">
                        <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                            <use xlink:href="#icon_plus"></use>
                        </svg>
                    </button>
                </component-adder>
            </div>
        </template>

        <div class="cc-layout-builder__component cc-layout-builder__component--static">
            <component-adder class="cc-component-adder cc-component-adder--first">
                <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button" @click="createNewComponent( components.length + 1 )">
                    <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                        <use xlink:href="#icon_plus"></use>
                    </svg>
                </button>
            </component-adder>

            <div class="cc-layout-builder__component-wrapper">
                <div class="cc-component-placeholder__component cc-component-placeholder__component--decorated cc-component-placeholder__component--footer">
                    <svg class="cc-component-placeholder__component-icon">
                        <use xlink:href="#icon_component-cc-footer"></use>
                    </svg>
                </div>
            </div>
        </div>
    </div>`,
    /**
     * Get dependencies
     */
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
        'component-display-controller': componentDisplayController,
        'component-placeholder': componentPlaceholder,
        'brand-carousel-preview': brandCarouselPreview,
        'button-preview': buttonPreview,
        'category-links-preview': categoryLinksPreview,
        'cms-teaser-preview': cmsPagesTeaserPreview,
        'custom-html-preview': customHtmlPreview,
        'daily-deal-teaser-preview': dailyDealTeaserPreview,
        'headline-preview': headlinePreview,
        'hero-carousel-preview': heroCarouselPreview,
        'image-teaser-preview': imageTeaserLegacyPreview,
        'image-teaser-2-preview': imageTeaserPreview,
        'magento-product-grid-teasers-preview': magentoProductGridTeasersPreview,
        'paragraph-preview': paragraphPreview,
        'product-carousel-preview': productCarouselPreview,
        'product-finder-preview': productFinderPreview,
        'product-grid-preview': productGridPreview,
        'separator-preview': separatorPreview,
        'static-cms-block-preview': staticBlockPreview,
        'icon-preview': iconPreview,
        'teaser-and-text-preview': teaserAndTextPreview,
    },
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: [String, Object, Array],
            default: '',
        },
        assetsSrc: {
            type: String,
            default: '',
        },
        ccConfig: {
            type: Object,
            default(): any {
                return {};
            },
        },
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
        /**
         * Initial component configuration encoded as JSON string.
         */
        componentsConfiguration: {
            type: String,
            default: '',
        },
        /**
         * Callback invoked when edit component button is clicked.
         * This function should take IComponentInformation and return changed version of it.
         * If callback returns falsy value then component isn't changed.
         */
        editComponent: {
            type: Function,
            default: (
                componentInfo: IComponentInformation
            ): IComponentInformation => componentInfo,
        },
        /**
         * Callback invoked when edit component button is clicked.
         * This function should return IComponentInformation.
         * If callback returns falsy value then component isn't added.
         */
        addComponent: {
            type: Function,
            default: (): IComponentInformation => undefined,
        },
        pageType: {
            type: String,
            default: 'cms_page_form.cms_page_form',
        },
    },
    data(): any {
        return {
            components: [],
            filters: {},
        };
    },
    computed: {
        ccSections: function (): object {
            const data: object = this.ccConfig.sections[this.pageType];
            return Object.keys(data).map(key => (<any>data)[key]);
        },
        specialComponents: function (): object {
            const data: object = this.ccConfig.special_components;
            return Object.keys(data).map(key => (<any>data)[key]);
        },
    },
    ready(): void {
        this.components = this.componentsConfiguration
            ? JSON.parse(this.componentsConfiguration)
            : [];
        this.filters =
            typeof Storage !== void 0 &&
                window.localStorage.getItem('ccFilters')
                ? JSON.parse(window.localStorage.getItem('ccFilters'))
                : this.ccConfig.filters;
        this.sortComponentsBySections();
        this.setupInitialDisplayProps();
        this.updateLayout();
    },
    methods: {
        /**
         * Returns components information currently stored within layout builder.
         * @return {IComponentInformation[]} Components information array.
         */
        getComponentInformation(): IComponentInformation[] {
            return JSON.parse(JSON.stringify(this.components));
        },
        /**
         * Uses localStorage to save current filters state within layout builder.
         */
        saveFiltersState(): any {
            if (typeof Storage !== void 0 && this.filters) {
                window.localStorage.setItem(
                    'ccFilters',
                    JSON.stringify(this.filters)
                );
            }
        },
        /**
         * Updates builders' layout
         */
        updateLayout(): void {
            this.$dispatch('layout-builder__update');
        },
        /**
         * Sets provided component information on current index in components array.
         * If component exists on given index then this compoennt will be inserted before it.
         * @param {number}                index         Component index in components array.
         * @param {IComponentInformation} componentInfo Component information.
         */
        addComponentInformation(
            index: number,
            componentInfo: IComponentInformation
        ): void {
            if (componentInfo) {
                if (
                    !componentInfo.data.hasOwnProperty('componentVisibility') &&
                    !this.getIsSpecialComponent(componentInfo.type)
                ) {
                    componentInfo.data.componentVisibility = {
                        mobile: true,
                        desktop: true,
                    };
                }
                this.components.splice(index, 0, componentInfo);
                this.setComponentsPlacementInfo();
                this.updateLayout();
            }
        },
        /**
         * Sets provided component information on current index in components array.
         * If component exists on given index then it will be overwritten.
         * @param {number}                index         Component index in components array.
         * @param {IComponentInformation} componentInfo Component information.
         */
        setComponentInformation(
            index: number,
            componentInfo: IComponentInformation
        ): void {
            if (componentInfo) {
                this.components.$set(index, componentInfo);
                this.setComponentsPlacementInfo();
                this.updateLayout();
            }
        },
        /**
         * Creates new component and adds it to a specified index.
         * This function calls callback specified by "add-component" property that
         * should return IComponentInformation.
         * If callback returns falsy value then component isn't added.
         * @param {number} index New component's index in components array.
         */
        createNewComponent(index: number): void {
            /**
             * To allow both sync and async set of new component data we call
             * provided handler with callback function.
             * If handler doesn't return component information then it can still
             * set it using given callback.
             */
            const componentInfo: IComponentInformation = this.addComponent(
                (asyncComponentInfo: IComponentInformation): void => {
                    this.addComponentInformation(index, asyncComponentInfo);
                }
            );
            this.addComponentInformation(index, componentInfo);
        },
        /**
         * Initializes edit mode of component.
         * This function invokes callback given by "edit-component" callback that
         * should take current IComponentInformation as param and return changed version of it.
         * If callback returns falsy value then component isn't changed.
         * @param {string} index: Component's index in array.
         */
        editComponentSettings(index: number): void {
            // Create a static, non-reactive copy of component data.
            let componentInfo: IComponentInformation = JSON.parse(
                JSON.stringify(this.components[index])
            );
            /**
             * To allow both sync and async set of new component data we call
             * provided handler with current component data and callback function.
             * If handler doesn't return component information then it can still
             * set it using given callback.
             */
            componentInfo = this.editComponent(
                componentInfo,
                (asyncComponentInfo: IComponentInformation): void => {
                    this.setComponentInformation(index, asyncComponentInfo);
                }
            );
            this.setComponentInformation(index, componentInfo);
        },
        /**
         * Moves component under given index up by swaping it with previous element.
         * @param {number} index Component's index in array.
         */
        moveComponentUp(index: number): void {
            if (index > 0) {
                let previousComponent: IComponentInformation = this.components[
                    index - 1
                ];
                const $thisComponent: any = $(`#${this.components[index].id}`);
                const $prevComponent: any = $(
                    `#${this.components[index - 1].id}`
                );

                $thisComponent
                    .addClass('cc-layout-builder__component--animating')
                    .css(
                        'transform',
                        `translateY(${-Math.abs(
                            $prevComponent.outerHeight(true)
                        )}px)`
                    );
                $prevComponent
                    .addClass('cc-layout-builder__component--animating')
                    .css(
                        'transform',
                        `translateY(${$thisComponent.outerHeight(true)}px)`
                    );

                setTimeout((): void => {
                    this.components.$set(index - 1, this.components[index]);
                    this.components.$set(index, previousComponent);
                    this.setComponentsPlacementInfo();
                    this.updateLayout();
                    $thisComponent
                        .removeClass('cc-layout-builder__component--animating')
                        .css('transform', '');
                    $prevComponent
                        .removeClass('cc-layout-builder__component--animating')
                        .css('transform', '');
                }, 400);
            }
        },
        /**
         * Moves component under given index down by swaping it with next element.
         * @param {number} index Component's index in array.
         */
        moveComponentDown(index: number): void {
            if (index < this.components.length - 1) {
                let previousComponent: IComponentInformation = this.components[
                    index + 1
                ];
                const $thisComponent: any = $(`#${this.components[index].id}`);
                const $nextComponent: any = $(
                    `#${this.components[index + 1].id}`
                );

                $thisComponent
                    .addClass('cc-layout-builder__component--animating')
                    .css(
                        'transform',
                        `translateY(${$nextComponent.outerHeight(true)}px)`
                    );
                $nextComponent
                    .addClass('cc-layout-builder__component--animating')
                    .css(
                        'transform',
                        `translateY(${-Math.abs(
                            $thisComponent.outerHeight(true)
                        )}px)`
                    );

                setTimeout((): void => {
                    this.components.$set(index + 1, this.components[index]);
                    this.components.$set(index, previousComponent);
                    this.setComponentsPlacementInfo();
                    this.updateLayout();
                    $thisComponent
                        .removeClass('cc-layout-builder__component--animating')
                        .css('transform', '');
                    $nextComponent
                        .removeClass('cc-layout-builder__component--animating')
                        .css('transform', '');
                }, 400);
            }
        },
        /**
         * Duplicates component under given index and place it below the original one.
         * @param {number} index Original component's index in array.
         */
        duplicateComponent(index: number): void {
            let duplicate: IComponentInformation = JSON.parse(
                JSON.stringify(this.components[index])
            );
            duplicate.id = `${duplicate.id}_duplicate`;
            this.addComponentInformation(index + 1, duplicate);

            this.$nextTick(
                (): void => {
                    const $origin: JQuery = $(`#${this.components[index].id}`);
                    const $duplicate: JQuery = $(`#${duplicate.id}`);

                    $duplicate.addClass(
                        'cc-layout-builder__component--duplicate cc-layout-builder__component--show-up'
                    );

                    setTimeout((): void => {
                        $duplicate.removeClass(
                            'cc-layout-builder__component--show-up'
                        );

                        $('html, body').animate(
                            {
                                scrollTop:
                                    $origin.offset().top +
                                    $origin.outerHeight(true) -
                                    150,
                            },
                            350,
                            'swing'
                        );
                    }, 10);

                    setTimeout((): void => {
                        $duplicate.removeClass(
                            'cc-layout-builder__component--duplicate'
                        );
                    }, 800);
                }
            );
        },
        /**
         * Goes through all components and assigns section.
         * F.e. CC on category has 3 sections (top, grid [magento, not editable], and bottom)
         * In this example this methods sets TOP for all components that are above special component dedicated for category page, GRID for special component and BOTTOM for all components under.
         */
        setComponentsPlacementInfo(): any {
            if (this.ccSections.length > 1) {
                let sectionIndex: number = 0;

                for (let i: number = 0; i < this.components.length; i++) {
                    if (
                        this.specialComponents.indexOf(
                            this.components[i].type
                        ) !== -1
                    ) {
                        sectionIndex++;
                        this.components[i].section = this.ccSections[
                            sectionIndex
                        ];
                        sectionIndex++;
                    } else {
                        this.components[i].section = this.ccSections[
                            sectionIndex
                        ];
                    }
                }
            }
        },
        /**
         * Sorts components by their sections.
         * Order is defined by this.ccSections
         */
        sortComponentsBySections(): void {
            if (this.components.length && this.ccSections.length > 1) {
                this.components.sort(
                    (a: any, b: any): any => {
                        return (
                            this.ccSections.indexOf(a.section) -
                            this.ccSections.indexOf(b.section)
                        );
                    }
                );
            }
        },
        /**
         * Backwards compatibility enhancement
         * When components doesn't have {componentVisibility} object set - add defaults once
         * Special Components will not be modified
         */
        setupInitialDisplayProps(): void {
            for (let i: number = 0; i < this.components.length; i++) {
                const c: any = this.components[i];

                if (
                    !c.data.hasOwnProperty('componentVisibility') &&
                    !this.getIsSpecialComponent(c.type)
                ) {
                    let componentInfo: any = $.extend(true, {}, c, {
                        data: {
                            componentVisibility: {
                                mobile: true,
                                desktop: true,
                            },
                        },
                    });

                    this.setComponentInformation(i, componentInfo);
                }
            }
        },
        /**
         * Tells if component with given index is the first component.
         * @param  {number}  index Index of the component.
         * @return {boolean}       If component is first in array.
         */
        isFirstComponent(index: number): boolean {
            return index === 0;
        },
        /**
         * Tells if component with given index is the last component.
         * @param  {number}  index Index of the component.
         * @return {boolean}       If component is last in array.
         */
        isLastComponent(index: number): boolean {
            return index === this.components.length - 1;
        },

        transformComponentTypeToText(componentType: string): string {
            return componentType
                .replace(/\-+/g, ' ')
                .replace(/[0-9]+/g, '')
                .trim();
        },

        /**
         * Checks if component is integrated and dependant of Magento.
         * In this case some operations like duplicate/remove are not allowed
         * @param  {string}  componentType type of component.
         * @return {boolean}
         */
        getIsSpecialComponent(componentType: string): boolean {
            return this.specialComponents.indexOf(componentType) !== -1;
        },

        /**
         * Checks if component can be edited.
         * Components that doesn't provide any configurators cannot be edited.
         * @param  {string}  componentType type of component.
         * @return {boolean}
         */
        isPossibleToEdit(componentType: string): boolean {
            return (
                componentType !== 'brand-carousel' &&
                componentType !== 'separator'
            );
        },

        /**
         * Checks if it's possible to delete component.
         * For now we only disallow removal of special components so I just call getIsSpecialComponent
         * In the future there might be a need to iterate it, this is why it's separate method
         * @param  {string}  componentType type of component.
         * @return {boolean}
         */
        isPossibleToDelete(componentType: string): boolean {
            return !this.getIsSpecialComponent(componentType);
        },

        /**
         * Checks if it's possible to duplicate component.
         * @param  {string}  componentType type of component.
         * @return {boolean}
         */
        isPossibleToDuplicate(componentType: string): boolean {
            return (
                !this.getIsSpecialComponent(componentType) &&
                componentType !== 'paragraph'
            );
        },

        /**
         * FE mobile/desktop visibility cannot be controlled for Built-in components into magento core functionality
         * @param  {string}  componentType type of component.
         * @return {boolean}
         */
        isPossibleToControlDisplay(componentType: string): boolean {
            return (
                !this.getIsSpecialComponent(componentType) &&
                componentType !== 'custom-html'
            );
        },

        /**
         * Tells to builder if component is set to be hidden on both: mobile & desktop
         * It's needed to grey-out this component on the dashboard
         * @param {Object} Component's data information.
         * @return {boolean}
         */
        getIsComponentHiddenFE(componentData: any): boolean {
            if (componentData.hasOwnProperty('componentVisibility')) {
                return (
                    (!componentData.componentVisibility.mobile ||
                        componentData.componentVisibility.mobile === '') &&
                    (!componentData.componentVisibility.desktop ||
                        componentData.componentVisibility.desktop === '')
                );
            }

            return false;
        },

        /**
         * Tells if component is filtered-out or not in dashboard.
         * It's needed to show it or hide it based on current filter setup
         * @param {Object} Component's data information.
         * @return {boolean}
         */
        getIsComponentVisibleDashboard(componentData: any): boolean {
            if (
                componentData.hasOwnProperty('componentVisibility') &&
                this.filters
            ) {
                let visibleMobile: boolean =
                    componentData.componentVisibility.mobile !== '' &&
                    componentData.componentVisibility.mobile !== false;
                let visibleDesktop: boolean =
                    componentData.componentVisibility.desktop !== '' &&
                    componentData.componentVisibility.desktop !== false;

                if (
                    this.filters.component_visibility.options.mobile.value &&
                    visibleMobile
                ) {
                    return true;
                }

                if (
                    this.filters.component_visibility.options.desktop.value &&
                    visibleDesktop
                ) {
                    return true;
                }

                if (
                    this.filters.component_visibility.options.none.value &&
                    !visibleMobile &&
                    !visibleDesktop
                ) {
                    return true;
                }

                return false;
            }

            return true;
        },
        /* Removes component from M2C
         * If it's paragraph that is about to be removed, asks if corresponding CMS Block shall be removed as well
         * @param index {number} - index of the component in layoutBuilder
         */
        deleteComponent(index: number): void {
            const builder: any = this;

            confirm({
                content: $t('Are you sure you want to delete this item?'),
                actions: {
                    confirm(): void {
                        const component: any = builder.components[index];
                        builder.components.splice(index, 1);

                        if (component.type === 'paragraph') {
                            builder.deleteStaticBlock(component.data.blockId);
                        }

                        builder.$dispatch('layout-builder__update');
                    },
                },
            });
        },

        deleteStaticBlock(cmsBlockId: string): void {
            const component: any = this;

            confirm({
                content: $t(
                    'Would you like to delete CMS Block related to this component (CMS Block ID: %s) ?'
                ).replace('%s', cmsBlockId),
                actions: {
                    confirm(): void {
                        component.$dispatch(
                            'layout-builder__cmsblock-delete-request',
                            cmsBlockId
                        );
                    },
                },
            });
        },

        getTranslatedText(originalText: string): string {
            return $t(originalText);
        },
    },
};

export default layoutBuilder;
export { layoutBuilder, IComponentInformation };