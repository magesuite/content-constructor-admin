import $ from 'jquery';
import $t from 'mage/translate';

import componentConfigurator from '../../_component-configurator/component-configurator';

/**
 * button configurator component.
 * This component is responsible for displaying buttons configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const buttonConfigurator: vuejs.ComponentOption = {
    mixins: [componentConfigurator],
    template: `<form class="cc-button-configurator {{ classes }} | {{ mix }}" {{ attributes }} @submit.prevent="onSave">
        <section class="cc-button-configurator__section" v-if="ccConfig.button != null && ccConfig.button.custom_sections != null" v-for="section in ccConfig.button.custom_sections">
            <h3 class="cc-button-configurator__subtitle" v-if="section.label">{{section.label | translate}}</h3>
            <div class="cc-custom-fields">
                <div class="cc-custom-fields__form-group" v-for="field in section.content.fields">
                    <component
                        :is="'custom-element-' + field.type"
                        :configuration="configuration"
                        :field-configuration="field"
                    ></component>
                </div>
            </div>
        </section>

        <div class="cc-input cc-input--type-inline">
            <label for="cfg-label" class="cc-input__label">${$t(
                'Label'
            )}:</label>
            <input type="text" v-model="configuration.label" id="cfg-label" class="cc-input__input" @change="onChange">
        </div>
        <div class="cc-input cc-input--type-addon cc-input--type-inline | cc-button-configurator__item-form-element">
            <label for="cfg-target" class="cc-input__label">${$t(
                'Target'
            )}:</label>
            <div class="cc-input__addon-wrapper">
                <input type="text" class="cc-input__input | cc-button-configurator__target" v-model="configuration.target" id="cfg-target">
                <span class="cc-input__addon | cc-button-configurator__widget-chooser-trigger" @click="openCtaTargetModal()">
                    <svg class="cc-input__addon-icon">
                        <use xlink:href="#icon_link"></use>
                    </svg>
                </span>
            </div>
        </div>
    </form>`,
    props: {
        /*
         * Single's component configuration
         */
        configuration: {
            type: Object,
            default(): Object {
                return {
                    customCssClass: '',
                    label: '',
                    target: '',
                };
            },
        },
        /* Get assets for displaying component images */
        assetsSrc: {
            type: String,
            default: '',
        },
        /* Obtain admin url */
        adminPrefix: {
            type: String,
            default: 'admin',
        },
        /* Set prop with component name in order to
         * pass it to `component-configurator` methods
        */
        xmlConfigEntry: {
            type: String,
            default: 'button',
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            this.onSave();
        },
    },
    methods: {
        /* Opens modal with M2 built-in widget chooser
         */
        openCtaTargetModal(): void {
            widgetTools.openDialog(
                `${window.location.origin}/${
                    this.adminPrefix
                }/admin/widget/index/filter_widgets/Link/widget_target_id/cfg-target/`
            );

            this.wWidgetListener();
        },
        /* Sets listener for widget chooser
         * It triggers component.onChange to update component's configuration
         * after value of target input is changed
         */
        widgetSetListener(): void {
            const component: any = this;

            $('.cc-button-configurator__cta-target-link').on(
                'change',
                (): void => {
                    component.onChange();
                }
            );
        },
        /*
         * Check if widget chooser is loaded. If not, wait for it, if yes:
         * Override default onClick for "Insert Widget" button in widget's modal window
         * to clear input's value before inserting new one
         */
        wWidgetListener(): void {
            if (
                typeof wWidget !== 'undefined' &&
                widgetTools.dialogWindow[0].innerHTML !== ''
            ) {
                const button: any = widgetTools.dialogWindow[0].querySelector(
                    '#insert_button'
                );

                button.onclick = null;
                button.addEventListener(
                    'click',
                    (): void => {
                        this.configuration.target = '';
                        wWidget.insertWidget();
                    }
                );
            } else {
                setTimeout(this.wWidgetListener, 300);
            }
        },
    },
    ready(): void {
        this.widgetSetListener();
    },
};

export default buttonConfigurator;
