import $ from 'jquery';

interface IDefaultValue {
    x: number,
    y: number,
}

interface IFieldInformation {
    label: string;
    type: string;
    model: string;
    default?: IDefaultValue;
    note?: string;
    hint?: string;
    warning?: string;
}

const customFieldPosition: vuejs.ComponentOption = {
    template: `<div class="cc-input cc-input--type-position-grid">
        <label class="cc-input__label" v-if="fieldConfiguration.label">{{fieldConfiguration.label | translate}}:</label>
        <div
            class="cc-position-grid"
            :style="{'width': gridWidth}"
        >
            <template v-for="y in rows">
                <template v-for="x in columns">
                    <span
                        class="cc-position-grid__item"
                        :class="{
                            'cc-position-grid__item--active': isCurrentPosition(x+1, y+1)
                        }"
                        @click="setPosition(x+1, y+1)"
                    ></span>
                </template>
            </template>
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
    },

    filters: {
        translate(txt: string): string {
            return $.mage.__(txt);
        },
    },

    computed: {
        rows: function(): number {
            return Number(this.fieldConfiguration.rows);
        },

        columns: function(): number {
            return Number(this.fieldConfiguration.columns);
        },

        gridWidth: function(): string {
            return `${this.columns * 4}rem`;
        },
    },

    methods: {
        isCurrentPosition(x: number, y: number): boolean {
            return (
                Number(this.configuration[this.fieldConfiguration.model].x) === x &&
                Number(this.configuration[this.fieldConfiguration.model].y) === y
            );
        },

        setPosition(x: number, y: number): void {
            this.configuration[this.fieldConfiguration.model] = {
                x: x,
                y: y,
            };
        },
    },

    ready(): void {
        /**
         * Set default value if model is not set yet and default value is defined in etc/view.xml
         */
        if (this.configuration[this.fieldConfiguration.model] == null) {
            this.$set(`configuration.${this.fieldConfiguration.model}`, {});

            if (
                this.fieldConfiguration.default != null &&
                typeof this.fieldConfiguration.default.x === 'number' &&
                typeof this.fieldConfiguration.default.y === 'number'
            ) {
                this.setPosition(
                    this.fieldConfiguration.default.x,
                    this.fieldConfiguration.default.y
                );
            }
        }
    },
};

export default customFieldPosition;
