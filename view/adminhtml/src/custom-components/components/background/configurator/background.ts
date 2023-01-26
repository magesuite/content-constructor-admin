import $t from 'mage/translate';

import componentConfigurator from '../../../../components/_component-configurator/component-configurator';

/**
 * background component interface.
 */
interface IComponentSettings {
    bgType?: string;
    color?: string;
}

/**
 * background configurator component.
 * This component is responsible for displaying backgrounds' configuration modal
 * @type {vuejs.ComponentOption} Vue component object.
 */
const backgroundConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    template: `<div class="cc-background-configurator {{ classes }} | {{ mix }}" {{ attributes }}>
        
        <section class="cc-background-configurator__section" v-if="ccConfig.background != null && ccConfig.background.custom_sections != null" v-for="section in ccConfig.background.custom_sections">
            <h3 class="cc-background-configurator__subtitle" v-if="section.label">{{section.label | translate}}</h3>
            <div class="cc-custom-fields">
                <div class="cc-custom-fields__form-group" v-for="field in section.content.fields">
                    <component
                        :is="'custom-element-' + field.type"
                        :configuration="configuration"
                        :field-configuration="field"
                    ></component>
                </div>
            </div>
        </section>

        <div class="cc-input cc-input--type-inline">
            <label for="cfg-background-type" class="cc-input__label">${ $t('Choose start of end of background') }:</label>
            <select name="cfg-background-type" class="cc-input__select" id="cfg-background-type" v-model="configuration.bgType" @change="onChange">
                <option value="start" :selected="'start' === configuration.bgType">Start</option>
                <option value="end" :selected="'end' === configuration.bgType">End</option>
            </select>
        </div>
        <div :class="configuration.bgType == 'start' ? '' : 'visually-hidden'">
            <div class="cc-input cc-input--type-inline">
                <label for="cfg-color" class="cc-input__label">${ $t('Color') }:</label>
                <input type="color" v-model="configuration.color" id="cfg-color" class="cc-input__color" @change="onChange">
            </div>
        </div>
    </div>`,
    props: {
        configuration: {
            type: Object,
            default(): any {
                return {
                    customCssClass: '',
                    bgType: '',
                    color: '',
                };
            },
        },
        /* Set prop with component name in order to
         * pass it to `component-configurator` methods
        */
        xmlConfigEntry: {
            type: String,
            default: 'background',
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            this.onSave();
        },
    },
    data(): Object {
        return {
            isAvdancedSettingsOpen: false,
        }
    },
    methods:{

    },
    ready(): void {

    },
};

export default backgroundConfigurator;
