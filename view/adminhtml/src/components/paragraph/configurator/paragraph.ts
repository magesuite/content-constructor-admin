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
    mixins: [
        componentConfigurator,
    ],
    template: `<form class="cc-paragraph-configurator {{ classes }} | {{ mix }}" {{ attributes }} @submit.prevent="onSave">
        
        <div class="cc-paragraph-configurator__error" v-text="tempConfiguration.errorMessage" v-show="tempConfiguration.errorMessage">
        </div>

        <section class="cc-paragraph-configurator__section">
            <h3 class="cc-paragraph-configurator__subtitle">${$t( 'Paragraph width' )}</h3>
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
                        ${$t( '{{ option.name }}' )}
                    </p>
                </div>
            </div>
        </section>

        <section class="cc-paragraph-configurator__section">
            <div class="cc-input">
                <label for="input-cfg-id" class="cc-input__label">${$t( 'Identifier' )}:</label>
                <input type="text" name="cfg-id" v-model="tempConfiguration.identifier" id="input-cfg-id" class="cc-input__input cc-input__input--limited-width" @blur="stripSpaces( tempConfiguration.identifier )" maxlength="30">
            </div>
            <div class="cc-input">
                <label for="input-cfg-title" class="cc-input__label">${$t( 'Title' )}:</label>
                <input type="text" name="cfg-title" v-model="tempConfiguration.title" id="input-cfg-title" class="cc-input__input cc-input__input--limited-width" maxlength="100">
            </div>
            <div class="cc-input" v-if="isColumnsConfigAvailable()">
                <label for="input-cfg-columns" class="cc-input__label">${$t( 'Number of columns' )}:</label>
                <select name="input-cfg-columns" class="cc-input__select | cc-paragraph-configurator__select" id="input-cfg-columns" v-model="configuration.columns">
                    <option value="none">${$t( 'Don\'t split content - display full width' )}</option>
                    <option value="2">${$t( 'Split content into 2 columns' )}</option>
                    <option value="3">${$t( 'Split content into 3 columns' )}</option>
                    <option value="4">${$t( 'Split content into 4 columns' )}</option>
                </select>
                <div class="admin__field-note cc-input__note">
                    <span>${$t( 'Defines the way of content display. Content can be splitted into defined number of columns. This setting has no effect on small screen resolutions (such as smartphones) where content is always displayed in one column.' )}</span>
                </div>
            </div>
            <div class="cc-input">
                <label for="textarea-cfg-paragraph" class="cc-input__label cc-input__label--look-top-align">${$t( 'HTML' )}:</label>

                <div class="buttons-set | cc-paragraph-configurator__wysiwyg-buttons">
                    <button type="button" class="scalable action-show-hide" id="toggle-wysiwyg">${$t( 'Show / Hide Editor' )}</button>
                    <button type="button" class="scalable action-add-widget plugin" @click="openWidgetModal()" v-show="!isEditorVisible">${$t( 'Insert Widget' )}...</button>
                    <button type="button" class="scalable action-add-image plugin" @click="openMediaModal()" v-show="!isEditorVisible">${$t( 'Insert Image' )}...</button>
                    <button type="button" class="scalable add-variable plugin" @click="openMagentoVariablesModal()" v-show="!isEditorVisible">${$t( 'Insert Variable' )}...</button>
                </div>

                <textarea name="cfg-paragraph" v-model="tempConfiguration.content" id="textarea-cfg-paragraph" class="cc-input__textarea | cc-paragraph-configurator__textarea"></textarea>
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
                    blockId: '',
                    title: '',
                    columns: 'none',
                    scenarios: {
                        reading: {}
                    }
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
        /* get assets for displaying component images */
        assetsUrl: {
            type: String,
            default: '',
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
                    'full': {
                        name: 'Container width',
                        iconId: 'tw_content-width-text',
                    },
                    'optimal': {
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
        $('body').one().loadingPopup( {
            timeout: false,
        }).trigger('hideLoadingPopup');

        // If ID is already provided (means we're in edit mode)
        if (this.configuration.blockId) {
            // Show loader before request
            $('body').trigger('showLoadingPopup');

            // Send request to REST API to get CMS block data if in edit mode
            this.$http({
                headers: {
                    Accept: 'application/json',
                    Authorization: this.restToken,
                },
                method: 'get',
                url: `${ window.location.origin }/rest/all/V1/cmsBlock/${this.configuration.blockId}`,
            }).then((response: any): void => {
                const responseData: any = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data;
                // Hide loader
                $('body').trigger('hideLoadingPopup');

                // Update components tempConfiguration
                this.tempConfiguration.identifier = responseData.identifier;
                this.tempConfiguration.title = responseData.title;
                this.tempConfiguration.content = responseData.content;
                this.configuration.title = responseData.title;

                // initialize customized WYSIWYG
                if (this.wysiwygCfg) {
                    this.initWysiwyg();
                }

            }, (): void => {
                $('body').trigger('hideLoadingPopup');
            } );
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
            // Construct data for REST API
            const dataConstruct: any = {
                block: {
                    identifier: this.tempConfiguration.identifier,
                    title: this.tempConfiguration.title,
                    content: this.tempConfiguration.content,
                    active: true,
                },
            };

            // Show loader before request
            $('body').trigger('showLoadingPopup');

            // Send request to REST API
            this.$http( {
                headers: {
                    Accept: 'application/json',
                    Authorization: this.restToken,
                },
                method: this.configuration.blockId ? 'put' : 'post',
                url: this.configuration.blockId ? `${ window.location.origin }/rest/all/V1/cmsBlock/${this.configuration.blockId}` : `${ window.location.origin }/rest/all/V1/cmsBlock`,
                body: dataConstruct,
            }).then((response: any): void => {
                // If status is OK update component's configuration and run Save to save component data
                if (response.ok) {
                    const responseData: any = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data;
                    this.configuration.blockId = responseData.id;
                    this.configuration.title = responseData.title;

                    // Hide loader
                    $('body').trigger('hideLoadingPopup');

                    // Set headers back
                    Vue.http.headers.custom.Accept = 'text/html';

                    this.onSave();
                }
            }, (response: any): void => {
                // if failed and response returned any message, put it into error div, else put default text
                let responseData: any = {};
                try {
                    responseData = JSON.parse(response.data);

                    this.tempConfiguration.errorMessage = responseData.message 
                        ? responseData.message 
                        : $t('An unknown error occured. Please try again later.');

                    // Scroll modal to top to make message visible
                    const $configuratorModal: any = $('.content-constructor__modal--configurator').closest('.modal-content');

                    if($configuratorModal.length) {
                        $configuratorModal.animate({ 
                            scrollTop: 0,
                        }, 150);
                    }
                } catch (err) {
                    console.warn(`Could not parse response as JSON: ${err}`);
                };

                // Set headers back
                Vue.http.headers.custom.Accept = 'text/html';

                // Hide loader
                $('body').trigger('hideLoadingPopup');
            } );
        },
    },
    methods: {
        stripSpaces(str: string): void {
            const striped: string = str.split(' ').join('-').toLowerCase();
            this.tempConfiguration.identifier = striped;
        },
        /* Opens modal with M2 built-in widget chooser
         */
        openWidgetModal(): void {
            widgetTools.openDialog( `${this.wysiwygCfg.widget_window_url}widget_target_id/textarea-cfg-paragraph` );
        },
        /* Opens modal with M2 built-in media uploader
         */
        openMediaModal(): void {
            MediabrowserUtility.openDialog(`${this.uploaderBaseUrl}target_element_id/textarea-cfg-paragraph`,
                'auto',
                'auto',
                $t('Insert File...'),
                {
                    closed: true,
                },
            );
        },
        /* Opens modal with M2 built-in variables
         */
        openMagentoVariablesModal(): void {
            MagentovariablePlugin.loadChooser(`${window.location.origin}/${this.adminPrefix}/admin/system_variable/wysiwygPlugin/`, 'textarea-cfg-paragraph');
        },
        initWysiwyg(): void {
            const _this: any = this;

            window.tinyMCE_GZ = window.tinyMCE_GZ || {};
            window.tinyMCE_GZ.loaded = true;

            require([
                'mage/translate',
                'mage/adminhtml/events',
                'ccTinyMceWysiwygSetup',
                'mage/adminhtml/wysiwyg/widget',
            ], function(): void {
                // Setup (this global variable is already set in constructor.phtml)
                csWysiwygEditor = new ccTinyMceWysiwygSetup('textarea-cfg-paragraph', _this.wysiwygCfg);

                // Initialization
                csWysiwygEditor.setup('exact');
                _this.isEditorVisible = true;

                // Set listener for enable/disable editor button
                Event.observe('toggle-wysiwyg', 'click', function(): void {
                    csWysiwygEditor.toggle();
                    _this.isEditorVisible = !_this.isEditorVisible;
                }.bind(csWysiwygEditor));

                // Set handlers for editor
                const editorFormValidationHandler = csWysiwygEditor.onFormValidation.bind(csWysiwygEditor);
                varienGlobalEvents.attachEventHandler('formSubmit', editorFormValidationHandler);
                varienGlobalEvents.clearEventHandlers('open_browser_callback');

                // Add callback for editor's IMAGE button to open file uploader while clicked
                varienGlobalEvents.attachEventHandler('open_browser_callback', csWysiwygEditor.openFileBrowser);
            });
        },
        /*
         * Set the proper option after variant click
         */
        toggleOption(optionCategory: string, optionId: string): void {
            this.configuration.scenarios[optionCategory] = this.scenarioOptions[optionCategory][optionId];
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
            this.configuration = $.extend({}, propDefaults, this.configuration, true);
        }
    },
};

export default paragraphConfigurator;
