import $ from 'jquery';

interface IFieldInformation {
    label: string;
    type: string;
    model: string;
    default?: string;
    note?: string;
    hint?: string;
    warning?: string;
}

const customFieldColor: vuejs.ComponentOption = {
    template: `<div class="cc-input cc-input--type-color cc-input--{{fieldConfiguration.model}}">
        <label for="{{fieldConfiguration.model | prefixFieldId}}" class="cc-input__label" v-if="fieldConfiguration.label">
            {{fieldConfiguration.label | translate}}:
        </label>
        <div class="cc-input__wrapper">
            <input type="text" class="cc-input__input" id="{{fieldConfiguration.model | prefixFieldId}}" :name="fieldConfiguration.model" v-model="configuration[fieldConfiguration.model]" pattern="#[a-fA-F0-9]{6}" maxlength="7">
            <input type="color" class="cc-input__input cc-input__input--type-color" :value="configuration[fieldConfiguration.model]" @change="updateValue($event)">
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

    methods: {
        updateValue(e: Event) {
            this.$set(`configuration.${this.fieldConfiguration.model}`, (e.target as HTMLInputElement).value);
        }
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

export default customFieldColor;