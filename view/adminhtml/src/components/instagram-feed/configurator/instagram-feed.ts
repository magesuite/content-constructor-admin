import imageTeaserConfigurator from '../../image-teaser/configurator/image-teaser';

/**
 * Instagran feed configurator component.
 * This component is responsible for displaying instagram feed configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const instagramFeedConfigurator: vuejs.ComponentOption = {
    extends: imageTeaserConfigurator,
    template: `<div class="cc-image-teaser-configurator {{ classes }} | {{ mix }}" {{ attributes }}>
        <section class="cc-image-teaser-configurator__section" v-if="ccConfig.image_teaser != null && ccConfig.image_teaser.custom_sections != null" v-for="section in ccConfig.image_teaser.custom_sections">
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
            <h3 class="cc-image-teaser-configurator__subtitle">{{'Instagram images limit' | translate}}:</h3>
            <div class="cc-input cc-input--group cc-input cc-teaser-configurator__form-group">
                <div class="cc-input cc-teaser-configurator__form-element">
                    <label for="{{fieldId | randomizeElementId}}" class="cc-input__label">
                        {{'Instagram images limit' | translate}}:
                    </label>
                    <select class="cc-input__select" v-model="configuration.scenario.numberOfSlides">
                        <option v-for="(optionId, option) in scenarioOptions.numberOfSlides" :value="optionId">{{ option.name }}</option>
                    </select>
                </div>
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
                    scenario: {
                        teaserWidth: {
                            name: 'Content width',
                            disabled: false,
                            id: 'container-slider'
                        },
                        desktopLayout: {
                            disabled: ',',
                            id: '4',
                            name: '4 in row',
                            teasersNum: '4'
                        },
                        contentPlacement: {
                            contentPlacement: '1',
                            disabled: '',
                            id: 'over',
                            name: 'Text over image'
                        },
                        mobileLayout: {
                            id: 'mobile-slider',
                            name: 'Slider',
                            disabled: false,
                        },
                        numberOfSlides: 4
                    },
                };
            },
        },
        adminPrefix: {
            type: String,
            default: 'admin',
        },
    },
    ready(): void {
        this.scenarioOptions = {
            // Number of slides
            numberOfSlides: {
                '4': {
                    name: '4 Instagram images',
                    disabled: false,
                },
                '8': {
                    name: '8 Instagram images',
                    disabled: false,
                },
                '12': {
                    name: '12 Instagram images',
                    disabled: false,
                },
            },

        };
        this.availableScenarios = [
            ['container', '4', 'over', ['mobile-slider']],
        ];

        if (
            this.configuration.numberOfSlides &&
            !this.configuration.numberOfSlides
        ) {
            this.toggleOption('contentPlacement', '4');
        }

        this.togglePossibleOptions = function () {
            return true;
        }
    },
};

export default instagramFeedConfigurator;
