import * as customElements from '../_custom-fields/custom-fields';

/**
 * Base configurator component.
 * This component is responsible for providing base functionality for other configurators.
 * @type {vuejs.ComponentOption} Vue component object.
 */
const componentConfigurator: vuejs.ComponentOption = {
    components: {
        'custom-element-input': customElements.customFieldTextInput,
        'custom-element-select': customElements.customFieldSelect,
        'custom-element-multiselect': customElements.customFieldMultiselect,
        'custom-element-textarea': customElements.customFieldTextarea,
        'custom-element-checkbox': customElements.customFieldCheckbox,
        'custom-element-radio': customElements.customFieldRadio,
        'custom-element-position': customElements.customFieldPosition,
        'custom-element-datetime-range': customElements.customFieldDatetimeRange,
        'custom-element-color': customElements.customFieldColor,
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
        _getCustomCssFields(source: object): any[] {
            const cssClassFields: any[] = [];

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
            const componentsToIterate = this.secondaryXmlConfigEntry ? [this.xmlConfigEntry, this.secondaryXmlConfigEntry] : [this.xmlConfigEntry];
            let cssClasses: string[] = [];

            componentsToIterate.forEach((entry: string) => {
                if (
                    this.ccConfig[entry] != null &&
                    this.ccConfig[entry].custom_sections != null
                ) {
                    const cssClassFields: any[] = this._getCustomCssFields(this.ccConfig[entry].custom_sections);
    
                    cssClassFields.forEach(
                        (model: string) => {
                            const configValue = this.configuration[model];
    
                            if (!configValue) {
                                return;
                            }
    
                            if (typeof configValue === 'string') {
                                cssClasses.push(configValue);
                            } else if (typeof configValue === 'object') {
                                for (const key in configValue) {
                                    if (configValue.hasOwnProperty(key)) {
                                        cssClasses.push(configValue[key]);
                                    }
                                }
                            }
                        }
                    );
                }
            });

            this.configuration.cc_css_classes = cssClasses.length ? cssClasses.join(' ') : '';
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
    filters: {
        sectionID(id: string): string {
            return id.replace(/\s+/g, '-').toLowerCase();
        },
    },
};

export { componentConfigurator };
export default componentConfigurator;
