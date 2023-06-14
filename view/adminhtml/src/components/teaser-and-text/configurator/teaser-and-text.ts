import imageTeaserConfigurator from '../../image-teaser/configurator/image-teaser';
import {
    default as teaserConfigurator,
    teaserPrototype as teaserItemPrototype,
} from '../../_teaser/configurator/teaser';

/**
 * Teaser and text configurator component.
 * This component is responsible for displaying image teaser-and-text configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const teaserAndTextConfigurator: vuejs.ComponentOption = {
    extends: imageTeaserConfigurator,
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
            <h3 class="cc-image-teaser-configurator__subtitle">Mobile Order</h3>
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

        <section class="cc-image-teaser-configurator__section cc-image-teaser-configurator__section--{{section.label | sectionID}}" v-if="ccConfig.teaser_and_text != null && ccConfig.teaser_and_text.custom_sections != null" v-for="section in ccConfig.teaser_and_text.custom_sections">
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

        <section class="cc-image-teaser-configurator__section cc-image-teaser-configurator__section--2-columns">
            <div class="cc-image-teaser-configurator__item cc-image-teaser-configurator__item--column" id="cc-image-teaser-item-0">
                <teaser-configurator :class="cc-teaser-configurator--image-teaser" :teaser-index="0" :configuration="items[0]" :parent-configuration="configuration" :uploader-base-url="uploaderBaseUrl" :image-endpoint="imageEndpoint" :admin-prefix="adminPrefix" :cc-config="ccConfig" :caller-component-type="'teaser-and-text'" configurator-layout="column" :video-teaser-placeholder-error="invalidVideoPlaceholderTeaserIndexes.indexOf(0) != -1"></teaser-configurator>
            </div>
            <div class="cc-image-teaser-configurator__item cc-image-teaser-configurator__item--column" id="cc-image-teaser-item-1">
                <teaser-configurator :class="cc-teaser-configurator--image-teaser" :teaser-index="1" :configuration="items[1]" :parent-configuration="configuration" :uploader-base-url="uploaderBaseUrl" :image-endpoint="imageEndpoint" :admin-prefix="adminPrefix" :cc-config="ccConfig" :caller-component-type="'teaser-and-text'" configurator-layout="column" :teaser-type="'text-only'" :video-teaser-placeholder-error="invalidVideoPlaceholderTeaserIndexes.indexOf(1) != -1"></teaser-configurator>
            </div>
        </section>
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
                    items: [JSON.parse(JSON.stringify(teaserItemPrototype)), JSON.parse(JSON.stringify(teaserItemPrototype))],
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
        classes: {
            type: String,
            default: 'cc-image-teaser-configurator--teaser-and-text'
        },
        mix: {
            type: String,
            default: ''
        },
        childXmlConfigEntry: {
            type: String,
            default: 'teaser_and_text'
        }
    },
    data(): any {
        return {
            invalidVideoPlaceholderTeaserIndexes: []
        };
    },
    ready(): void {
        this.scenarioOptions = {
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
            },

            // Mobile order scenario elements.
            mobileLayout: {
                'image-text': {
                    name: 'Image (top) - text (bottom)',
                    iconId: 'mb_1',
                    disabled: false,
                },
                'text-image': {
                    name: 'Text (top) - image (bottom)',
                    iconId: 'mb_2',
                    disabled: false,
                },
            },
        };

        this.togglePossibleOptions = function () {
            return true;
        }
    },
    methods: {
        _validateOptionsSet(): void {
            return;
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            this.configuration.isError = false;
            this._validateOptionsSet();
            this._validateVideoPlaceholders();
            this._collectTeasersCssClasses(['teaser', 'teaser_and_text']);
            this.onSave();
        },
    },
};

export default teaserAndTextConfigurator;
