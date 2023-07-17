import $ from 'jquery';

interface IFieldInformation {
    label: string;
    type: string;
    model: string;
    options: any[];
    default?: any[];
    note?: string;
    hint?: string;
    warning?: string;
}

const customFieldMultiselect: vuejs.ComponentOption = {
    template: `<div class="cc-input cc-input--type-multiselect cc-input--{{fieldConfiguration.model}}">
        <label for="{{fieldConfiguration.model | prefixFieldId}}" class="cc-input__label" v-if="fieldConfiguration.label">
            {{fieldConfiguration.label | translate}}:
        </label>
        <select multiple class="select multiselect admin__control-multiselect cc-input__multiselect" id="{{fieldConfiguration.model | prefixFieldId}}" :name="fieldConfiguration.model" v-model="multiselect_value">
            <option v-for="(index, option) in fieldConfiguration.options" :value="option.value">{{ option.label }}</option>
        </select>
        <p class="cc-warning" v-if="fieldConfiguration.warning">{{{fieldConfiguration.warning | translate}}}</p>
        <p class="cc-input__note" v-if="fieldConfiguration.note">{{{fieldConfiguration.note | translate}}}</p>
        <p class="cc-input__hint" v-if="fieldConfiguration.hint">{{{fieldConfiguration.hint | translate}}}</p>
    </div>`,
    data(): any {
        return {
            multiselect_value: '',
        };
    },
    watch: {
        multiselect_value: function(val, oldVal) {
            this.$set(`configuration.${this.fieldConfiguration.model}`, val);
        },
    },
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
                return {
                    selectedOptions: []
                };
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
         * Set local multiselect model based on configuration or set
         * the default value for configurator model, based on the default options.
         */
        this.multiselect_value = this.configuration[this.fieldConfiguration.model];

        if (
            this.configuration[this.fieldConfiguration.model] == null &&
            this.fieldConfiguration.default != null
        ) {
            this.$set(`configuration.${this.fieldConfiguration.model}`, this.fieldConfiguration.default);
        }
    },
};

export default customFieldMultiselect;
