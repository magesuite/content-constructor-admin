import $ from 'jquery';

import componentConfigurator from '../../_component-configurator/component-configurator';

declare var widgetTools: any;
declare var WysiwygWidget: any;
declare var Base64: any;
declare var Hash: any;

const magentoWidgetConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    template: '#cc-magento-widget-template',
    props: {
        configuration: {
            type: Object,
            default(): Object {
                return {
                    widget: '',
                    customCssClass: '',
                    wrapInContainer: false,
                };
            },
        },
        widgetWindowUrl: {
            type: String,
            default: '',
        },
        xmlConfigEntry: {
            type: String,
            default: 'magento-widget',
        },
    },
    data(): Object {
        return {
            isWidgetFormLoading: true,
        };
    },
    events: {
        /**
         * When CC modal Save is clicked, trigger widget insertion instead of saving directly.
         * Overrides mixin's default onSave() — mixin skips when length > 1.
         * After insertWidget() completes, the textarea change handler calls onSave().
         */
        'component-configurator__save'(): void {
            if (this.isWidgetFormLoading) {
                return;
            }

            const $insertBtn: JQuery = $('#insert_button');
            const textarea: HTMLTextAreaElement = document.getElementById('cc-magento-widget-directive') as HTMLTextAreaElement;

            if ($insertBtn.length) {
                if (textarea) {
                    textarea.value = '';
                }
                $insertBtn.trigger('click');
            }
        },
    },
    ready(): void {
        this.updateConfigurationProp();

        const textarea: HTMLTextAreaElement = document.getElementById('cc-magento-widget-directive') as HTMLTextAreaElement;

        if (this.configuration.widget && textarea) {
            textarea.value = this.configuration.widget;
        }

        $('#cc-magento-widget-directive').on('change', (): void => {
            const value: string = ($('#cc-magento-widget-directive').val() as string).trim();

            if (value) {
                this.configuration.widget = value;
                this.onSave();
            }
        });

        this.loadWidgetForm();
    },
    beforeDestroy(): void {
        if (typeof widgetTools !== 'undefined') {
            this.clearActiveNode();
        }
    },
    methods: {
        updateConfigurationProp(): void {
            const propDefaults: any = (this.$options.props as any).configuration.default();
            this.configuration = $.extend({}, propDefaults, this.configuration);
        },

        clearActiveNode(): void {
            const activeNode: HTMLElement = widgetTools.getActiveSelectedNode();

            if (activeNode && (activeNode as HTMLElement).dataset.ccMagentoWidgetOwner) {
                widgetTools.setActiveSelectedNode(null);
            }
        },

        loadWidgetForm(): void {
            require(['mage/adminhtml/wysiwyg/widget'], (): void => {
                // Stub dialog references — form runs inline, no popup exists.
                // insertWidget() calls widgetTools.dialogWindow.modal('closeModal') after success;
                // without this stub it throws "Cannot read properties of null (reading 'modal')".
                const dialogStub: any = { modal: (): any => dialogStub };
                widgetTools.dialogWindow = dialogStub;
                widgetTools.closeDialogWindow = (): void => {};

                widgetTools.setActiveSelectedNode(null);

                if (this.configuration.widget) {
                    this.patchInitOptionValues();
                    const fakeNode: HTMLImageElement = document.createElement('img');
                    fakeNode.id = Base64.idEncode(this.configuration.widget);
                    fakeNode.dataset.ccMagentoWidgetOwner = 'true';
                    widgetTools.setActiveSelectedNode(fakeNode);
                }

                $.ajax({
                    type: 'POST',
                    url: `${this.widgetWindowUrl}widget_target_id/cc-magento-widget-directive/`,
                    data: { form_key: (window as any).FORM_KEY },
                    success: (html: string): void => {
                        $('#cc-magento-widget-form-container').html(html);
                        this.isWidgetFormLoading = false;
                    },
                });
            });
        },

        patchInitOptionValues(): void {
            if (WysiwygWidget.Widget.prototype._ccMagentoWidgetPatched) {
                return;
            }

            const origInitOptionValues: Function = WysiwygWidget.Widget.prototype.initOptionValues;

            WysiwygWidget.Widget.prototype.initOptionValues = function(): any {
                if (this.wysiwygExists()) {
                    return origInitOptionValues.call(this);
                }

                const activeNode: HTMLElement = widgetTools.getActiveSelectedNode();

                if (!activeNode || !(activeNode as HTMLElement).dataset.ccMagentoWidgetOwner) {
                    return origInitOptionValues.call(this);
                }

                let widgetCode: string;

                try {
                    widgetCode = Base64.idDecode(activeNode.id);
                } catch (e) {
                    return origInitOptionValues.call(this);
                }

                if (!widgetCode || widgetCode.indexOf('{{widget') === -1) {
                    return origInitOptionValues.call(this);
                }

                this.optionValues = new Hash({});

                (widgetCode as any).gsub(
                    /([a-z0-9\_]+)\s*\=\s*[\"]{1}([^\"]+)[\"]{1}/i,
                    function(match: any): void {
                        if (match[1] === 'type') {
                            this.widgetEl.value = match[2];
                        } else {
                            this.optionValues.set(match[1], match[2]);
                        }
                    }.bind(this)
                );

                this.loadOptions();
                $('#insert_button').removeClass('disabled');
                widgetTools.setActiveSelectedNode(null);

                return true;
            };

            WysiwygWidget.Widget.prototype._ccMagentoWidgetPatched = true;
        },
    },
};

export default magentoWidgetConfigurator;
