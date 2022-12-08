import $ from 'jquery';
import $t from 'mage/translate';
import confirm from 'Magento_Ui/js/modal/confirm';

import componentConfigurator from '../../_component-configurator/component-configurator';

import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';
import componentAdder from '../../../utils/component-adder/component-adder';

/**
 * Accordion configurator component.
 * This component is responsible for displaying configuration of collapsible sections
 * @type {vuejs.ComponentOption} Vue component object.
 */

const groupPrototype: any = {
    headline: '',
    items: [
        {
            headline: '',
            content: '',
            isEditorOpened: true,
            editorId: `editor_${(Math.random() * (99999999 - 10000 + 1)) << 0}`,
        },
    ],
};

const accordionConfigurator: vuejs.ComponentOption = {
    mixins: [componentConfigurator],
    components: {
        'action-button': actionButton,
        'component-adder': componentAdder,
        'component-actions': componentActions,
    },
    template: `<div :class="componentCssClasses">
        <div class="cc-accordion-configurator__section cc-accordion-configurator__section--{{section.label | sectionID}}" v-if="ccConfig.accordion != null && ccConfig.accordion.custom_sections != null" v-for="section in ccConfig.accordion.custom_sections">
            <h3 class="cc-accordion-configurator__subtitle" v-if="section.label">{{section.label | translate}}</h3>
            <div class="cc-custom-fields">
                <div class="cc-custom-fields__form-group" v-for="field in section.content.fields">
                    <component
                        :is="'custom-element-' + field.type"
                        :configuration="configuration"
                        :field-configuration="field"
                    ></component>
                </div>
            </div>
        </div>
        <div class="cc-accordion-configurator__section">
            <h3 class="cc-accordion-configurator__subtitle">${$t(
                'Accordion width'
            )}</h3>
            <div class="cc-accordion-configurator__scenario-options">
                <div
                    :class="{
                        'cc-accordion-configurator__scenario-option--selected': configuration.scenarios.reading.id == optionId,
                    }"
                    class="cc-accordion-configurator__scenario-option"
                    v-for="(optionId, option) in scenarioOptions.reading"
                    @click="toggleOption('reading', optionId)">
                    <div class="cc-accordion-configurator__scenario-option-wrapper">
                        <svg class="cc-accordion-configurator__scenario-option-icon">
                            <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                        </svg>
                    </div>
                    <p class="cc-accordion-configurator__scenario-option-name">
                        ${$t('{{ option.name }}')}
                    </p>
                </div>
            </div>
        </div>
        <div class="cc-accordion-configurator__section">
            <h3 class="cc-accordion-configurator__subtitle">Global options</h3>
            <div class="cc-accordion-configurator__option">
                <div class="admin__actions-switch" data-role="switcher">
                    <input
                        type="checkbox"
                        class="admin__actions-switch-checkbox"
                        id="multiple-collapsible-switcher"
                        v-model="configuration.multiple_collapsible"
                    >
                    <label for="multiple-collapsible-switcher" class="admin__actions-switch-label">
                        <span class="admin__actions-switch-text">{{ 'Allow multiple sections to be opened at the same time' | translate }}</span>
                    </label>
                </div>
            </div>
            <div class="cc-accordion-configurator__option">
                <div class="admin__actions-switch" data-role="switcher">
                    <input
                        type="checkbox"
                        class="admin__actions-switch-checkbox"
                        id="expand-first-switcher"
                        v-model="configuration.expand_first"
                    >
                    <label for="expand-first-switcher" class="admin__actions-switch-label">
                        <span class="admin__actions-switch-text" v-if="!supportGroups">{{ 'Unfold first entry on page loaded' | translate }}</span>
                        <span class="admin__actions-switch-text" v-if="supportGroups">{{ 'Unfold first entry of each group on page loaded' | translate }}</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="cc-accordion-configurator__section cc-accordion-configurator__group" v-for="(groupIndex, group) in configuration.groups" id="cc-accordion-group-{{ groupIndex }}">
            <component-adder class="cc-component-adder cc-component-adder--first" v-if="supportGroups">
                <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-accordion-configurator__item-action-button" @click="createGroup(groupIndex)">
                    <svg class="cc-action-button__icon cc-action-button__icon--size_300"><use xlink:href="#icon_plus"></use></svg>
                </button>
            </component-adder>

            <div class="cc-accordion-configurator__group-content">
                <div class="cc-accordion-configurator__group-headline" v-if="supportGroups">
                    <div class="cc-input cc-input cc-accordion-configurator__group-headline-input-wrapper">
                        <input type="text" v-model="group.headline" class="cc-input__input cc-accordion-configurator__group-headline-input" placeholder="{{ 'Group title' | translate }}">
                    </div>
                    <div class="cc-accordion-configurator__group-tools">
                        <component-actions>
                            <template slot="cc-component-actions__buttons">
                                <button
                                    class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--up cc-accordion-configurator__group-action-button"
                                    :class="{'cc-action-button--look_disabled': isFirstItem(groupIndex)}"
                                    @click="moveGroupUp(groupIndex)"
                                    :disabled="isFirstItem(groupIndex)"
                                >
                                    <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                        <use xlink:href="#icon_arrow-up"></use>
                                    </svg>
                                </button>
                                <button
                                    class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--delete cc-accordion-configurator__group-action-button"
                                    :class="{'cc-action-button--look_disabled': configuration.groups.length < 2}"
                                    @click="deleteGroup(groupIndex)"
                                    :disabled="configuration.groups.length < 2"
                                >
                                    <svg class="cc-action-button__icon">
                                        <use xlink:href="#icon_trash-can"></use>
                                    </svg>
                                </button>
                                <button
                                    class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--down cc-accordion-configurator__group-action-button"
                                    :class="{'cc-action-button--look_disabled': isLastGroup(groupIndex)}"
                                    :disabled="isLastGroup(groupIndex)"
                                    @click="moveGroupDown(groupIndex)"
                                >
                                    <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                        <use xlink:href="#icon_arrow-down"></use>
                                    </svg>
                                </button>
                            </template>
                        </component-actions>
                    </div>
                </div>
                <div class="cc-accordion-configurator__items">
                    <div class="cc-accordion-configurator__item" id="cc-accordion-item-{{ groupIndex }}-{{ $index }}" v-for="item in group.items">
                        <div class="cc-input cc-accordion-configurator__item-headline">
                            <div class="cc-accordion-configurator__item-headline-input-wrapper">
                                <input type="text" v-model="item.headline" class="cc-input__input cc-accordion-configurator__input cc-accordion-configurator__item-headline-input" placeholder="{{ 'Headline' | translate }}">
                            </div>
                            <div class="cc-accordion-configurator__item-tools">
                                <component-actions>
                                    <template slot="cc-component-actions__buttons">
                                        <button
                                            class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--up cc-accordion-configurator__action-button"
                                            :class="{'cc-action-button--look_disabled': isFirstItem($index)}"
                                            @click="moveItemUp(groupIndex, $index)"
                                            :disabled="isFirstItem($index)"
                                        >
                                            <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                                <use xlink:href="#icon_arrow-up"></use>
                                            </svg>
                                        </button>
                                        <button
                                            class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--delete cc-accordion-configurator__action-button"
                                            :class="{'cc-action-button--look_disabled': group.items.length < 2}"
                                            @click="deleteItem(groupIndex, $index)"
                                            :disabled="group.items.length < 2"
                                        >
                                            <svg class="cc-action-button__icon">
                                                <use xlink:href="#icon_trash-can"></use>
                                            </svg>
                                        </button>
                                        <button
                                            class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--down cc-accordion-configurator__action-button"
                                            :class="{'cc-action-button--look_disabled': isLastItem(groupIndex, $index)}"
                                            :disabled="isLastItem(groupIndex, $index)"
                                            @click="moveItemDown(groupIndex, $index)"
                                        >
                                            <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                                <use xlink:href="#icon_arrow-down"></use>
                                            </svg>
                                        </button>
                                    </template>
                                </component-actions>
                            </div>
                        </div>
                        <div class="cc-input cc-accordion-configurator__item-content">
                            <div class="cc-accordion-configurator__item-editor">
                                <div class="buttons-set | cc-accordion-configurator__wysiwyg-buttons">
                                    <button
                                        type="button"
                                        class="scalable action-show-hide"
                                        @click="toggleEditor(item.editorId, groupIndex, $index)"
                                    >
                                        {{ item.isEditorOpened ? 'Hide Editor' : 'Show Editor' | translate }}
                                    </button>
                                    <button
                                        type="button"
                                        class="scalable action-add-widget plugin"
                                        @click="openWidgetModal(item.editorId)"
                                        v-show="!item.isEditorOpened"
                                    >
                                        {{ 'Insert Widget' | translate }}...
                                    </button>
                                    <button
                                        type="button"
                                        class="scalable action-add-image plugin"
                                        @click="openMediaModal(item.editorId)"
                                        v-show="!item.isEditorOpened"
                                    >
                                        {{ 'Insert Image' | translate }}...
                                    </button>
                                    <button
                                        type="button"
                                        class="scalable add-variable plugin"
                                        @click="openMagentoVariablesModal(item.editorId)"
                                        v-show="!item.isEditorOpened"
                                    >
                                        {{ 'Insert Variable' | translate }}...
                                    </button>
                                </div>
                                <textarea v-model="item.content" class="cc-input__textarea cc-accordion-configurator__textarea cc-accordion-configurator__item-content-textarea" placeholder="{{ 'Content (including HTML)' | translate }}" data-item-index="{{ groupIndex }}-{{ $index }}" id="{{ item.editorId }}"></textarea>
                            </div>
                        </div>
                    </div>

                    <button class="cc-action-button cc-action-button--look_default cc-action-button--type_icon cc-component-actions__button cc-component-actions__button--add cc-accordion-configurator__add-item-button" @click="createItem(groupIndex)">
                        <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                            <use xlink:href="#icon_plus"></use>
                        </svg>
                        {{ 'Add' | translate }}
                    </button>
                </div>
            </div>

            <component-adder class="cc-component-adder cc-component-adder--last" v-if="supportGroups && configuration.groups.length">
                <button is="action-button" class="cc-action-button cc-action-button--look_important cc-action-button--type_icon-only | cc-accordion-configurator__item-action-button" @click="createGroup(groupIndex + 1)">
                    <svg class="cc-action-button__icon cc-action-button__icon--size_300"><use xlink:href="#icon_plus"></use></svg>
                </button>
            </component-adder>
        </div>
    </div>`,
    props: {
        /*
         * Single's component configuration
         */
        configuration: {
            type: Object,
            default(): any {
                return {
                    customCssClass: '',
                    multiple_collapsible: true,
                    expand_first: true,
                    groups: [
                        JSON.parse(JSON.stringify({
                            headline: '',
                            items: [
                                {
                                    headline: '',
                                    content: '',
                                    isEditorOpened: true,
                                    editorId: `editor_${(Math.random() * (99999999 - 10000 + 1)) << 0}`,
                                },
                            ],
                        })),
                    ],
                    scenarios: {
                        reading: {},
                    },
                };
            },
        },
        /* Set prop with component name in order to
         * pass it to `component-configurator` methods
        */
        xmlConfigEntry: {
            type: String,
            default: 'accordion',
        },
        /* Obtain configuration of WYSIWYG editor (TinyMCE) */
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
    },
    computed: {
        /**
         * Checks projects setup from etc/view.xml and tells if grouping of items is supported
         */
        supportGroups: function() {
            return this.ccConfig.accordion != null && this.ccConfig.accordion.support_groups;
        },
    },
    data(): any {
        return {
            /**
             * Collects component's CSS classes
             */
            componentCssClasses: {
                'cc-accordion-configurator': true,
                'cc-accordion-configurator--with-groups': this.supportGroups,
            },
            /**
             * Object in which we keep all WYSIWYG instances
             */
            editorInstances: {},

            /**
             * Reading scenario options.
             */
            scenarioOptions: {
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
    events: {
        /**
         * Listen on save event from Content Configurator component.
         * Fix JSON markup (specialy for images uploaded ( {{widget=...}} ))
         * Delete all editorInitialized keys which are only needed to operate on currently opened configurator
         */
        'component-configurator__save'(): void {
            Object.keys(this.configuration.groups).forEach(
                (groupIndex: string) => {
                    Object.keys(this.configuration.groups[groupIndex].items).forEach(
                        (itemIndex: string) => {
                            this.$set(
                                `configuration.groups[${groupIndex}].items[${itemIndex}].content`,
                                this.fixMarkup(this.configuration.groups[groupIndex].items[itemIndex].content)
                            );

                            delete this.configuration.groups[groupIndex].items[itemIndex].editorInitialized;
                        }
                    );
                }
            );

            this.onSave();
        },
    },
    filters: {
        /**
         * Translates given string
         * @param txt {string} - original, english string to be translated
         * @return {string} - translated string
         */
        translate(txt: string): string {
            return $.mage.__(txt);
        },
    },
    methods: {
        /* Creates another Group
         * @param {number} index: position into which new group should be added
         */
        createGroup(index: number): void {
            this.configuration.groups.splice(
                index,
                0,
                JSON.parse(JSON.stringify({
                    headline: '',
                    items: [
                        {
                            headline: '',
                            content: '',
                            isEditorOpened: true,
                            editorId: `editor_${(Math.random() * (99999999 - 10000 + 1)) << 0}`,
                        },
                    ],
                }))
            );
            this.initWysiwyg(index, 0);
            this.onChange();
        },

        /* Removes group after Delete button is clicked
         * @param {index} index: index of a group in array.
         */
        deleteGroup(index: number): void {
            const component: any = this;

            confirm({
                content: $.mage.__(
                    'Are you sure you want to delete this group?'
                ),
                actions: {
                    confirm(): void {
                        Object.keys(component.configuration.groups[index].items).forEach(
                            (itemIndex: string) => {
                                delete component.editorInstances[`editor_${index}_${itemIndex}`];
                            }
                        );
                        component.configuration.groups.splice(index, 1);
                    },
                },
            });
        },

        /**
         * Moves group under given index up by swaping it with previous element.
         * @param {index} index: index of a group in array.
         */
        moveGroupUp(index: number): void {
            if (index > 0) {
                const $thisItem: any = $(`#cc-accordion-group-${index}`);
                const $prevItem: any = $(`#cc-accordion-group-${index - 1}`);

                $thisItem
                    .addClass('cc-accordion-configurator__group--animating')
                    .css(
                        'transform',
                        `translateY(${-Math.abs(
                            $prevItem.outerHeight(true)
                        )}px)`
                    );
                $prevItem
                    .addClass('cc-accordion-configurator__group--animating')
                    .css(
                        'transform',
                        `translateY(${$thisItem.outerHeight(true)}px )`
                    );

                setTimeout((): void => {
                    const thisGroupItems: any = this.configuration.groups[index].items;
                    const prevGroupItems: any = this.configuration.groups[index - 1].items;

                    Object.keys(thisGroupItems).forEach(
                        (itemIndex: string) => {
                            if (thisGroupItems[itemIndex].isEditorOpened) {
                                this.editorInstances[thisGroupItems[itemIndex].editorId].toggle();
                            }
                        }
                    );
                    Object.keys(prevGroupItems).forEach(
                        (itemIndex: string) => {
                            if (prevGroupItems[itemIndex].isEditorOpened) {
                                this.editorInstances[prevGroupItems[itemIndex].editorId].toggle();
                            }
                        }
                    );

                    this.configuration.groups.splice(
                        index - 1,
                        0,
                        this.configuration.groups.splice(index, 1)[0]
                    );
                    $thisItem
                        .removeClass('cc-accordion-configurator__group--animating')
                        .css('transform', '');
                    $prevItem
                        .removeClass('cc-accordion-configurator__group--animating')
                        .css('transform', '');

                    Object.keys(thisGroupItems).forEach(
                        (itemIndex: string) => {
                            if (thisGroupItems[itemIndex].isEditorOpened) {
                                this.editorInstances[thisGroupItems[itemIndex].editorId].toggle();
                            }
                        }
                    );
                    Object.keys(prevGroupItems).forEach(
                        (itemIndex: string) => {
                            if (prevGroupItems[itemIndex].isEditorOpened) {
                                this.editorInstances[prevGroupItems[itemIndex].editorId].toggle();
                            }
                        }
                    );

                    this.onChange();
                }, 400);
            }
        },

        /**
         * Moves group under given index down by swaping it with next element.
         * @param {number} index: index of group in array.
         */
        moveGroupDown(index: number): void {
            if (index < this.configuration.groups.length - 1) {
                const $thisItem: any = $(`#cc-accordion-group-${index}`);
                const $nextItem: any = $(`#cc-accordion-group-${index + 1}`);

                $thisItem
                    .addClass('cc-accordion-configurator__group--animating')
                    .css(
                        'transform',
                        `translateY(${$nextItem.outerHeight(true)}px)`
                    );
                $nextItem
                    .addClass('cc-accordion-configurator__group--animating')
                    .css(
                        'transform',
                        `translateY(${-Math.abs(
                            $thisItem.outerHeight(true)
                        )}px)`
                    );

                setTimeout((): void => {
                    const thisGroupItems: any = this.configuration.groups[index].items;
                    const nextGroupItems: any = this.configuration.groups[index + 1].items;

                    // Due to TinyMCE bug we need to disable editor before if changes its DOM position (if turned on)
                    Object.keys(thisGroupItems).forEach(
                        (itemIndex: string) => {
                            if (thisGroupItems[itemIndex].isEditorOpened) {
                                this.editorInstances[thisGroupItems[itemIndex].editorId].toggle();
                            }
                        }
                    );
                    Object.keys(nextGroupItems).forEach(
                        (itemIndex: string) => {
                            if (nextGroupItems[itemIndex].isEditorOpened) {
                                this.editorInstances[nextGroupItems[itemIndex].editorId].toggle();
                            }
                        }
                    );

                    this.configuration.groups.splice(
                        index + 1,
                        0,
                        this.configuration.groups.splice(index, 1)[0]
                    );
                    $thisItem
                        .removeClass('cc-accordion-configurator__group--animating')
                        .css('transform', '');
                    $nextItem
                        .removeClass('cc-accordion-configurator__group--animating')
                        .css('transform', '');

                    // Due to TinyMCE bug we need to re-enable editor before if changes its DOM position (if turned on)
                    Object.keys(thisGroupItems).forEach(
                        (itemIndex: string) => {
                            if (thisGroupItems[itemIndex].isEditorOpened) {
                                this.editorInstances[thisGroupItems[itemIndex].editorId].toggle();
                            }
                        }
                    );
                    Object.keys(nextGroupItems).forEach(
                        (itemIndex: string) => {
                            if (nextGroupItems[itemIndex].isEditorOpened) {
                                this.editorInstances[nextGroupItems[itemIndex].editorId].toggle();
                            }
                        }
                    );

                    this.onChange();
                }, 400);
            }
        },

        /**
         * Tells if group with given index is the last group in groups array.
         * @param  {number}  index: Index of the group.
         * @return {boolean} If group is last in array.
         */
        isLastGroup(index: number): boolean {
            return index === this.configuration.groups.length - 1;
        },

        /* Creates another group item.
         * @param {number} groupIndex: index of a group to which new item should be added
         */
        createItem(groupIndex: number): void {
            const newItem: any = {
                headline: '',
                content: '',
                isEditorOpened: true,
                editorId: `editor_${(Math.random() * (99999999 - 10000 + 1)) << 0}`,
            }

            this.configuration.groups[groupIndex].items.splice(
                this.configuration.groups[groupIndex].items.length,
                0,
                JSON.parse(JSON.stringify(newItem))
            );
            this.initWysiwyg(groupIndex, this.configuration.groups[groupIndex].items.length - 1);
            this.onChange();
        },

        /* Removes item after Delete button is clicked.
         * @param {number} groupIndex: index of a group in array.
         * @param {number} index: index of item in array.
         */
        deleteItem(groupIndex: number, index: number): void {
            const component: any = this;

            confirm({
                content: $.mage.__(
                    'Are you sure you want to delete this item?'
                ),
                actions: {
                    confirm(): void {
                        component.configuration.groups[groupIndex].items.splice(index, 1);
                        delete component.editorInstances[`editor_${groupIndex}_${index}`];
                    },
                },
            });
        },

        /**
         * Moves item under given index up by swaping it with previous element.
         * @param {number} groupIndex: index of a group in array.
         * @param {number} index: index of item in array.
         */
        moveItemUp(groupIndex: number, index: number): void {
            if (index > 0) {
                const $thisItem: any = $(`#cc-accordion-item-${groupIndex}-${index}`);
                const $prevItem: any = $(`#cc-accordion-item-${groupIndex}-${index - 1}`);

                $thisItem
                    .addClass('cc-accordion-configurator__item--animating')
                    .css(
                        'transform',
                        `translateY(${-Math.abs(
                            $prevItem.outerHeight(true)
                        )}px)`
                    );
                $prevItem
                    .addClass('cc-accordion-configurator__item--animating')
                    .css(
                        'transform',
                        `translateY(${$thisItem.outerHeight(true)}px )`
                    );

                setTimeout((): void => {
                    const thisItem: any = this.configuration.groups[groupIndex].items[index];
                    const prevItem: any = this.configuration.groups[groupIndex].items[index - 1];

                    // Due to TinyMCE bug we need to disable editor before if changes its DOM position (if turned on)
                    if (thisItem.isEditorOpened) {
                        this.editorInstances[thisItem.editorId].toggle();
                    }

                    if (prevItem.isEditorOpened) {
                        this.editorInstances[prevItem.editorId].toggle();
                    }

                    this.configuration.groups[groupIndex].items.splice(
                        index - 1,
                        0,
                        this.configuration.groups[groupIndex].items.splice(index, 1)[0]
                    );
                    $thisItem
                        .removeClass('cc-accordion-configurator__item--animating')
                        .css('transform', '');
                    $prevItem
                        .removeClass('cc-accordion-configurator__item--animating')
                        .css('transform', '');

                    // Due to TinyMCE bug we need to re-enable editor before if changes its DOM position (if turned on)
                    if (thisItem.isEditorOpened) {
                        this.editorInstances[thisItem.editorId].toggle();
                    }
                    if (prevItem.isEditorOpened) {
                        this.editorInstances[prevItem.editorId].toggle();
                    }

                    this.onChange();
                }, 400);
            }
        },

        /**
         * Moves item under given index down by swaping it with next element.
         * @param {number} groupIndex: index of a group in array.
         * @param {number} index: index of item in array.
         */
        moveItemDown(groupIndex: number, index: number): void {
            if (index < this.configuration.groups[groupIndex].items.length - 1) {
                const $thisItem: any = $(`#cc-accordion-item-${groupIndex}-${index}`);
                const $nextItem: any = $(`#cc-accordion-item-${groupIndex}-${index + 1}`);

                $thisItem
                    .addClass('cc-accordion-configurator__item--animating')
                    .css(
                        'transform',
                        `translateY(${$nextItem.outerHeight(true)}px)`
                    );
                $nextItem
                    .addClass('cc-accordion-configurator__item--animating')
                    .css(
                        'transform',
                        `translateY(${-Math.abs(
                            $thisItem.outerHeight(true)
                        )}px)`
                    );

                setTimeout((): void => {
                    const thisItem: any = this.configuration.groups[groupIndex].items[index];
                    const nextItem: any = this.configuration.groups[groupIndex].items[index + 1];

                    if (thisItem.isEditorOpened) {
                        this.editorInstances[thisItem.editorId].toggle();
                    }
                    if (nextItem.isEditorOpened) {
                        this.editorInstances[nextItem.editorId].toggle();
                    }

                    this.configuration.groups[groupIndex].items.splice(
                        index + 1,
                        0,
                        this.configuration.groups[groupIndex].items.splice(index, 1)[0]
                    );
                    $thisItem
                        .removeClass('cc-accordion-configurator__item--animating')
                        .css('transform', '');
                    $nextItem
                        .removeClass('cc-accordion-configurator__item--animating')
                        .css('transform', '');

                    if (thisItem.isEditorOpened) {
                        this.editorInstances[thisItem.editorId].toggle();
                    }
                    if (nextItem.isEditorOpened) {
                        this.editorInstances[nextItem.editorId].toggle();
                    }

                    this.onChange();
                }, 400);
            }
        },

        /**
         * Tells if item with given index is the first item in given group's array.
         * Used also to check group index.
         * @param  {number}  groupIndex: Index of the group.
         * @return {boolean} If item is first in array.
         */
        isFirstItem(index: number): boolean {
            return index === 0;
        },
        /**
         * Tells if item with given index is the last item in given group's array.
         * @param  {number}  groupIndex: Index of the group.
         * @param  {number}  index: Index of the item.
         * @return {boolean} If item is last in array.
         */
        isLastItem(groupIndex: number, index: number): boolean {
            return index === this.configuration.groups[groupIndex].items.length - 1;
        },

        /**
         * Initialize WYSIWYG editor for all items in configurator
         */
        initAllWysiwygEditors(): void {
            Object.keys(this.configuration.groups).forEach(
                (groupIndex: string) => {
                    Object.keys(this.configuration.groups[groupIndex].items).forEach(
                        (itemIndex: string) => {
                            this.initWysiwyg(
                                Number(groupIndex),
                                Number(itemIndex)
                            );
                        }
                    );
                }
            );
        },

        /* Opens modal with M2 built-in widget chooser
         */
        openWidgetModal(editorId: string): void {
            widgetTools.openDialog(
                `${
                    this.wysiwygCfg.plugins[1].options.window_url
                }widget_target_id/${editorId}/`
            );
        },
        /* Opens modal with M2 built-in media uploader
         */
        openMediaModal(editorId: string): void {
            MediabrowserUtility.openDialog(
                `${
                    this.uploaderBaseUrl
                }target_element_id/${editorId}/`,
                'auto',
                'auto',
                $.mage.__('Insert File...'),
                {
                    closed: true,
                }
            );
        },
        /* Opens modal with M2 built-in variables
         */
        openMagentoVariablesModal(editorId: string): void {
            MagentovariablePlugin.loadChooser(
                this.wysiwygCfg.plugins[2].options.url,
                editorId
            );
        },
        /**
         * Initializes TinyMCE WYSIWYG with given configuration (this.wysiwygConfig).
         * @param {number} groupIndex: index of group into which search for index
         * @param {number} index: index of item for which WYSIWYG should be initialized
         */
        initWysiwyg(groupIndex: number, index: number): void {
            const _this: any = this;
            const item: any = this.configuration.groups[groupIndex].items[index];

            require([
                'mage/adminhtml/wysiwyg/tiny_mce/setup',
            ], function(): void {
                _this.$set(
                    `editorInstances.${item.editorId}`,
                    new wysiwygSetup(
                        item.editorId,
                        _this.wysiwygCfg
                    )
                );

                if (item.isEditorOpened) {
                    _this.editorInstances[item.editorId].setup('exact');
                    _this.$set(`configuration.groups[${groupIndex}].items[${index}].editorInitialized`, true);
                }
            });
        },

        /**
         * Controls editor state (enables or disables)
         * In case it wasn't even initlialized yet - initializes it
         * @param {string} editorId => ID of WYSIWYG editor to find it in editorInstances object
         * @param {number} groupIndex => index of the group in which method should work in
         * @param {number} index => index of the item for which editor should be tolggled
         */
        toggleEditor(editorId: string, groupIndex: number, index: number): void {
            if (this.configuration.groups[groupIndex].items[index].hasOwnProperty('editorInitialized')) {
                this.editorInstances[editorId].toggle();
            } else {
                this.editorInstances[editorId].setup('exact');
                this.$set(`configuration.groups[${groupIndex}].items[${index}].editorInitialized`, true);
            }

            this.$set(
                `configuration.groups[${groupIndex}].items[${index}].isEditorOpened`,
                !this.configuration.groups[groupIndex].items[index].isEditorOpened
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

        /*
         * Set the proper option after variant click
         */
        toggleOption(optionCategory: string, optionId: string): void {
            this.configuration.scenarios[optionCategory] = this.scenarioOptions[
                optionCategory
            ][optionId];
            this.configuration.scenarios[optionCategory].id = optionId;
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
        },
    },
    ready(): void {
        if (this.wysiwygConfig !== '') {
            this.wysiwygCfg = JSON.parse(this.wysiwygConfig);
            this.wysiwygCfg.height = '130px';
        }

        this.initAllWysiwygEditors();
        this.updateConfigurationProp();
    },
};

export default accordionConfigurator;
