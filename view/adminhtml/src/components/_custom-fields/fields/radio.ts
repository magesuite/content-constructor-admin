import $ from 'jquery';

interface IFieldInformation {
    label: string;
    type: string;
    model: string;
    options: any[];
    default?: string;
    note?: string;
    hint?: string;
    warning?: string;
}

const customFieldRadio: vuejs.ComponentOption = {
    template: `<div class="cc-input cc-input--wrapper">
        <label class="cc-input__label cc-input__label--radio-group" v-if="fieldConfiguration.label">
            {{fieldConfiguration.label | translate}}
        </label>
        <div class="cc-input cc-input--type-radio" v-for="(value, label) in fieldConfiguration.options">
            <input type="radio" id="{{fieldConfiguration.model | prefixFieldId }}-{{$index + 1}}" class="cc-input__radio" :name="fieldConfiguration.model" :value="value" v-model="configuration[fieldConfiguration.model]">
            <label for="{{fieldConfiguration.model | prefixFieldId }}-{{$index + 1}}" class="cc-input__label cc-input__label--radio">{{label | translate}}</label>
        </div>
        <p class="cc-warning" v-if="fieldConfiguration.warning">{{{fieldConfiguration.warning | translate}}}</p>
        <p class="cc-input__note" v-if="fieldConfiguration.note">{{{fieldConfiguration.note | translate}}}</p>
        <p class="cc-input__hint" v-if="fieldConfiguration.hint">{{{fieldConfiguration.hint | translate}}}</p>
    </div>`,

    props: {
        fieldConfiguration: {
            type: Object,
            default(): any {
                return {};
            },
        },

        configuration: {
            type: Object,
            default(): any {
                return {};
            },
        },

        teaserIndex: {
            type: Number,
            default: 0,
        },
    },

    filters: {
        translate(txt: string): string {
            return $.mage.__(txt);
        },

        prefixFieldId(id: string): string {
            return `cfg-teaser-${this.teaserIndex}-${id}`;
        },
    },

    ready(): void {
        /**
         * Set default value if model is not set yet and default value is defined in etc/view.xml
         */
        if (
            this.configuration[this.fieldConfiguration.model] == null &&
            this.fieldConfiguration.default != null
        ) {
            this.$set(`configuration.${this.fieldConfiguration.model}`, this.fieldConfiguration.default);
        }
    },
};

export default customFieldRadio;
