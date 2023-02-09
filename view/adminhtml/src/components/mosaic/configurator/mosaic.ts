import $ from 'jquery';
import confirm from 'Magento_Ui/js/modal/confirm';

import imageTeaserConfigurator from '../../image-teaser/configurator/image-teaser';
import {
    default as teaserConfigurator,
    teaserPrototype as teaserItemPrototype,
} from '../../_teaser/configurator/teaser';

/**
 * Mosaic configurator component.
 * This component is responsible for displaying Mosaic component configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const mosaicConfigurator: vuejs.ComponentOption = {
    extends: imageTeaserConfigurator,
    template: `<div class="cc-image-teaser-configurator cc-image-teaser-configurator--mosaic {{ classes }} | {{ mix }}" {{ attributes }}>
        <section class="cc-image-teaser-configurator__section">
            <h3 class="cc-image-teaser-configurator__subtitle">Teaser Width</h3>
            <p class="cc-image-teaser-configurator__section-error" v-if="configuration.scenario.teaserWidth.error">{{configuration.scenario.teaserWidth.error}}</p>
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
            <h3 class="cc-image-teaser-configurator__subtitle">Proportions</h3>
            <p class="cc-image-teaser-configurator__section-error" v-if="configuration.scenario.proportions.error">{{configuration.scenario.proportions.error}}</p>
            <div class="cc-image-teaser-configurator__scenario-options">
                <div
                    :class="{
                        'cc-image-teaser-configurator__option--selected': configuration.scenario.proportions.id == optionId,
                        'cc-image-teaser-configurator__option--disabled': option.disabled,
                    }"
                    class="cc-image-teaser-configurator__option"
                    v-for="(optionId, option) in scenarioOptions.proportions"
                    @click="!option.disabled && toggleOption('proportions', optionId)">
                    <div class="cc-image-teaser-configurator__option-wrapper">
                        <svg class="cc-image-teaser-configurator__option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                </div>
            </div>
        </section>

        <section class="cc-image-teaser-configurator__section" v-show="!ccConfig.mosaic.support_breakpoint_dedicated_images">
            <h3 class="cc-image-teaser-configurator__subtitle">Text Positioning</h3>
            <p class="cc-image-teaser-configurator__section-error" v-if="configuration.scenario.contentPlacement.error">{{configuration.scenario.contentPlacement.error}}</p>
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

        <section class="cc-image-teaser-configurator__section cc-image-teaser-configurator__section--{{section.label | sectionID}}" v-if="ccConfig.image_teaser != null && ccConfig.image_teaser.custom_sections != null" v-for="section in ccConfig.image_teaser.custom_sections">
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

        <teaser-configurator :class="cc-teaser-configurator--image-teaser" :teaser-index="0" :configuration="items[0]" :parent-configuration="configuration" :uploader-base-url="uploaderBaseUrl" :image-endpoint="imageEndpoint" :admin-prefix="adminPrefix" :cc-config="ccConfig" :caller-component-type="'mosaic'" :video-teaser-placeholder-error="invalidVideoPlaceholderTeaserIndexes.indexOf(0) != -1"></teaser-configurator>

        <teaser-configurator :class="cc-teaser-configurator--image-teaser" :teaser-index="1" :configuration="items[1]" :parent-configuration="configuration" :uploader-base-url="uploaderBaseUrl" :image-endpoint="imageEndpoint" :admin-prefix="adminPrefix" :cc-config="ccConfig" :caller-component-type="'mosaic'" :video-teaser-placeholder-error="invalidVideoPlaceholderTeaserIndexes.indexOf(1) != -1"></teaser-configurator>

    </div>`,
    props: {
        /**
         * Image teaser configuration
         */
        configuration: {
            type: Object,
            default(): object {
                return {
                    customCssClass: '',
                    items: [
                        JSON.parse(JSON.stringify(teaserItemPrototype)),
                        JSON.parse(JSON.stringify(teaserItemPrototype)),
                    ],
                    ignoredItems: [],
                    scenario: {
                        teaserWidth: {},
                        proportions: {},
                        contentPlacement: {},
                        desktopLayout: {
                            id: '2',
                        },
                        mobileLayout: {
                            id: 'mobile-in-columns',
                        },
                    },
                };
            },
        },
    },
    ready(): void {
        this.scenarioOptions = {
            // Teaser width scenario elements
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
            },

            // Proportions
            proportions: {
                '1': {
                    name: '',
                    iconId: 'proportion_1',
                    disabled: false,
                },
                '2': {
                    name: '',
                    iconId: 'proportion_2',
                    disabled: false,
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
        };

        this.togglePossibleOptions = function () {
            return true;
        }
    },
    events: {
        'teaser__deleteItem'(index: number): void {
            this.deleteTeaserItem(index);
        },
    },
    methods: {
        /* Teaser component removes teaser item after Delete button is clicked
         * In this case we only reset configuration.item props to defaults because we need 2 items in this component. Not more, not less.
         * @param index {number} - index of teaser item to remove
         */
        deleteTeaserItem(index: number): void {
            const component: any = this;

            confirm({
                content: $.mage.__(
                    'Are you sure you want to delete this item?'
                ),
                actions: {
                    confirm(): void {
                        component.$set(
                            `configuration.items[${index}]`,
                            JSON.parse(JSON.stringify(teaserItemPrototype))
                        );
                    },
                },
            });
        }
    }
};

export default mosaicConfigurator;
