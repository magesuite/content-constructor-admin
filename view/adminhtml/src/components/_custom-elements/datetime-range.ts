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

const customElementDatetimeRange: vuejs.ComponentOption = {
    template: `<div class="cc-input cc-input--type-daterange">
        <label class="cc-input__label" v-if="fieldConfiguration.label">
            {{fieldConfiguration.label | translate}}
        </label>
        <label for="{{fieldConfiguration.model + "date_from" | prefixFieldId}}" class="cc-input__label" v-if="fieldConfiguration.label">
            From:
        </label>
        <input type="datetime-local" v-model="datetime_from" :max="datetime_to" class="cc-input__input" id="{{fieldConfiguration.model + "date_from" | prefixFieldId}}" :name="datetime_from">
        <label for="{{fieldConfiguration.model + "date_to" | prefixFieldId}}" class="cc-input__label" v-if="fieldConfiguration.label">
            To:
        </label>
        <input type="datetime-local" v-model="datetime_to" :min="datetime_from" class="cc-input__input" id="{{fieldConfiguration.model  + "date_to" | prefixFieldId}}" :name="datetime_to">

        <p class="cc-warning" v-if="dateValidationError">{{dateValidationError}}</p>
        <p class="cc-warning" v-if="fieldConfiguration.warning">{{{fieldConfiguration.warning | translate}}}</p>
        <p class="cc-input__note" v-if="fieldConfiguration.note">{{{fieldConfiguration.note | translate}}}</p>
        <p class="cc-input__hint" v-if="fieldConfiguration.hint">{{{fieldConfiguration.hint | translate}}}</p>
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
                const fromTimestamp = new Date(this.datetime_from).valueOf();
                const toTimestamp = new Date(this.datetime_to).valueOf();

                const output = `${fromTimestamp}|${toTimestamp}`;
                this.$set(`configuration.${this.fieldConfiguration.model}`, output);
            }
        },
        validateDates: function(): boolean {
            this.dateValidationError = '';

            if (!(this.datetime_from.length && this.datetime_to.length)) {
                this.dateValidationError = 'Please provide both dates';
            } else if (
                new Date(this.datetime_from).valueOf() > new Date(this.datetime_to).valueOf()
            ) {
                this.dateValidationError = '"From" date needs to preceed "To" date';
            }

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
        translate(txt: string): string {
            return $.mage.__(txt);
        },

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

                self.datetime_from = moment(Number(dateFrom)).format(datetimelocalFormat);
                self.datetime_to = moment(Number(dateTo)).format(datetimelocalFormat);
            } else if (self.fieldConfiguration.default != null) {
                /**
                 * Set default value if model is not set yet and default value is defined in etc/view.xml
                 */
                self.$set(`configuration.${self.fieldConfiguration.model}`, self.fieldConfiguration.default);
            }
        });
    },
};

export default customElementDatetimeRange;
