import $ from 'jquery';
import $t from 'mage/translate';

import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';

import componentConfigurator from '../../_component-configurator/component-configurator';
import categoryPicker from '../../../utils/category-picker/category-picker';

/**
 * CMS Pages Teaser configurator component.
 * This component is responsible for displaying CMS pages teaser configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const cmsPagesTeaserConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    template: `<div class="cc-cms-pages-teaser-configurator {{ classes }} | {{ mix }}" {{ attributes }}>
        <section class="cc-cms-pages-teaser-configurator__section">
            <h3 class="cc-cms-pages-teaser-configurator__subtitle">${ $t('Data source') }</h3>
            <div class="cc-cms-pages-teaser-configurator__scenario-options cc-cms-pages-teaser-configurator__scenario-options--inputs">
                <div class="cc-input cc-input--type-inline | cc-cms-pages-teaser-configurator__section-option">
                    <label class="cc-input__label | cc-cms-pages-teaser-configurator__section-option-label">${$t( 'CMS Tags' )}:</label>
                    <input type="hidden" v-model="configuration.tags" @change="onChange" id="cp-cms-pages-teaser">
                </div>
                <div class="cc-cms-pages-teaser-configurator__section-option">
                    <div class="cc-input">
                        <label class="cc-input__label" for="cfg-cmspt-page-ids">${$t( 'CMS Pages IDs' )}:</label>
                        <input type="text" name="cfg-cmspt-page-ids" class="cc-input__input" id="cfg-cmspt-page-ids" v-model="configuration.ids" @change="onChange">
                    </div>
                    <div class="cc-input cc-input--type-inline cc-input--type-hint">
                        <span class="cc-input__hint cc-input__hint--under-field">${$t( 'Multiple, comma-separated.' )}</span>
                    </div>
                    <div class="cc-input cc-input--type-inline cc-input--type-hint" v-if="configuration.ids.length">
                        <span class="cc-input__hint cc-input__hint--info-mark">${$t( 'Providing list of comma separated IDs will result in ignoring any CMS tags (if specified). Only pages with specified IDs will be displayed in exactly the same order as they are provided in the field.' )}</span>
                    </div>
                </div>

                <div class="cc-input cc-input--type-inline | cc-cms-pages-teaser-configurator__section-option">
                    <label for="cfg-cmspt-limit" class="cc-input__label | cc-cms-pages-teaser-configurator__section-option-label">${$t( 'Teasers limit' )}:</label>
                    <select name="cfg-cmspt-limit" class="cc-input__select" id="cfg-cmspt-limit" v-model="configuration.limit" @change="onChange">
                        <option value="4">${$t( '4 teasers' )}</option>
                        <option value="8">${$t( '8 teasers' )}</option>
                        <option value="16">${$t( '16 teasers' )}</option>
                        <option value="1000">${$t( 'All available teasers (no limit)' )}</option>
                    </select>
                </div>

                <div class="cc-input cc-input--type-inline | cc-cms-pages-teaser-configurator__section-option">
                    <label for="cfg-cmspt-text-variant" class="cc-input__label | cc-cms-pages-teaser-configurator__section-option-label">${$t( 'Display variant' )}:</label>
                    <select name="cfg-cmspt-text-variant" class="cc-input__select" id="cfg-cmspt-text-variant" v-model="configuration.textDisplayVariant" @change="onChange">
                        <template v-for="(idx, scenario) in imageTeasersContentPositions">
                            <option value="{{ idx + 1 }}">${$t( '{{ scenario }}' )}</option>
                        </template>
                    </select>
                </div>
            </div>
        </section>

        <section class="cc-cms-pages-teaser-configurator__section">
            <h3 class="cc-cms-pages-teaser-configurator__subtitle">Desktop Layout</h3>
            <div class="cc-cms-pages-teaser-configurator__scenario-options">
                <div class="cc-cms-pages-teaser-configurator__scenario-options-list">
                    <li
                        :class="{
                            'cc-cms-pages-teaser-configurator__option--selected': configuration.currentScenario.desktopLayout.id == optionId,
                        }"
                        class="cc-cms-pages-teaser-configurator__option"
                        v-for="(optionId, option) in scenarioOptions.desktopLayout"
                        @click="toggleOption('desktopLayout', optionId)">
                        <div class="cc-cms-pages-teaser-configurator__option-wrapper">
                            <svg class="cc-cms-pages-teaser-configurator__option-icon">
                                <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                            </svg>
                        </div>
                        <p class="cc-cms-pages-teaser-configurator__option-name">
                            ${$t( '{{ option.name }}' )}
                        </p>
                    </li>
                </div>
            </div>
        </section>

        <section class="cc-cms-pages-teaser-configurator__section">
            <h3 class="cc-cms-pages-teaser-configurator__subtitle">Mobile Layout</h3>
            <div class="cc-cms-pages-teaser-configurator__scenario-options">
                <ul class="cc-cms-pages-teaser-configurator__scenario-options-list">
                    <li
                        :class="{
                            'cc-cms-pages-teaser-configurator__option--selected': configuration.currentScenario.mobileLayout.id == optionId,
                        }"
                        class="cc-cms-pages-teaser-configurator__option"
                        v-for="(optionId, option) in scenarioOptions.mobileLayout"
                        @click="toggleOption('mobileLayout', optionId)">
                        <div class="cc-cms-pages-teaser-configurator__option-wrapper">
                            <svg class="cc-cms-pages-teaser-configurator__option-icon">
                                <use v-bind="{ 'xlink:href': '#' + option.iconId }"></use>
                            </svg>
                        </div>
                        <p class="cc-cms-pages-teaser-configurator__option-name">
                            ${$t( '{{ option.name }}' )}
                        </p>
                    </li>
                </ul>
            </div>
        </section>
    </div>`,
    /**
     * Get dependencies
     */
    components: {
        'action-button': actionButton,
        'component-actions': componentActions,
    },
    props: {
        /**
         * Image teaser configuration
         */
        configuration: {
            type: Object,
            default(): Object {
                return {
                    tags: '',
                    ids: '',
                    limit: '1000',
                    textDisplayVariant: '1',
                    currentScenario: {
                        desktopLayout: {},
                        mobileLayout: {},
                    },
                };
            },
        },
        /* Obtain stringified JSON with CMS tags data */
        cmsTags: {
            type: String,
            default: '',
        },
        /* Obtain content-constructor's config file */
        ccConfig: {
            type: Object,
            default(): any {
                return {};
            },
        },
    },
    computed: {
        imageTeasersContentPositions: function(): object {
            const data: object = this.ccConfig.image_teasers_content_positions;
            return Object.keys(data).map(key => (<any>data)[key]);
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
    data(): any {
        return {
            scenarioOptions: {
                // Desktop layout scenario elements.
                desktopLayout: {
                    '2': {
                        name: '2 in row',
                        iconId: 'dl_2',
                        teasersNum: 2,
                    },
                    '4': {
                        name: '4 in row',
                        iconId: 'dl_4',
                        teasersNum: 4,
                    },
                },
                // Mobile layout scenario elements.
                mobileLayout: {
                    'slider': {
                        name: 'Slider',
                        iconId: 'ml_slider',
                    },
                    'grid': {
                        name: 'Grid',
                        iconId: 'ml_2-2',
                    },
                },
            },
        };
    },
    methods: {
        /*
         * Set the proper option after variant click
         */
        toggleOption(optionCategory: string, optionId: string): void {
            this.configuration.currentScenario[optionCategory] = this.scenarioOptions[optionCategory][optionId];
            this.configuration.currentScenario[optionCategory].id = optionId;
        },
    },
    ready(): void {
        if (this.cmsTags !== '') {
            this.categoryPicker = new categoryPicker($('#cp-cms-pages-teaser'), JSON.parse(this.cmsTags), {
                multiple: true,
                minSearchQueryLength: 1,
                placeholders: {
                    select: $t('Select tags...'),
                    doneButton: $t('Done'),
                    search: $t('Type tag-name to search...'),
                    empty: $t('There are no tags matching your selection'),
                    removeCrumb: $t('Remove this tag'),
                },
                classes: {
                    baseMix: 'cc-category-picker--min',
                },
            });
        }
    }
}

export default cmsPagesTeaserConfigurator;
