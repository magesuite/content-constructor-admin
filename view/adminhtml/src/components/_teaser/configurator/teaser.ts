import $ from 'jquery';
import alert from 'Magento_Ui/js/modal/alert';
import confirm from 'Magento_Ui/js/modal/confirm';

import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';

import teaserPreview from '../preview/teaser';

import componentConfigurator from '../../_component-configurator/component-configurator';

export const teaserPrototype: any = {
    image: {
        raw: '',
        decoded: '',
        aspect_ratio: '',
    },
    slogan: '',
    description: '',
    cta: {
        label: 'More',
        href: '',
    },
    content_align: {
        x: 1,
        y: 1,
    },
    optimizers: {
        color_scheme: 'dark',
        mirror_image: false,
        scenarios: {
            none: {
                enabled: true,
                intensity: 'disabled',
                direction: 'disabled',
                configurator: {
                    icon: '#contrast_none',
                    label: 'None',
                },
            },
            overlay: {
                enabled: false,
                intensity: 50,
                direction: 'disabled',
                configurator: {
                    icon: '#contrast_overlay',
                    label: 'Overlay',
                },
            },
            gradient: {
                enabled: false,
                intensity: 50,
                direction: {
                    x: 1,
                    y: 1,
                },
                configurator: {
                    icon: '#contrast_gradient',
                    label: 'Gradient shadow',
                },
            },
            container: {
                enabled: false,
                intensity: 50,
                direction: 'disabled',
                configurator: {
                    icon: '#contrast_container',
                    label: 'Container',
                },
            },
            text_shadow: {
                enabled: false,
                intensity: 50,
                direction: 'disabled',
                configurator: {
                    icon: '#contrast_text-shadow',
                    label: 'Text shadow',
                },
            },
        },
    },
};

interface IAdvancedField {
    label: string;
    type: string;
    id: string;
    name: string;
    options?: any[];
    isChecked?: boolean;
}

/**
 * Teaser configurator component.
 * This component handles logic for configuring teasers within CC components.
 * @type {vuejs.ComponentOption} Vue component object.
 */
