import $ from 'jquery';
import $t from 'mage/translate';
import Vue from 'Vue';

import componentConfigurator from '../../_component-configurator/component-configurator';

/**
 * Paragraph configurator component.
 * This component is responsible for displaying paragraph configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const paragraphConfigurator: vuejs.ComponentOption = {
    mixins: [componentConfigurator],
    template: `<form class="cc-paragraph-configurator {{ classes }} | {{ mix }}" {{ attributes }} @submit.prevent="onSave">

        <div class="cc-paragraph-configurator__error" v-text="tempConfiguration.errorMessage" v-show="tempConfiguration.errorMessage">
        </div>

        <section class="cc-paragraph-configurator__section cc-paragraph-configurator__section--{{section.label | sectionID}}" v-if="ccConfig.paragraph != null && ccConfig.paragraph.custom_sections != null" v-for="section in ccConfig.paragraph.custom_sections">
            <h3 class="cc-paragraph-configurator__subtitle" v-if="section.label">{{section.label | translate}}</h3>
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

        <section class="cc-paragraph-configurator__section">
            <h3 class="cc-paragraph-configurator__subtitle">${$t(
                'Paragraph width'
            )}</h3>
            <div class="cc-paragraph-configurator__scenario-options">
                <div
                    :class="{
                        'cc-paragraph-configurator__option--selected': configuration.scenarios.reading.id == optionId,
                    }"
                    class="cc-paragraph-configurator__option"
                    v-for="(optionId, option) in scenarioOptions.reading"
                    @click="toggleOption('reading', optionId)">
                    <div class="cc-paragraph-configurator__option-wrapper">
                        <svg class="cc-paragraph-configurator__option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                    <p class="cc-paragraph-configurator__option-name">
                        ${$t('{{ option.name }}')}
                    </p>
                </div>
            </div>
        </section>

        <section class="cc-paragraph-configurator__section">
            <div class="cc-input">
                <label for="input-cfg-title" class="cc-input__label">${$t(
                    'Title'
                )}:</label>
                <input type="text" name="cfg-title" v-model="configuration.title" id="input-cfg-title" class="cc-input__input cc-input__input--limited-width" maxlength="100">
            </div>
            <div class="cc-input" v-if="isColumnsConfigAvailable()">
                <label for="input-cfg-columns" class="cc-input__label">${$t(
                    'Number of columns'
                )}:</label>
                <select name="input-cfg-columns" class="cc-input__select | cc-paragraph-configurator__select" id="input-cfg-columns" v-model="configuration.columns">
                    <option value="none">${$t(
                        "Don't split content - display full width"
                    )}</option>
                    <option value="2">${$t(
                        'Split content into 2 columns'
                    )}</option>
                    <option value="3">${$t(
                        'Split content into 3 columns'
                    )}</option>
                    <option value="4">${$t(
                        'Split content into 4 columns'
                    )}</option>
                </select>
                <div class="admin__field-note cc-input__note">
                    <span>${$t(
                        'Defines the way of content display. Content can be splitted into defined number of columns. This setting has no effect on small screen resolutions (such as smartphones) where content is always displayed in one column.'
                    )}</span>
                </div>
            </div>
            <div class="cc-input">
                <label for="textarea-cfg-paragraph" class="cc-input__label cc-input__label--look-top-align">${$t(
                    'HTML'
                )}:</label>

                <div class="buttons-set | cc-paragraph-configurator__wysiwyg-buttons">
                    <button type="button" class="scalable action-show-hide" id="toggle-wysiwyg">${$t(
                        'Show / Hide Editor'
                    )}</button>
                    <button type="button" class="scalable action-add-widget plugin" @click="openWidgetModal()" v-show="!isEditorVisible">${$t(
                        'Insert Widget'
                    )}...</button>
                    <button type="button" class="scalable action-add-image plugin" @click="openMediaModal()" v-show="!isEditorVisible">${$t(
                        'Insert Image'
                    )}...</button>
                    <button type="button" class="scalable add-variable plugin" @click="openMagentoVariablesModal()" v-show="!isEditorVisible">${$t(
                        'Insert Variable'
                    )}...</button>
                </div>

                <textarea name="cfg-paragraph" v-model="configuration.content" id="textarea-cfg-paragraph" class="cc-input__textarea | cc-paragraph-configurator__textarea"></textarea>
            </div>
        </section>
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
                    title: '',
                    columns: 'none',
                    content: '',
                    scenarios: {
                        reading: {},
                    },
                };
            },
        },
        restToken: {
            type: String,
            default: '',
        },
        wysiwygConfig: {
            type: String,
            default: '',
        },
        /* Obtain base-url for the image uploader */
        uploaderBaseUrl: {
            type: String,
            default: '',
        },
        /* Obtain admin prefix */
        adminPrefix: {
            type: String,
            default: '',
        },
        /* get assets for displaying component images */
        assetsUrl: {
            type: String,
            default: '',
        },
        /* Set prop with component name in order to
         * pass it to `component-configurator` methods
        */
        xmlConfigEntry: {
            type: String,
            default: 'paragraph',
        },
    },
    data(): any {
        return {
            /*
             * This object if used to operate inside component. We want to bind data to inputs,
             * but we don't need them to be saved in m2c component's config. Only ID is needed,
             * since rest of data id fetched from database.
             */
            tempConfiguration: {
                identifier: '',
                title: '',
                content: '',
                errorMessage: '',
            },

            isEditorVisible: true,

            // wysiwyg editor object
            editor: undefined,

            scenarioOptions: {
                // Reading scenario options.
                reading: {
                    full: {
                        name: 'Container width',
                        iconId: 'tw_content-width-text',
                    },
                    optimal: {
                        name: 'Optimal reading width',
                        iconId: 'tw_optimal-reading',
                    },
                },
            },
        };
    },
    ready(): void {
        // Check if wysiwygConfig was passed - means that editor is enabled in admin panel
        if (this.wysiwygConfig !== '') {
            this.wysiwygCfg = JSON.parse(this.wysiwygConfig);
            this.wysiwygCfg.height = '300px';
        }

        // Init loader and hide it
        $('body')
            .one()
            .loadingPopup({
                timeout: false,
            })
            .trigger('hideLoadingPopup');

        // If ID is already provided (means we're in edit mode)
        if (this.configuration.blockId && !this.configuration.migrated) {
            // Show loader before request
            $('body').trigger('showLoadingPopup');

            // Send request to REST API to get CMS block data if in edit mode
            this.$http({
                headers: {
                    Accept: 'application/json',
                    Authorization: this.restToken,
                },
                method: 'get',
                url: `${window.location.origin}/rest/all/V1/cmsBlock/${
                    this.configuration.blockId
                }`,
            }).then(
                (response: any): void => {
                    const responseData: any =
                        typeof response.data === 'string'
                            ? JSON.parse(response.data)
                            : response.data;
                    // Hide loader
                    $('body').trigger('hideLoadingPopup');


                    this.$set('configuration.content', responseData.content);
                    this.$set('configuration.title', responseData.title);

                    // initialize customized WYSIWYG
                    if (this.wysiwygCfg) {
                        this.initWysiwyg();
                    }
                },
                (): void => {
                    $('body').trigger('hideLoadingPopup');
                }
            );
        } else {
            // initialize customized WYSIWYG
            if (this.wysiwygCfg) {
                this.initWysiwyg();
            }
        }

        this.updateConfigurationProp();
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            this.$set('configuration.migrated', true);
            this.$set('configuration.content', this.fixMarkup(this.configuration.content));

            if (this.configuration.blockId) {
                delete this.configuration.blockId;
            }

            this.onSave();
        },
    },
    methods: {
        stripSpaces(str: string): void {
            const striped: string = str
                .split(' ')
                .join('-')
                .toLowerCase();
            this.tempConfiguration.identifier = striped;
        },
        /* Opens modal with M2 built-in widget chooser
         */
        openWidgetModal(): void {
            widgetTools.openDialog(
                `${
                    this.wysiwygCfg.plugins[1].options.window_url
                }widget_target_id/textarea-cfg-paragraph/`
            );
        },
        /* Opens modal with M2 built-in media uploader
         */
        openMediaModal(): void {
            MediabrowserUtility.openDialog(
                `${
                    this.uploaderBaseUrl
                }target_element_id/textarea-cfg-paragraph/`,
                'auto',
                'auto',
                $t('Insert File...'),
                {
                    closed: true,
                }
            );
        },
        /* Opens modal with M2 built-in variables
         */
        openMagentoVariablesModal(): void {
            MagentovariablePlugin.loadChooser(
                this.wysiwygCfg.plugins[2].options.url,
                'textarea-cfg-paragraph'
            );
        },
        /**
         * Initializes TinyMCE WYSIWYG with given configuration (this.wysiwygConfig).
         * Custom Event.observe(... event added to toggle editor on/off
         * You can change editor settings if needed by extending 'editorConfig'.
         * To extend config please see how it's done by Magento here: vendor/magento/framework/Data/Form/Element/Editor.php
         */
        initWysiwyg(): void {
            const _this: any = this;
            let editor: any;
            const editorConfig: JSON = JSON.parse(this.wysiwygConfig);

            require([
                'mage/adminhtml/wysiwyg/tiny_mce/setup',
            ], function(): void {
                editor = new wysiwygSetup(
                    'textarea-cfg-paragraph',
                    editorConfig
                );

                editor.setup('exact');

                Event.observe(
                    'toggle-wysiwyg',
                    'click',
                    function(): void {
                        editor.toggle();
                        _this.isEditorVisible = !_this.isEditorVisible;
                    }.bind(editor)
                );

                _this.isEditorVisible = true;
            });
        },

        /*
         * Set the proper option after variant click
         */
        toggleOption(optionCategory: string, optionId: string): void {
            this.configuration.scenarios[optionCategory] = this.scenarioOptions[
                optionCategory
            ][optionId];
            this.configuration.scenarios[optionCategory].id = optionId;
        },

        isColumnsConfigAvailable(): boolean {
            return this.configuration.scenarios.reading.id !== 'optimal';
        },

        /*
         * Backward compatibility enhancement.
         * When new props are added to the 'configuration' prop, none of already saved component has it.
         * This leads to backward compatibility issues and JS errors for existing components
         * This method takes defaults of 'configuration' and merges is with exising configuration object
         */
        updateConfigurationProp(): void {
            const propDefaults: Object = this.$options.props.configuration.default();
            this.configuration = $.extend(
                {},
                propDefaults,
                this.configuration,
                true
            );
        },

        /**
         * 1. Replaces all self-closing tags to simple closing mark
         * 2. Replaces special chars for quots (&quot;) to the single quote mark
         * @param markup {string} - original html generated by WYSIWG
         * @return {string} - string w/o self-closing tags
         */
        fixMarkup(markup: string): string {
            return markup.replace(/\/>/g, '>').replace(/&quot;/g, "'");
        },
    },
};

export default paragraphConfigurator;
