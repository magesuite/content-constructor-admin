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

const customFieldDatetimeRange: vuejs.ComponentOption = {
    template: `<div class="cc-input cc-input--type-daterange">
        <label class="cc-input__label" v-if="fieldConfiguration.label" style="margin-bottom: 1rem; width: 100%;">
            {{fieldConfiguration.label}}
        </label>
        <label for="{{fieldConfiguration.model + 'date_from' | prefixFieldId}}" class="cc-input__label">
            From:
        </label>
        <input type="datetime-local" v-model="datetime_from" :max="datetime_to" class="cc-input__input" id="{{fieldConfiguration.model + 'date_from' | prefixFieldId}}" :name="datetime_from">
        <label for="{{fieldConfiguration.model + 'date_to' | prefixFieldId}}" class="cc-input__label" style="margin-top: 1rem;">
            To:
        </label>
        <input type="datetime-local" v-model="datetime_to" :min="datetime_from" class="cc-input__input" id="{{fieldConfiguration.model  + 'date_to' | prefixFieldId}}" :name="datetime_to">

        <p class="cc-error" v-if="dateValidationError">{{dateValidationError}}</p>
        <p class="cc-warning" v-if="fieldConfiguration.warning">{{fieldConfiguration.warning}}</p>
        <p class="cc-input__note" v-if="fieldConfiguration.note">{{fieldConfiguration.note}}</p>
        <p class="cc-input__hint" v-if="fieldConfiguration.hint">{{fieldConfiguration.hint}}</p>
    </div>`,
    data(): any {
        return {
            datetime_from: '',
            datetime_to: '',
            dateValidationError: '',
        };
    },
    methods: {
        validateAndUpdateValue: function(): void {
            if (this.validateDates()) {
                const fromTimestamp = this.datetime_from.length ? `${Math.floor(new Date(this.datetime_from).getTime() / 1000)}` : '';
                const toTimestamp = this.datetime_to.length ? `${Math.floor(new Date(this.datetime_to).getTime() / 1000)}` : '';

                this.$set(`configuration.${this.fieldConfiguration.model}`, `${fromTimestamp}|${toTimestamp}`);
            }
        },
        validateDates: function(): boolean {
            this.dateValidationError = new Date(this.datetime_from).valueOf() > new Date(this.datetime_to).valueOf()
                ? '"From" date needs to preceed "To" date'
                : '';

            return this.dateValidationError.length === 0;
        },
    },
    watch: {
        datetime_from: function(val, oldVal) {
            if (val !== oldVal) {
                this.validateAndUpdateValue();
            }
        },
        datetime_to: function(val, oldVal) {
            if (val !== oldVal) {
                this.validateAndUpdateValue();
            }
        },
    },
    props: {
        fieldConfiguration: {
            type: Object,
            default(): any {
                return {}
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
        prefixFieldId(id: string): string {
            return `cfg-teaser-${this.teaserIndex}-${id}`;
        },
    },
    ready(): void {
        const self = this;

        require(['moment'], function(moment): void {
            if (self.configuration[self.fieldConfiguration.model]) {
                const dateRange = self.configuration[self.fieldConfiguration.model].split('|');
                const dateFrom = dateRange[0];
                const dateTo = dateRange[1];
                const datetimelocalFormat = 'YYYY-MM-DDTHH:mm:ss';

                self.datetime_from = dateFrom.length ? moment(Number(dateFrom * 1000)).format(datetimelocalFormat) : '';
                self.datetime_to = dateTo.length ? moment(Number(dateTo * 1000)).format(datetimelocalFormat) : '';
            } else if (self.fieldConfiguration.default != null) {
                /**
                 * Set default value if model is not set yet and default value is defined in etc/view.xml
                 */
                self.$set(`configuration.${self.fieldConfiguration.model}`, self.fieldConfiguration.default);
            }
        });
    },
};

export default customFieldDatetimeRange;
