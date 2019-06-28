import $ from 'jquery';
import alert from 'Magento_Ui/js/modal/alert';

import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';
import componentAdder from '../../../utils/component-adder/component-adder';

import {
    default as teaserConfigurator,
    teaserPrototype as teaserItemPrototype,
} from '../../_teaser/configurator/teaser';

import componentConfigurator from '../../_component-configurator/component-configurator';

import customElementTextInput from '../../_custom-elements/text-input';
import customElementSelect from '../../_custom-elements/select';
import customElementTextarea from '../../_custom-elements/textarea';
import customElementCheckbox from '../../_custom-elements/checkbox';
import customElementRadio from '../../_custom-elements/radio';
import customElementPosition from '../../_custom-elements/position-grid';

/**
 * Image teaser configurator component.
 * This component is responsible for displaying image teaser's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const imageTeaserConfigurator: vuejs.ComponentOption = {
    mixins: [componentConfigurator],
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
        'teaser-configurator': teaserConfigurator,
        'custom-element-input': customElementTextInput,
        'custom-element-select': customElementSelect,
        'custom-element-textarea': customElementTextarea,
        'custom-element-checkbox': customElementCheckbox,
        'custom-element-radio': customElementRadio,
        'custom-element-position': customElementPosition,
    },
    template: `<div class="cc-image-teaser-configurator {{ classes }} | {{ mix }}" {{ attributes }}>
        <section class="cc-image-teaser-configurator__section">
            <h3 class="cc-image-teaser-configurator__subtitle">Teaser Width</h3>
            <div class="cc-image-teaser-configurator__scenario-options">
                <div
                    :class="{
                        'cc-image-teaser-configurator__option--selected': configuration.scenario.teaserWidth.id == optionId,
                        'cc-image-teaser-configurator__option--disabled': option.disabled,
                    }"
                    class="cc-image-teaser-configurator__option"
                    v-for="(optionId, option) in scenarioOptions.teaserWidth"
                    @click="!option.disabled && toggleOption('teaserWidth', optionId)">
                    <div class="cc-image-teaser-configurator__option-wrapper">
                        <svg class="cc-image-teaser-configurator__option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                    <p class="cc-image-teaser-configurator__option-name">
                        {{ option.name }}
                    </p>
                </div>
            </div>

        </section>
        <section class="cc-image-teaser-configurator__section">
            <h3 class="cc-image-teaser-configurator__subtitle">Desktop and Tablet Layout</h3>
            <div class="cc-image-teaser-configurator__scenario-options">
                <div
                    :class="{
                        'cc-image-teaser-configurator__option--selected': configuration.scenario.desktopLayout.id == optionId,
                        'cc-image-teaser-configurator__option--disabled': option.disabled,
                    }"
                    class="cc-image-teaser-configurator__option"
                    v-for="(optionId, option) in scenarioOptions.desktopLayout"
                    @click="!option.disabled && toggleOption('desktopLayout', optionId)">
                    <div class="cc-image-teaser-configurator__option-wrapper">
                        <svg class="cc-image-teaser-configurator__option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                    <p class="cc-image-teaser-configurator__option-name">
                        {{ option.name }}
                    </p>
                </div>
            </div>
        </section>
        <section class="cc-image-teaser-configurator__section">
            <h3 class="cc-image-teaser-configurator__subtitle">Mobile Layout</h3>
            <div class="cc-image-teaser-configurator__scenario-options">
                <div
                    :class="{
                        'cc-image-teaser-configurator__option--selected': configuration.scenario.mobileLayout.id == optionId,
                        'cc-image-teaser-configurator__option--disabled': option.disabled,
                    }"
                    class="cc-image-teaser-configurator__option"
                    v-for="(optionId, option) in scenarioOptions.mobileLayout"
                    @click="!option.disabled && toggleOption('mobileLayout', optionId)">
                    <div class="cc-image-teaser-configurator__option-wrapper">
                        <svg class="cc-image-teaser-configurator__option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                    <p class="cc-image-teaser-configurator__option-name">
                        {{ option.name }}
                    </p>
                </div>
            </div>
        </section>
        <section class="cc-image-teaser-configurator__section">
            <h3 class="cc-image-teaser-configurator__subtitle">Text Positioning</h3>
            <div class="cc-image-teaser-configurator__scenario-options">
                <div
                    :class="{
                        'cc-image-teaser-configurator__option--selected': configuration.scenario.contentPlacement.id == optionId,
                        'cc-image-teaser-configurator__option--disabled': option.disabled,
                    }"
                    class="cc-image-teaser-configurator__option"
                    v-for="(optionId, option) in scenarioOptions.contentPlacement"
                    @click="!option.disabled && toggleOption('contentPlacement', optionId)">
                    <div class="cc-image-teaser-configurator__option-wrapper">
                        <svg class="cc-image-teaser-configurator__option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                    <p class="cc-image-teaser-configurator__option-name">
                        {{ option.name }}
                    </p>
                </div>
            </div>
        </section>

        <section class="cc-image-teaser-configurator__section" v-for="section in ccConfig.image_teaser.custom_sections">
            <h3 class="cc-image-teaser-configurator__subtitle" v-if="section.label">{{section.label | translate}}</h3>
            <div class="cc-custom-fields">
                <div class="cc-custom-fields__form-group" v-for="field in section.content.fields">
                    <component 
                        :is="'custom-element-' + field.type" 
                        :configuration="configuration" 
                        :field-configuration="field" 
                        :teaser-index="9999"
                    ></component>
                </div>
            </div>
        </section>

        <section class="cc-image-teaser-configurator__section">
            <component-adder class="cc-component-adder cc-component-adder--static" v-show="!configuration.items.length">
                <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-component-adder__button | cc-image-teaser-configurator__item-action-button" @click="createTeaserItem( 0 )">
                    <svg class="cc-action-button__icon cc-action-button__icon--size_100 | cc-component-adder__button-icon">
                        <use v-bind="{ 'xlink:href': '#icon_plus' }"></use>
                    </svg>
                </button>
            </component-adder>

            <template v-for="item in configuration.items">
                <div class="cc-image-teaser-configurator__item" id="cc-image-teaser-item-{{ $index }}">
                    <component-adder class="cc-component-adder cc-component-adder--first">
                        <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-image-teaser-configurator__item-action-button" @click="createTeaserItem( $index )">
                            <svg class="cc-action-button__icon cc-action-button__icon--size_300">
                                <use xlink:href="#icon_plus"></use>
                            </svg>
                        </button>
                    </component-adder>

                    <teaser-configurator :class="cc-teaser-configurator--image-teaser" :teaser-index="$index" :configuration="items[$index]" :parent-configuration="configuration" :uploader-base-url="uploaderBaseUrl" :image-endpoint="imageEndpoint" :admin-prefix="adminPrefix" :cc-config="ccConfig" :caller-component-type="image-teaser"></teaser-configurator>

                    <component-adder class="cc-component-adder cc-component-adder--last" v-if="configuration.items.length">
                        <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-image-teaser-configurator__item-action-button" @click="createTeaserItem( $index + 1 )">
                            <svg class="cc-action-button__icon cc-action-button__icon--size_300">
                                <use xlink:href="#icon_plus"></use>
                            </svg>
                        </button>
                    </component-adder>
                </div>
            </template>
        </section>
    </div>`,
    data(): any {
        return {
            scenarioOptions: {
                // Teaser width scenario elements.
                teaserWidth: {
                    container: {
                        name: 'Content width',
                        iconId: 'tw_content-width',
                        disabled: false,
                    },
                    window: {
                        name: 'Browser width',
                        iconId: 'tw_window-width',
                        disabled: false,
                    },
                    'container-slider': {
                        name: 'Content width Slider',
                        iconId: 'tw_content-slider',
                        disabled: false,
                    },
                    'window-slider': {
                        name: 'Browser width Slider',
                        iconId: 'tw_window-slider',
                        disabled: false,
                    },
                },
                // Desktop layout scenario elements.
                desktopLayout: {
                    '1': {
                        name: '1 in row',
                        iconId: 'dl_1',
                        disabled: false,
                        teasersNum: 1,
                    },
                    '2': {
                        name: '2 in row',
                        iconId: 'dl_2',
                        disabled: false,
                        teasersNum: 2,
                    },
                    '3': {
                        name: '3 in row',
                        iconId: 'dl_3',
                        disabled: false,
                        teasersNum: 3,
                    },
                    '4': {
                        name: '4 in row',
                        iconId: 'dl_4',
                        disabled: false,
                        teasersNum: 4,
                    },
                },
                // Text positioning scenario elements.
                contentPlacement: {
                    over: {
                        name: 'Text over image',
                        iconId: 'tl_over',
                        disabled: false,
                        contentPlacement: true,
                    },
                    under: {
                        name: 'Text below image',
                        iconId: 'tl_under',
                        disabled: false,
                        contentPlacement: false,
                    },
                },

                // Mobile layout scenario elements.
                mobileLayout: {
                    // 'mobile-large': {
                    //     name: 'Large teaser',
                    //     iconId: 'ml_col',
                    //     disabled: false,
                    // },
                    'mobile-in-columns': {
                        name: 'Teasers in column',
                        iconId: 'ml_col',
                        disabled: false,
                    },
                    'mobile-slider': {
                        name: 'Slider',
                        iconId: 'ml_slider',
                        disabled: false,
                    },
                    'mobile-in-row': {
                        name: 'Teasers in row',
                        iconId: 'ml_2-2',
                        disabled: false,
                    },
                },
            },
            availableScenarios: [
                ['container', '1', 'over', ['mobile-in-columns']],

                [
                    'container',
                    '2',
                    'over',
                    ['mobile-in-columns', 'mobile-in-row', 'mobile-slider'],
                ],
                ['container', '2', 'under', ['mobile-in-columns']],

                [
                    'container',
                    '3',
                    'over',
                    ['mobile-in-columns', 'mobile-slider'],
                ],
                ['container', '3', 'under', ['mobile-in-columns']],

                ['container', '4', 'over', ['mobile-slider']],
                ['container', '4', 'under', ['mobile-in-columns']],

                ['window', '1', 'over', ['mobile-in-columns']],

                [
                    'window',
                    '2',
                    'over',
                    ['mobile-in-columns', 'mobile-in-row', 'mobile-slider'],
                ],
                ['window', '2', 'under', ['mobile-in-columns']],

                ['window', '3', 'over', ['mobile-in-columns', 'mobile-slider']],
                ['window', '3', 'under', ['mobile-in-columns']],

                ['window', '4', 'over', ['mobile-slider']],
                ['window', '4', 'under', ['mobile-in-columns']],

                ['window-slider', '2', 'over', ['mobile-slider']],
                ['window-slider', '2', 'under', ['mobile-slider']],

                ['window-slider', '3', 'over', ['mobile-slider']],
                ['window-slider', '3', 'under', ['mobile-slider']],

                ['window-slider', '4', 'over', ['mobile-slider']],
                ['window-slider', '4', 'under', ['mobile-slider']],

                ['container-slider', '1', 'over', ['mobile-slider']],

                ['container-slider', '2', 'over', ['mobile-slider']],
                ['container-slider', '2', 'under', ['mobile-slider']],

                ['container-slider', '3', 'over', ['mobile-slider']],
                ['container-slider', '3', 'under', ['mobile-slider']],

                ['container-slider', '4', 'over', ['mobile-slider']],
                ['container-slider', '4', 'under', ['mobile-slider']],
            ],
        };
    },
    props: {
        /**
         * Image teaser configuration
         */
        configuration: {
            type: Object,
            default(): object {
                return {
                    customCssClass: '',
                    items: [JSON.parse(JSON.stringify(teaserItemPrototype))],
                    ignoredItems: [],
                    scenario: {
                        teaserWidth: {},
                        desktopLayout: {},
                        contentPlacement: {},
                        mobileLayout: {},
                    },
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
        imageTeasersContentPositions: function (): object {
            const data: object = this.ccConfig.image_teasers_content_positions;
            return Object.keys(data).map(key => (data as any)[key]);
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            this._collectTeasersCssClasses();
            this._collectComponentCssClasses();
            this.onSave();
        },
    },
    filters: {
        /**
         * Two-way filter for step content displaing in textarea and keeping in configuration.
         */
        prettify: {
            /**
             * Displays stringified JSON in textarea if not step is not stringified yet.
             *  If step is already stringified because it couldn't be saved, just return back what came in.
             * @param stepContent {string} - content of textarea
             * @param stepIndex {number} - index of a single step
             * @return {String} - Stringified JSON of given step
             */
            read(stepContent: string, stepIndex: number): string {
                return JSON.stringify(stepContent, null, 2);
            },
            /**
             * Tests if step content provided in textarea can be JSON.parsed.
             *  If yes - saves in component's configuration and removes step error if there was any.
             *  If not - obtains error message and passes it to setError method. Returns what came in.
             * @param newStepContent {string} - current content of textarea
             * @param oldStepContent {string} - content of textarea in state it was before change was made
             * @param stepIndex {number} - index of a single step
             * @return {JSON, String} - if string can be parsed to JSON, returns JSON, otherwise String
             */
            write(
                newStepContent: string,
                oldStepContent: string,
                stepIndex: number
            ): any {
                let result: any;

                try {
                    result = JSON.parse(newStepContent);
                } catch (err) {
                    if (err.hasOwnProperty('message')) {
                        alert(`Error in teaser ${stepIndex}: ${err.message}`);
                    }
                }

                if (result) {
                    return result;
                }

                return newStepContent;
            },
        },
        /**
         * Translates given string
         * @param txt {string} - original, english string to be translated
         * @return {string} - translated string
         */
        translate(txt: string): string {
            return $.mage.__(txt);
        },
    },
    methods: {
        _collectPossibleOptions(filteredScenarios: any[][]): any {
            const teaserWidthIndex: number = 0;
            const desktopLayoutIndex: number = 1;
            const contentPlacementIndex: number = 2;
            const mobileLayoutIndex: number = 3;
            const possibleOptions: any = {
                teaserWidth: {},
                desktopLayout: {},
                contentPlacement: {},
                mobileLayout: {},
            };

            filteredScenarios.forEach((filteredScenario: any[]) => {
                possibleOptions.teaserWidth[
                    filteredScenario[teaserWidthIndex]
                ] = true;
                possibleOptions.desktopLayout[
                    filteredScenario[desktopLayoutIndex]
                ] = true;
                possibleOptions.contentPlacement[
                    filteredScenario[contentPlacementIndex]
                ] = true;
                filteredScenario[mobileLayoutIndex].forEach(
                    (mobileLayout: string) => {
                        possibleOptions.mobileLayout[mobileLayout] = true;
                    }
                );
            });

            Object.keys(possibleOptions).forEach(
                (scenarioElement: string): void => {
                    possibleOptions[scenarioElement] = Object.keys(
                        possibleOptions[scenarioElement]
                    );
                }
            );

            return possibleOptions;
        },

        _findPossibleOptions(
            teaserWidth: string,
            desktopLayout: string,
            contentPlacement: string,
            mobileLayout: string
        ): void {
            const teaserWidthIndex: number = 0;
            const desktopLayoutIndex: number = 1;
            const contentPlacementIndex: number = 2;
            const mobileLayoutIndex: number = 3;
            // Make a copy of available scenarios to prevent reference copying.
            let filteredScenarios: string[][] = JSON.parse(
                JSON.stringify(this.availableScenarios)
            );

            if (teaserWidth) {
                filteredScenarios = filteredScenarios.filter(
                    (availableScenario: any) => {
                        return (
                            availableScenario[teaserWidthIndex] === teaserWidth
                        );
                    }
                );
            }

            if (desktopLayout) {
                filteredScenarios = filteredScenarios.filter(
                    (availableScenario: any) => {
                        return (
                            availableScenario[desktopLayoutIndex] ===
                            desktopLayout
                        );
                    }
                );
            }

            if (contentPlacement) {
                filteredScenarios = filteredScenarios.filter(
                    (availableScenario: any) => {
                        return (
                            !contentPlacement ||
                            availableScenario[contentPlacementIndex] ===
                            contentPlacement
                        );
                    }
                );
            }

            if (mobileLayout) {
                filteredScenarios = filteredScenarios.filter(
                    (availableScenario: any) => {
                        return (
                            availableScenario[mobileLayoutIndex].indexOf(
                                mobileLayout
                            ) !== -1
                        );
                    }
                );
                filteredScenarios = filteredScenarios.map(
                    (availableScenario: any) => {
                        availableScenario[mobileLayoutIndex] = [mobileLayout];
                        return availableScenario;
                    }
                );
            }

            return this._collectPossibleOptions(filteredScenarios);
        },

        toggleOption(optionCategory: string, optionId: string): void {
            if (this.configuration.scenario[optionCategory].id) {
                this.configuration.scenario[optionCategory] = {};
            } else {
                this.configuration.scenario[
                    optionCategory
                ] = this.scenarioOptions[optionCategory][optionId];
                this.configuration.scenario[optionCategory].id = optionId;
            }

            this.togglePossibleOptions();
        },

        togglePossibleOptions(): void {
            const scenario: any = this.configuration.scenario;
            const possibleOptions: any = this._findPossibleOptions(
                scenario.teaserWidth.id,
                scenario.desktopLayout.id,
                scenario.contentPlacement.id,
                scenario.mobileLayout.id
            );

            Object.keys(this.scenarioOptions).forEach(
                (optionCategory: string) => {
                    Object.keys(this.scenarioOptions[optionCategory]).forEach(
                        (scenarioOptionId: string) => {
                            this.scenarioOptions[optionCategory][
                                scenarioOptionId
                            ].disabled =
                                possibleOptions[optionCategory].indexOf(
                                    scenarioOptionId
                                ) === -1;
                        }
                    );
                }
            );
        },

        /* Creates another teaser item using teaserItemPrototype */
        createTeaserItem(index: number): void {
            this.configuration.items.splice(
                index,
                0,
                JSON.parse(JSON.stringify(teaserItemPrototype))
            );
            this.onChange();
        },
        /* Cleans configuration for M2C content constructor after Saving component
         * All empty teaser items has to be removed to not get into configuration object
         */
        cleanupConfiguration(): void {
            this.configuration.items = this.configuration.items.filter(
                (item: any): any => item.image.raw !== ''
            );
            this.configuration.ignoredItems = this.configuration.ignoredItems.filter(
                (item: any): any => item.image.raw !== ''
            );
            this.onChange();
        },

        _getCustomCssFields(source: object): Array<any> {
            const cssClassFields: Array<any> = [];

            Object.keys(source).forEach(
                (tabKey: string) => {
                    if (
                        typeof source[tabKey].content !== 'string' && 
                        source[tabKey].content.fields != null
                    ) {
                        Object.keys(source[tabKey].content.fields).forEach(
                            (fieldKey: string) => {
                                if (source[tabKey].content.fields[fieldKey].frontend_type === 'css_class') {
                                    cssClassFields.push(source[tabKey].content.fields[fieldKey].model);
                                }
                            }
                        );
                    }
                }
            );

            return cssClassFields;
        },

        _collectTeasersCssClasses(): void {
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
        },

        _collectComponentCssClasses(): void {
            const cssClassFields: Array<any> = this._getCustomCssFields(this.ccConfig.image_teaser.custom_sections);
            const cssClasses: Array<string> = [];

            cssClassFields.forEach(
                (model: string) => {
                    if (this.configuration[model] && typeof this.configuration[model] === 'string') {
                        cssClasses.push(this.configuration[model]);
                    }
                }
            );

            this.configuration.cc_css_classes = cssClasses.join(' ');
        },

        /*
         * Backward compatibility enhancement.
         * When new props are added to the 'configuration' prop, none of already saved component has it.
         * This leads to backward compatibility issues and JS errors for existing components
         * This method takes defaults of 'configuration' and merges is with exising configuration object
         */
        updateConfigurationProp(): void {
            const propDefaults: Object = this.$options.props.configuration.default();
            this.configuration = $.extend({}, propDefaults, this.configuration, true);
        }
    },
    ready(): void {
        this.togglePossibleOptions();
        this.updateConfigurationProp();
    },
};

export default imageTeaserConfigurator;
