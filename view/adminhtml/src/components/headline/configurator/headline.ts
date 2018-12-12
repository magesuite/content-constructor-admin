import $t from 'mage/translate';

import componentConfigurator from '../../_component-configurator/component-configurator';

/**
 * Headline component interface.
 */
interface IComponentSettings {
    title?: string;
    subtitle?: string;
    headingTag?: string;
}

/**
 * Headline configurator component.
 * This component is responsible for displaying headlines' configuration modal
 * @type {vuejs.ComponentOption} Vue component object.
 */
const headlineConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    template: `<div class="cc-headline-configurator {{ classes }} | {{ mix }}" {{ attributes }} @submit.prevent="onSave">
        <div class="cc-input cc-input--type-inline">
            <label for="cfg-headline" class="cc-input__label">${ $t('Headline') }:</label>
            <input type="text" v-model="configuration.title" id="cfg-headline" class="cc-input__input" @change="onChange">
        </div>
        <div class="cc-input cc-input--type-inline">
            <label for="cfg-subheadline" class="cc-input__label">${ $t('Subheadline') }:</label>
            <input type="text" v-model="configuration.subtitle" id="cfg-subheadline" class="cc-input__input" @change="onChange">
        </div>

        <div class="cc-headline-configurator__advanced-trigger">
            <span :class="isAvdancedSettingsOpen ? 'active' : ''" role="button" @click="toggleAdvancedContent()">${ $t('Advanced settings') }</span>
        </div>

        <div class="cc-headline-configurator__advanced-content" v-show="isAvdancedSettingsOpen">
            <div class="cc-input cc-input--type-inline">
                <label for="cfg-heading-tag" class="cc-input__label">${ $t('Level of Heading tag') }:</label>
                <select name="cfg-heading-tag" class="cc-input__select" id="cfg-heading-tag" v-model="configuration.headingTag" @change="onChange">
                    <option v-for="n in 6" value="h{{ n+1 }}" :selected="n+1 === configuration.headingTag">Heading {{ n+1 }} (h{{ n+1 }})</option>
                </select>
            </div>
        </div>
    </div>`,
    props: {
        configuration: {
            type: Object,
            default(): any {
                return {
                    title: '',
                    subtitle: '',
                    headingTag: 'h2',
                };
            },
        },
    },
    data(): Object {
        return {
            isAvdancedSettingsOpen: false,
        }
    },
    methods:{
        toggleAdvancedContent(): void {
            this.isAvdancedSettingsOpen = !this.isAvdancedSettingsOpen;
        },
    },
    ready(): void {
        if (!this.configuration.headingTag) {
            this.configuration.headingTag = 'h2';
        }
    },
};

export default headlineConfigurator;
