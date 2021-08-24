import * as customElements from '../_custom-elements/custom-elements';

/**
 * Base configurator component.
 * This component is responsible for providing base functionality for other configurators.
 * @type {vuejs.ComponentOption} Vue component object.
 */
const componentConfigurator: vuejs.ComponentOption = {
    components: {
        'custom-element-input': customElements.customElementTextInput,
        'custom-element-select': customElements.customElementSelect,
        'custom-element-textarea': customElements.customElementTextarea,
        'custom-element-checkbox': customElements.customElementCheckbox,
        'custom-element-radio': customElements.customElementRadio,
        'custom-element-position': customElements.customElementPosition,
    },
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: [String, Object, Array],
            default: '',
        },
        /**
         * Property containing callback triggered when user saves component.
         * For default, we are providing a dummy function so we can skip the type check.
         */
        save: {
            type: Function,
            default: (): Function => (): undefined => undefined,
        },
        /**
         * Property containing callback triggered when configuration is changed.
         * For default, we are providing a dummy function so we can skip the type check.
         */
        change: {
            type: Function,
            default: (): Function => (): undefined => undefined,
        },
        /**
         *
         */
        configuration: {
            type: String,
            default(): any {},
        },
        /* Obtain content-constructor's config file */
        ccConfig: {
            type: Object,
            default(): any {
                return {};
            },
        },
    },
    methods: {
        _getCustomCssFields(source: object): Array<any> {
            const cssClassFields: Array<any> = [];

            Object.keys(source).forEach(
                (tabKey: string) => {
                    if (
                        typeof source[tabKey].content !== 'string' &&
                        source[tabKey].content.fields != null
                    ) {
                        Object.keys(source[tabKey].content.fields).forEach(
                            (fieldKey: string) => {
                                if (source[tabKey].content.fields[fieldKey].frontend_type === 'css_class') {
                                    cssClassFields.push(source[tabKey].content.fields[fieldKey].model);
                                }
                            }
                        );
                    }
                }
            );

            return cssClassFields;
        },
        _collectComponentCssClasses(): void {
            if (
                this.ccConfig[this.xmlConfigEntry] != null &&
                this.ccConfig[this.xmlConfigEntry].custom_sections != null
            ) {
                const cssClassFields: Array<any> = this._getCustomCssFields(this.ccConfig[this.xmlConfigEntry].custom_sections);
                const cssClasses: Array<string> = [];

                cssClassFields.forEach(
                    (model: string) => {
                        if (this.configuration[model] && typeof this.configuration[model] === 'string') {
                            cssClasses.push(this.configuration[model]);
                        }
                    }
                );

                this.configuration.cc_css_classes = cssClasses.join(' ');
            }
        },
        onChange(event?: Event): void {
            // Serialize reactive data.
            const data: any = JSON.parse(JSON.stringify(this.configuration));
            // Trigger event and callback.
            this.$dispatch('component-configurator__changed', data);
            this.change(data);
        },
        onSave(event?: Event): void {
            this._collectComponentCssClasses();
            // Serialize reactive data.
            const data: any = JSON.parse(JSON.stringify(this.configuration));
            // Trigger event and callback.
            this.$dispatch('component-configurator__saved', data);
            this.save(data);
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            if (this._events['component-configurator__save'].length === 1) {
                this.onSave();
            }
        },
    },
};

export { componentConfigurator };
export default componentConfigurator;
