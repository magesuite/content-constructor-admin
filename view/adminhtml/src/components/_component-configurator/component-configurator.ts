/**
 * Base configurator component.
 * This component is responsible for providing base functionality for other configurators.
 * @type {vuejs.ComponentOption} Vue component object.
 */
const componentConfigurator: vuejs.ComponentOption = {
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
    },
    methods: {
        onChange(event?: Event): void {
            // Serialize reactive data.
            const data: any = JSON.parse(JSON.stringify(this.configuration));
            // Trigger event and callback.
            this.$dispatch('component-configurator__changed', data);
            this.change(data);
        },
        onSave(event?: Event): void {
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
