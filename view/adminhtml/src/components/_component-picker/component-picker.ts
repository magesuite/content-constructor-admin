import $ from 'jquery';

/**
 * Single component information object.
 */
interface IComponentInformation {
    type: string;
    /**
     * Name of the component (will be displayed in front).
     * @type {string}
     */
    name: string;
    description: string;
}

/**
 * Components information object that should be returned by AJAX call to API.
 */
interface IComponentsInformation {
    components: IComponentInformation[];
}

/**
 * Componen picker.
 * Lists all types of components available in m2c in the grid/list mode
 * @type {vuejs.ComponentOption} Vue component object.
 */
const componentPicker: vuejs.ComponentOption = {
    template: `<section class="cc-component-picker | {{ class }}">
        <div class="cc-component-picker__search" :class="{ 'cc-component-picker__search--clearable': search.length > 0 }">
            <input
                type="text"
                class="cc-input__input cc-component-picker__search-input"
                placeholder="{{ 'Search components...' | translate }}"
                v-model="search"
                v-el:search-input
            >
            <a href="#" class="cc-component-picker__search-clear" @click="clearSearch">
                <span class="visually-hidden">{{ Clear | translate }}</span>
            </a>
        </div>
        <ul class="cc-component-picker__list" v-if="filteredComponents.length">
            <li class="cc-component-picker__list-item cc-component-picker__list-item--{{component.type}}" v-for="component in filteredComponents">
                <a class="cc-component-picker__component-link" href="#" @click.prevent="onPickComponent( component.type, component.name )">
                    <span class="cc-component-picker__component-figure">
                        <svg class="cc-component-picker__component-icon">
                            <use v-bind="{ 'xlink:href': '#icon_component-' + component.type }"></use>
                        </svg>
                    </span>
                    <span class="cc-component-picker__component-name">{{ component.name }}</span>
                    <span class="cc-component-picker__component-description">{{ component.description }}</span>
                </a>
            </li>
        </ul>
        <p class="cc-component-picker__no-components" v-if="!filteredComponents.length">
            No components available.
        </p>
    </section>`,
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: String,
            default: '',
            coerce: (value: string): string =>
                value.replace('cc-component-picker', ''),
        },
        /**
         * Property containing callback triggered when user picks component.
         */
        pickComponent: {
            type: Function,
        },
        /**
         * JSON stringified array containing available components.
         */
        components: {
            type: String,
            default: '',
        },
        /**
         * URL for API returning JSON stringified array containing available components.
         */
        componentsEndpoint: {
            type: String,
            default: '',
        },
        /**
         * Assets src for icon
         */
        assetsSrc: {
            type: String,
            default: '',
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-picker__opened'(): void {
            this.focusSearch();
        },
    },
    data(): any {
        return {
            availableComponents: [],
            search: '',
        };
    },
    ready(): void {
        // If inline JSON is provided then parse it.
        if (this.components) {
            this.availableComponents = JSON.parse(this.components);
        } else if (this.componentsEndpoint) {
            // Otherwise load from endpoint if URL provided.
            this.$http
                .get(this.componentsEndpoint)
                .then(function(response: vuejs.HttpResponse): void {
                    this.availableComponents = response.json();
                });
        }

        this.focusSearch();
    },
    computed: {
        /**
         * Filters 'availableComponents' array by 'search' model.
         * @returns Array - filtered components array
         */
        filteredComponents(): Array<Record<string, unknown>> {
            return this.availableComponents.filter((item: Record<string, unknown>) => {
                return String(item.name).toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
    methods: {
        /**
         * Translates given string
         * @param txt {string} - original, english string to be translated
         * @return {string} - translated string
         */
         translate(txt: string): string {
            return $.mage.__(txt);
        },

        /**
         * Component pick click handler.
         * This handler triggers "cc-component-picker__pick" event up the DOM chain when called.
         * @param {Event} event Click event object.
         */
        onPickComponent(componentType: string, componentName: string): void {
            this.$dispatch(
                'component-picker__pick',
                componentType,
                componentName
            );

            if (typeof this.pickComponent === 'function') {
                this.pickComponent(componentType, componentName);
            }
        },

        clearSearch(): void {
            this.search = '';
        },

        focusSearch(): void {
            this.$els.searchInput.focus();
        }
    },
};

export default componentPicker;