const teaserConfigurator: vuejs.ComponentOption = {
    mixins: [componentConfigurator],
    components: {
        'action-button': actionButton,
        'component-actions': componentActions,
        'teaser-preview': teaserPreview,
    },
    template: `<div class="cc-teaser-configurator">
        <section class="cc-teaser-configurator__section">
            <div class="cc-teaser-configurator__content" id="cc-teaser-{{teaserIndex}}">
                <div class="cc-teaser-configurator__col cc-teaser-configurator__col--preview" :class="{'cc-teaser-configurator__col--image-uploaded': configuration.image.raw}">
                    <div class="cc-teaser-configurator__image-wrapper">

                        <teaser-preview :configuration="configuration" :parent-configuration="parentConfiguration"></teaser-preview>

                        <input type="hidden" class="cc-teaser-configurator__image-url" id="teaser-img-{{teaserIndex}}">

                        <div class="cc-teaser-configurator__actions">
                            <component-actions>
                                <template slot="cc-component-actions__buttons">
                                    <button
                                        class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--up cc-teaser-configurator__action-button"
                                        :class="{'cc-action-button--look_disabled': isFirstImageTeaser(teaserIndex)}"
                                        @click="moveImageTeaserUp(teaserIndex)"
                                        :disabled="isFirstImageTeaser(teaserIndex)"
                                    >
                                        <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                            <use xlink:href="#icon_arrow-up"></use>
                                        </svg>
                                    </button>
                                    <button
                                        class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--down cc-teaser-configurator__action-button"
                                        :class="{'cc-action-button--look_disabled': isLastImageTeaser(teaserIndex)}"
                                        :disabled="isLastImageTeaser(teaserIndex)"
                                        @click="moveImageTeaserDown(teaserIndex)"
                                    >
                                        <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                            <use xlink:href="#icon_arrow-down"></use>
                                        </svg>
                                    </button>
                                    <button
                                        class="cc-action-button cc-action-button--look_default cc-action-button--type_icon cc-component-actions__button cc-component-actions__button--upload-image  cc-teaser-configurator__action-button"
                                        @click="getImageUploader(teaserIndex)"
                                    >
                                        <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                            <use xlink:href="#icon_upload-image"></use>
                                        </svg>
                                        {{imageActionText | translate}}
                                    </button>
                                    <button
                                        class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--delete cc-teaser-configurator__action-button"
                                        @click="deleteTeaserItem(teaserIndex)"
                                    >
                                        <svg class="cc-action-button__icon">
                                            <use xlink:href="#icon_trash-can"></use>
                                        </svg>
                                    </button>
                                </template>
                            </component-actions>
                        </div>

                    </div>
                </div>
                <div class="cc-teaser-configurator__col cc-teaser-configurator__col--configurator">
                    <ul class="cc-teaser-configurator__tabs">
                        <li
                            v-for="(index, tab) in ccConfig.teaser.tabs"
                            v-if="tab && tab.label && tab.content"
                            class="cc-teaser-configurator__tab"
                            :class="{'cc-teaser-configurator__tab--current': currentTab == index}"
                            @click="switchTab(index)"
                        >
                            <span class="cc-teaser-configurator__tab-label">{{tab.label}}</span>
                        </li>
                    </ul>

                    <div
                        v-for="(index, tab) in ccConfig.teaser.tabs"
                        v-if="tab && tab.label && tab.content"
                        class="cc-teaser-configurator__tab-content"
                        :class="{'cc-teaser-configurator__tab-content--current': currentTab == index}"
                    >
                        <template v-if="tab.content && tab.content === '#content'">
                            <div
                                class="cc-teaser-configurator__tab-section"
                                :class="{'block-disabled': parentConfiguration.scenario.contentPlacement.id === 'under'}"
                            >
                                <label class="cc-input__label">{{'Content align' | translate }}:</label>
                                <div class="cc-teaser-configurator__position-grid">
                                    <template v-for="y in 3">
                                        <template v-for="x in 3">
                                            <span
                                                class="cc-teaser-configurator__position-grid-item"
                                                :class="{'cc-teaser-configurator__position-grid-item--active': isCurrentContentAlign(x+1, y+1)}"
                                                @click="setContentAlign(x+1, y+1)"
                                            ></span>
                                        </template>
                                    </template>
                                </div>
                            </div>

                            <div class="cc-teaser-configurator__tab-section">
                                <div class="cc-input cc-input--group">
                                    <div class="cc-input cc-teaser-configurator__form-element">
                                        <label for="cfg-teaser-{{teaserIndex}}-slogan" class="cc-input__label">{{'Slogan' | translate}}:</label>
                                        <textarea v-model="configuration.slogan | prettify" id="cfg-teaser-{{teaserIndex}}-slogan" class="cc-input__textarea"></textarea>
                                    </div>
                                    <div class="cc-input cc-teaser-configurator__form-element">
                                        <label for="cfg-teaser-{{teaserIndex}}-description" class="cc-input__label">{{'Description' | translate}}:</label>
                                        <textarea v-model="configuration.description | prettify" id="cfg-teaser-{{teaserIndex}}-description" class="cc-input__textarea"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="cc-teaser-configurator__tab-section">
                                <div class="cc-input cc-input--group">
                                    <div class="cc-input cc-teaser-configurator__form-element">
                                        <label for="cfg-teaser-{{teaserIndex}}-cta-label" class="cc-input__label">{{'CTA label' | translate}}:</label>
                                        <input type="text" v-model="configuration.cta.label" id="cfg-teaser-{{teaserIndex}}-cta-label" class="cc-input__input">
                                    </div>
                                    <div class="cc-input cc-input--type-addon cc-teaser-configurator__form-element">
                                        <label for="cfg-teaser-{{teaserIndex}}-cta-href" class="cc-input__label">{{'CTA target link' | translate}}:</label>
                                        <input type="text" class="cc-input__input cc-teaser-configurator__cta-target-link" v-model="configuration.cta.href" id="cfg-teaser-{{teaserIndex}}-cta-href">
                                        <span class="cc-input__addon cc-teaser-configurator__widget-chooser-trigger" @click="openCtaTargetModal(teaserIndex)">
                                            <svg class="cc-input__addon-icon">
                                                <use xlink:href="#icon_link"></use>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template v-if="tab.content && tab.content === '#style'">
                            <div class="cc-teaser-configurator__tab-section">
                                <label class="cc-input__label">{{'Contrast Optimizer' | translate}}</label>
                                <ul class="cc-teaser-configurator__optimizers">
                                    <li
                                        v-for="(index, optimizer) in configuration.optimizers.scenarios"
                                        class="cc-teaser-configurator__optimizer"
                                        :class="{'cc-teaser-configurator__optimizer--current': optimizer.enabled}"
                                        @click="setOptimizer(optimizer)"
                                    >
                                        <div class="cc-teaser-configurator__optimizer-icon-wrapper">
                                            <svg class="cc-teaser-configurator__optimizer-icon">
                                                <use xlink:href="{{optimizer.configurator.icon}}"></use>
                                            </svg>
                                        </div>
                                        <label class="cc-teaser-configurator__optimizer-label">
                                            {{optimizer.configurator.label | translate}}
                                        </label>
                                    </li>
                                </ul>

                                <div
                                    v-for="(key, optimizer) in configuration.optimizers.scenarios"
                                    class="cc-teaser-configurator__optimizer-tools"
                                    :class="{'cc-teaser-configurator__optimizer-tools--current': optimizer.enabled}"
                                >
                                    <div
                                        class="cc-teaser-configurator__optimizer-tool"
                                        :class="{'block-disabled': optimizer.intensity === 'disabled'}"
                                    >
                                        <label class="cc-input__label cc-teaser-configurator__optimizer-tool-label">{{'Intensity' | translate}}</label>
                                        <div class="cc-input cc-input--range">
                                            <input
                                                class="cc-input__range cc-input__range--step-{{ getOptimizerIntensityStep(key) }} cc-teaser-configurator__optimizer-range"
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="{{ getOptimizerIntensityStep(key) }}"
                                                v-model="optimizer.intensity"
                                                disabled="{{optimizer.intensity === 'disabled'}}"
                                            >
                                        </div>
                                        <span class="cc-teaser-configurator__optimizer-range-value">
                                            {{optimizer.intensity === 'disabled' ? 50 : optimizer.intensity}}
                                        </span>
                                    </div>

                                    <div
                                        class="cc-teaser-configurator__optimizer-tool"
                                        :class="{'block-disabled': optimizer.direction === 'disabled'}"
                                    >
                                        <label class="cc-input__label cc-teaser-configurator__optimizer-tool-label">{{'Direction' | translate}}</label>
                                        <div class="cc-teaser-configurator__position-grid cc-teaser-configurator__position-grid--small">
                                            <template v-for="y in 3">
                                                <template v-for="x in 3">
                                                    <span
                                                        class="cc-teaser-configurator__position-grid-item"
                                                        :class="{
                                                            'cc-teaser-configurator__position-grid-item--active': isCurrentOptimizerDirection(key, x+1, y+1),
                                                            'cc-teaser-configurator__position-grid-item--disabled': x+1 == 2 && y+1 == 2
                                                        }"
                                                        @click="setOptimizerDirection(key, x+1, y+1)"
                                                    ></span>
                                                </template>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="cc-teaser-configurator__tab-section">
                                <div class="cc-input cc-input--group cc-input cc-teaser-configurator__form-group">
                                    <div class="cc-input cc-teaser-configurator__form-element">
                                        <label for="cfg-teaser-{{teaserIndex}}-color-scheme" class="cc-input__label">{{'Text style' | translate}}:</label>
                                        <select
                                            name="cfg-teaser-{{teaserIndex}}-color-scheme"
                                            class="cc-input__select"
                                            id="cfg-teaser-{{teaserIndex}}-color-scheme"
                                            v-model="configuration.optimizers.color_scheme"
                                        >
                                            <option v-for="scheme in ccConfig.teaser.color_schemes" value="{{scheme}}">{{scheme | capitalize | translate}}</option>
                                        </select>
                                    </div>

                                    <div class="cc-input cc-teaser-configurator__form-element cc-teaser-configurator__switcher">
                                        <div class="admin__actions-switch" data-role="switcher" :class="{'block-disabled': !configuration.image.raw}">
                                            <label for="cfg-teaser-{{teaserIndex}}-mirror-image" class="cc-input__label">{{'Mirror image' | translate}}: </label>
                                            <input
                                                type="checkbox"
                                                class="admin__actions-switch-checkbox"
                                                id="cfg-teaser-{{teaserIndex}}-mirror-image"
                                                v-model="configuration.optimizers.mirror_image"
                                                :disabled="!configuration.image.raw"
                                            >
                                            <label for="cfg-teaser-{{teaserIndex}}-mirror-image" class="admin__actions-switch-label"></label>
                                            <span class="admin__actions-switch-text">
                                                {{ mirrorImageTextOutput | translate }}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </template>

                        <template v-if="tab.content && tab.content !== '#content' && tab.content !== '#style'">
                            <div class="cc-teaser-configurator__tab-section">
                                <template v-for="(fieldIndex, field) in tab.content.fields">
                                    <div
                                        v-if="field.type === 'select'"
                                        class="cc-input cc-input--group cc-input cc-teaser-configurator__form-group"
                                    >
                                        <div class="cc-input cc-teaser-configurator__form-element">
                                            <label for="{{fieldId | randomizeElementId}}" class="cc-input__label">
                                                {{field.label | translate}}:
                                            </label>
                                            <select class="cc-input__select">
                                                <option v-for="(value, label) in field.options" :value="value">{{ label }}</option>
                                            </select>
                                        </div>
                                    </div v-if="field.type === 'select'">

                                    <div
                                        v-if="field.type === 'input'"
                                        class="cc-input cc-input--group cc-input cc-teaser-configurator__form-group"
                                    >
                                        <div class="cc-input cc-teaser-configurator__form-element">
                                            <label for="{{fieldId | randomizeElementId}}" class="cc-input__label">
                                                {{field.label | translate}}:
                                            </label>
                                            <input type="text" class="cc-input__input" :value="field.value">
                                        </div>
                                    </div v-if="field.type === 'input'">

                                    <div
                                        v-if="field.type === 'textarea'"
                                        class="cc-input cc-input--group cc-input cc-teaser-configurator__form-group"
                                    >
                                        <div class="cc-input cc-teaser-configurator__form-element">
                                            <label for="{{fieldId | randomizeElementId}}" class="cc-input__label">
                                                {{field.label | translate}}:
                                                </label>
                                            <textarea type="text" class="cc-input__textarea">{{ field.value }}</textarea>
                                        </div>
                                    </div v-if="field.type === 'textarea'">
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </section>
    </div>`,
    props: {
        /**
         * Parent component configuration
         */
        parentConfiguration: {
            type: Object,
            default(): object {
                return {
                    items: [],
                    scenario: {
                        contentPlacement: {
                            id: 'over',
                        },
                    },
                };
            },
        },
        callerComponentType: {
            type: String,
            default: '',
        },
        class: {
            type: String,
            default: '',
        },
        teaserIndex: {
            type: Number,
            default: 0,
        },
        /* Obtain base-url for the image uploader */
        uploaderBaseUrl: {
            type: String,
            default: '',
        },
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
        /* Obtain admin url */
        adminPrefix: {
            type: String,
            default: 'admin',
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
        configuration: function(): object {
            return this.parentConfiguration.items[this.teaserIndex];
        },
        imageActionText: function(): string {
            return this.configuration.image.raw ? 'Change' : 'Upload';
        },
        mirrorImageTextOutput: function(): string {
            return this.configuration.optimizers.mirror_image ? 'Yes' : 'No';
        },
    },
    data(): any {
        return {
            currentTab: 0,
        };
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

        /**
         * Capitalizes given string
         * @param txt {string} - original string to be capitalized
         * @return {string} - capitalized string
         */
        capitalize(txt: string): string {
            return `${txt.charAt(0).toUpperCase()}${txt.slice(1)}`;
        },

        randomizeElementId(id: string): string {
            return `cfg-teaser-${id}-${Math.floor(
                Math.random() * (1000 - 99999)
            ) + 1000}`;
        },

        prettify: {
            /**
             * @param txt {string} - original v-model value
             * @return {String} - HTML ready
             */
            read(txt: string): string {
                return txt.replace(/<br\s*[\/]?>/gi, '\n');
            },

            /**
             * @param txt {string} - current content of v-model
             * @return {String} - stripped html
             */
            write(txt: string): any {
                return txt.replace(/\n/g, '<br>');
            },
        },
    },
    methods: {
        switchTab(index: number): void {
            this.currentTab = index;
        },

        setContentAlign(x: number, y: number): void {
            this.configuration.content_align.x = x;
            this.configuration.content_align.y = y;
        },

        isCurrentContentAlign(x: number, y: number): boolean {
            return (
                this.configuration.content_align.x === x &&
                this.configuration.content_align.y === y
            );
        },

        setOptimizerDirection(index: number, x: number, y: number): void {
            this.configuration.optimizers.scenarios[index].direction.x = x;
            this.configuration.optimizers.scenarios[index].direction.y = y;
        },

        isCurrentOptimizerDirection(
            index: number,
            x: number,
            y: number
        ): boolean {
            return (
                this.configuration.optimizers.scenarios[index].direction.x ===
                    x &&
                this.configuration.optimizers.scenarios[index].direction.y === y
            );
        },

        setOptimizer(optimizer: any): void {
            for (let opt in this.configuration.optimizers.scenarios) {
                this.configuration.optimizers.scenarios[opt].enabled = false;
            }

            optimizer.enabled = true;
        },

        getOptimizerIntensityStep(key: string): number {
            if (this.ccConfig.teaser.optimizers_intensity_steps[key]) {
                return this.ccConfig.teaser.optimizers_intensity_steps[key];
            }

            return 10;
        },

        /* Opens M2's built-in image manager modal.
         * Manages all images: image upload from hdd, select image that was already uploaded to server.
         * @param index {number} - index of image of image teaser.
         */
        getImageUploader(index: number): void {
            MediabrowserUtility.openDialog(
                `${this.uploaderBaseUrl}target_element_id/teaser-img-${index}/`,
                'auto',
                'auto',
                $.mage.__('Insert File...'),
                {
                    closed: true,
                }
            );
        },

        onRawImageUrlChange(event: $.Event): void {
            this.configuration.image.raw = event.target.value;
            const encodedImage: string = this.configuration.image.raw.match(
                '___directive/([a-zA-Z0-9]*)'
            )[1];
            this.configuration.image.decoded = Base64
                ? Base64.decode(encodedImage)
                : window.atob(encodedImage);

            const img: any = new Image();
            img.onload = (): void => {
                // this.configuration.image.raw = img.getAttribute('src');
                this.configuration.image.aspect_ratio = this.getAspectRatio(
                    img.naturalWidth,
                    img.naturalHeight
                );

                setTimeout((): void => {
                    this.checkImageSizes();
                    this.onChange();
                }, 400);
            };
            img.src = this.imageEndpoint.replace(
                '{/encoded_image}',
                encodedImage
            );
        },

        /**
         * Moves image teaser item under given index up by swaping it with previous element.
         * @param {number} index Image teaser's index in array.
         */
        moveImageTeaserUp(index: number): void {
            if (index > 0) {
                const $thisItem: any = $(`#cc-image-teaser-item-${index}`);
                const $prevItem: any = $(`#cc-image-teaser-item-${index - 1}`);

                $thisItem
                    .addClass('cc-teaser-configurator--animating')
                    .css(
                        'transform',
                        `translateY(${-Math.abs(
                            $prevItem.outerHeight(true)
                        )}px)`
                    );
                $prevItem
                    .addClass('cc-teaser-configurator--animating')
                    .css(
                        'transform',
                        `translateY(${$thisItem.outerHeight(true)}px )`
                    );

                setTimeout((): void => {
                    this.parentConfiguration.items.splice(
                        index - 1,
                        0,
                        this.parentConfiguration.items.splice(index, 1)[0]
                    );
                    $thisItem
                        .removeClass('cc-teaser-configurator--animating')
                        .css('transform', '');
                    $prevItem
                        .removeClass('cc-teaser-configurator--animating')
                        .css('transform', '');
                    this.onChange();
                }, 400);
            }
        },
        /**
         * Moves image teaser item under given index down by swaping it with next element.
         * @param {number} index Image teaser's index in array.
         */
        moveImageTeaserDown(index: number): void {
            if (index < this.parentConfiguration.items.length - 1) {
                const $thisItem: any = $(`#cc-image-teaser-item-${index}`);
                const $nextItem: any = $(`#cc-image-teaser-item-${index + 1}`);

                $thisItem
                    .addClass('cc-teaser-configurator--animating')
                    .css(
                        'transform',
                        `translateY(${$nextItem.outerHeight(true)}px)`
                    );
                $nextItem
                    .addClass('cc-teaser-configurator--animating')
                    .css(
                        'transform',
                        `translateY(${-Math.abs(
                            $thisItem.outerHeight(true)
                        )}px)`
                    );

                setTimeout((): void => {
                    this.parentConfiguration.items.splice(
                        index + 1,
                        0,
                        this.parentConfiguration.items.splice(index, 1)[0]
                    );
                    $thisItem
                        .removeClass('cc-teaser-configurator--animating')
                        .css('transform', '');
                    $nextItem
                        .removeClass('cc-teaser-configurator--animating')
                        .css('transform', '');
                    this.onChange();
                }, 400);
            }
        },
        /**
         * Tells if item with given index is the first image teaser.
         * @param  {number}  index Index of the image teaser.
         * @return {boolean}       If image teaser is first in array.
         */
        isFirstImageTeaser(index: number): boolean {
            return index === 0;
        },
        /**
         * Tells if image teaser with given index is the last image teaser.
         * @param  {number}  index Index of the image teaser.
         * @return {boolean}       If image teaser is last in array.
         */
        isLastImageTeaser(index: number): boolean {
            return index === this.parentConfiguration.items.length - 1;
        },

        /* Opens modal with M2 built-in widget chooser
         * @param index {number} - index of teaser item to know where to place output of widget chooser
         */
        openCtaTargetModal(index: number): void {
            widgetTools.openDialog(
                `${window.location.origin}/${
                    this.adminPrefix
                }/admin/widget/index/filter_widgets/Link/widget_target_id/cfg-teaser-${index}-cta-href/`
            );

            this.wWidgetListener(index);
        },
        /*
         * Check if widget chooser is loaded. If not, wait for it, if yes:
         * Override default onClick for "Insert Widget" button in widget's modal window
         * to clear input's value before inserting new one
         * @param {number} index Hero item's index in array.
         */
        wWidgetListener(itemIndex: number): void {
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
                        this.configuration.cta.href = '';
                        wWidget.insertWidget();
                    }
                );
            } else {
                window.setTimeout((): void => {
                    this.wWidgetListener(itemIndex);
                }, 300);
            }
        },

        /* Removes teaser item after Delete button is clicked
         * @param index {number} - index of teaser item to remove
         */
        deleteTeaserItem(index: number): void {
            const component: any = this;

            confirm({
                content: $.mage.__(
                    'Are you sure you want to delete this item?'
                ),
                actions: {
                    confirm(): void {
                        component.parentConfiguration.items.splice(index, 1);
                    },
                },
            });
        },

        /* Checks if images are all the same size
         * If not - displays error by firing up this.displayImageSizeMismatchError()
         * @param images {array} - array of all uploaded images
         */
        checkImageSizes(): boolean {
            const itemsToCheck = JSON.parse(
                JSON.stringify(this.parentConfiguration.items)
            ).filter(
                (item: any): boolean => {
                    return Boolean(item.image.aspect_ratio); // Filter out items without aspect ratio set yet.
                }
            );

            for (let i: number = 0; i < itemsToCheck.length; i++) {
                if (
                    itemsToCheck[i].aspect_ratio !==
                    itemsToCheck[0].aspect_ratio
                ) {
                    alert({
                        title: $.mage.__('Warning'),
                        content: $.mage.__(
                            'Images you have uploaded have different aspect ratio. This may cause this component to display wrong. We recommend to keep the same aspect ratio for all uploaded images.'
                        ),
                    });
                    return false;
                }
            }
            return true;
        },
        /* Returns greatest common divisor for 2 numbers
         * @param a {number}
         * @param b {number}
         * @return {number} - greatest common divisor
         */
        getGreatestCommonDivisor(a: number, b: number): number {
            if (!b) {
                return a;
            }

            return this.getGreatestCommonDivisor(b, a % b);
        },
        /* Returns Aspect ratio for 2 numbers based on GDC algoritm (greatest common divisor)
         * @param a {number}
         * @param b {number}
         * @return {number} - greatest common divisor
         */
        getAspectRatio(a: number, b: number): string {
            const c: number = this.getGreatestCommonDivisor(a, b);

            return `${a / c}:${b / c}`;
        },

        handleJqEvents(): void {
            $(`#teaser-img-${this.teaserIndex}`).on(
                'change',
                this.onRawImageUrlChange
            );
        },
    },
    ready(): void {
        this.handleJqEvents();
    },
};

export default teaserConfigurator;
