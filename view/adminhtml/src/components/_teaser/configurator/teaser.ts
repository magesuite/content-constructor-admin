import $ from 'jquery';
import alert from 'Magento_Ui/js/modal/alert';
import confirm from 'Magento_Ui/js/modal/confirm';

import actionButton from '../../../utils/action-button/action-button';
import componentActions from '../../../utils/component-actions/component-actions';

import teaserPreview from '../preview/teaser';

import componentConfigurator from '../../_component-configurator/component-configurator';

import customElementTextInput from '../../_custom-elements/text-input';
import customElementSelect from '../../_custom-elements/select';
import customElementTextarea from '../../_custom-elements/textarea';
import customElementCheckbox from '../../_custom-elements/checkbox';
import customElementRadio from '../../_custom-elements/radio';
import customElementPosition from '../../_custom-elements/position-grid';
import { getVideoTypeFromUrl, VideoType } from './_video/types';

export const teaserPrototype: any = {
    image: {
        raw: '',
        decoded: '',
        aspect_ratio: '',
        mobile: {
            raw: '',
            decoded: '',
            aspect_ratio: '',
        },
        tablet: {
            raw: '',
            decoded: '',
            aspect_ratio: '',
        },
    },
    video: {
        url: '',
        type: '',
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
    sizeSelect: '2x1',
    size: {
        x: 2,
        y: 1,
    },
    row: 1,
    position: 'left',
    isAvailableForMobile: 1,
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
    teaserType: '',
};

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
        'custom-element-input': customElementTextInput,
        'custom-element-select': customElementSelect,
        'custom-element-textarea': customElementTextarea,
        'custom-element-checkbox': customElementCheckbox,
        'custom-element-radio': customElementRadio,
        'custom-element-position': customElementPosition,
    },
    template: `
    <div
        class="cc-teaser-configurator cc-teaser-configurator--{{configuratorLayout}} cc-teaser-configurator--{{teaserType}}"
        :class="{
            'cc-teaser-configurator--actions-visible': videoInputVisible,
            'cc-teaser-configurator--error': videoTeaserPlaceholderError && !configuration.image.raw
        }"
    >
        <p class="cc-image-teaser-configurator__section-error" v-if="videoTeaserPlaceholderError && !configuration.image.raw">
            {{ 'Please upload an image, too. It will be used as a placeholder and a fallback for your video' | translate }}
        </p>
        <section class="cc-teaser-configurator__section">
            <div class="cc-teaser-configurator__content cc-teaser-configurator__content--{{currentImageUploader}}" id="cc-teaser-{{teaserIndex}}">
                <div class="cc-teaser-configurator__col cc-teaser-configurator__col--preview" :class="{'cc-teaser-configurator__col--image-uploaded': configuration.image.raw}">
                    <div class="cc-teaser-configurator__image-wrapper">

                        <teaser-preview :configuration="configuration" :parent-configuration="parentConfiguration" :teaser-type="teaserType" :support-breakpoint-dedicated-images="supportBreakpointDedicatedImages" :device-type="currentImageUploader"></teaser-preview>

                        <input type="hidden" class="cc-teaser-configurator__image-url cc-teaser-configurator__image-url--mobile" id="teaser-img-mobile-{{teaserIndex}}" data-teaser-index="{{teaserIndex}}" v-if="supportBreakpointDedicatedImages">
                        <input type="hidden" class="cc-teaser-configurator__image-url cc-teaser-configurator__image-url--tablet" id="teaser-img-tablet-{{teaserIndex}}" data-teaser-index="{{teaserIndex}}" v-if="supportBreakpointDedicatedImages">
                        <input type="hidden" class="cc-teaser-configurator__image-url" id="teaser-img-{{teaserIndex}}" data-teaser-index="{{teaserIndex}}">
                        <input type="hidden" class="cc-teaser-configurator__video-url" id="teaser-video-{{teaserIndex}}" data-teaser-index="{{teaserIndex}}">

                        <div class="cc-teaser-configurator__device-tabs" v-if="supportBreakpointDedicatedImages">
                            <component-actions>
                                <template slot="cc-component-actions__buttons">
                                    <button
                                        class="cc-action-button cc-action-button--look_default cc-component-actions__button cc-component-actions__button--device cc-teaser-configurator__action-button"
                                        :class="{'cc-action-button--selected': currentImageUploader === 'mobile'}"
                                        @click="switchUploaderBreakpoint('mobile')">
                                        {{ 'Mobile' | translate }}
                                    </button>
                                    <button
                                        class="cc-action-button cc-action-button--look_default cc-component-actions__button cc-component-actions__button--device cc-teaser-configurator__action-button"
                                        :class="{'cc-action-button--selected': currentImageUploader === 'tablet'}"
                                        @click="switchUploaderBreakpoint('tablet')">
                                        {{ 'Tablet' | translate }}
                                    </button>
                                    <button
                                        class="cc-action-button cc-action-button--look_default cc-component-actions__button cc-component-actions__button--device cc-teaser-configurator__action-button"
                                        :class="{'cc-action-button--selected': currentImageUploader === 'desktop'}"
                                        @click="switchUploaderBreakpoint('desktop')">
                                        {{ 'Desktop' | translate }}
                                    </button>
                                </template>
                            </component-actions>
                        </div>

                        <div class="cc-teaser-configurator__actions">
                            <component-actions>
                                <template slot="cc-component-actions__buttons">
                                    <template v-if="callerComponentType !== 'products-grid'">
                                        <button
                                            class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--up cc-teaser-configurator__action-button"
                                            :class="{'cc-action-button--look_disabled': isFirstImageTeaser(teaserIndex)}"
                                            @click="callerComponentType === 'teaser-and-text' ? toggleTeaserAndTextItems(teaserIndex) : moveImageTeaserUp(teaserIndex)"
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
                                            @click="callerComponentType === 'teaser-and-text' ? toggleTeaserAndTextItems(teaserIndex) : moveImageTeaserDown(teaserIndex)"
                                        >
                                            <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                                <use xlink:href="#icon_arrow-down"></use>
                                            </svg>
                                        </button>
                                    </template>
                                    <button
                                        title="{{ 'Open media uploader' | translate }}"
                                        class="cc-action-button cc-action-button--look_default cc-action-button--type_icon cc-component-actions__button cc-component-actions__button--upload-image cc-teaser-configurator__action-button"
                                        @click="getMediaUploader(teaserIndex)"
                                    >
                                        <svg class="cc-action-button__icon cc-action-button__icon--size_100">
                                            <use xlink:href="#icon_upload-image"></use>
                                        </svg>
                                        {{ imageActionText | translate }}
                                    </button>
                                    <template v-if="callerComponentType !== 'icon'">
                                        <button
                                            class="cc-action-button cc-action-button--look_default cc-action-button--type_icon cc-component-actions__button cc-component-actions__button--upload-video cc-teaser-configurator__action-button cc-teaser-configurator__action-button--video"
                                            @click="toggleVideoConfig(teaserIndex)"
                                        >
                                            <svg class="cc-action-button__icon">
                                                <use xlink:href="#icon_video"></use>
                                            </svg>
                                            {{ "Video" | translate }}
                                        </button>
                                    </template>
                                    <template v-if="callerComponentType !== 'products-grid'">
                                        <button
                                            class="cc-action-button cc-action-button--look_default cc-action-button--type_icon-only cc-component-actions__button cc-component-actions__button--delete cc-teaser-configurator__action-button"
                                            @click="deleteTeaserItem(teaserIndex)"
                                        >
                                            <svg class="cc-action-button__icon">
                                                <use xlink:href="#icon_trash-can"></use>
                                            </svg>
                                        </button>
                                    </template>
                                </template>
                            </component-actions>
                            <div
                                class="cc-teaser-configurator__video-link"
                                :class="{
                                    'cc-teaser-configurator__video-link--show': videoInputVisible
                                }"
                            >
                                <div class="cc-input cc-input--type-addon cc-teaser-configurator__form-element">
                                    <label for="cfg-teaser-{{teaserIndex}}-video-link" class="cc-input__label">{{ 'Video url' | translate }}:</label>
                                    <input
                                        v-model="videoInputValue"
                                        type="text"
                                        id="cfg-teaser-{{teaserIndex}}-video-link"
                                        class="cc-input__input"
                                        v-on:keyup.enter="setVideoData(teaserIndex)"
                                    >
                                        <span
                                            title="{{ 'Submit url' | translate }}"
                                            class="cc-input__addon cc-teaser-configurator__video-link-submit"
                                            :class="{'cc-teaser-configurator__video-link-submit--confirmed': configuration.video && videoInputValue === configuration.video.url}"
                                            @click="setVideoData(teaserIndex)"
                                        >
                                            <svg class="cc-input__addon-icon">
                                                <use xlink:href="#check"></use>
                                            </svg>
                                        </span>
                                        <span
                                            title="{{ 'Open media uploader' | translate }}"
                                            class="cc-input__addon cc-teaser-configurator__video-upload-trigger"
                                            @click="getMediaUploader(teaserIndex,'video')"
                                        >
                                            <svg class="cc-input__addon-icon">
                                                <use xlink:href="#icon_upload-file"></use>
                                            </svg>
                                        </span>
                                </div>
                                <div class="cc-teaser-configurator__video-support-info">
                                    {{ 'Supported services:' | translate }} <b>YouTube</b>, <b>Vimeo</b>, <b>Facebook</b>, <b>{{ 'File (mp4)' | translate }}</b>
                                </div>
                            </div>
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
                        <li
                            v-if="callerComponentType === 'magento-product-grid-teasers' || callerComponentType === 'products-grid'"
                            class="cc-teaser-configurator__tab"
                            :class="{'cc-teaser-configurator__tab--current': currentTab == callerComponentType}"
                            @click="switchTab(callerComponentType)"
                        >
                            <span class="cc-teaser-configurator__tab-label">{{ 'Position' | translate }}</span>
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
                                <label class="cc-input__label">{{ 'Content align' | translate }}:</label>
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
                                        <label for="cfg-teaser-{{teaserIndex}}-slogan" class="cc-input__label">{{ 'Slogan' | translate }}:</label>
                                        <textarea v-model="configuration.slogan | prettify" id="cfg-teaser-{{teaserIndex}}-slogan" class="cc-input__textarea"></textarea>
                                    </div>
                                    <div class="cc-input cc-teaser-configurator__form-element">
                                        <label for="cfg-teaser-{{teaserIndex}}-description" class="cc-input__label">{{ 'Description' | translate }}:</label>
                                        <textarea v-model="configuration.description | prettify" id="cfg-teaser-{{teaserIndex}}-description" class="cc-input__textarea"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="cc-teaser-configurator__tab-section">
                                <div class="cc-input cc-input--group">
                                    <div class="cc-input cc-teaser-configurator__form-element">
                                        <label for="cfg-teaser-{{teaserIndex}}-cta-label" class="cc-input__label">{{ 'CTA label' | translate }}:</label>
                                        <input type="text" v-model="configuration.cta.label" id="cfg-teaser-{{teaserIndex}}-cta-label" class="cc-input__input">
                                    </div>
                                    <div class="cc-input cc-input--type-addon cc-teaser-configurator__form-element">
                                        <label for="cfg-teaser-{{teaserIndex}}-cta-href" class="cc-input__label">{{ 'CTA target link' | translate }}:</label>
                                        <input type="text" class="cc-input__input cc-teaser-configurator__cta-target-link" v-model="configuration.cta.href" id="cfg-teaser-{{teaserIndex}}-cta-href">
                                        <span
                                            title="{{ 'Open widget selector' | translate }}"
                                            class="cc-input__addon cc-teaser-configurator__widget-chooser-trigger"
                                            @click="openCtaTargetModal(teaserIndex)"
                                        >
                                            <svg class="cc-input__addon-icon">
                                                <use xlink:href="#icon_link"></use>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template v-if="tab.content && tab.content === '#style'">
                            <div class="cc-teaser-configurator__tab-section cc-teaser-configurator__tab-section--optimizer">
                                <label class="cc-input__label">{{ 'Contrast Optimizer' | translate }}</label>
                                <ul
                                    class="cc-teaser-configurator__optimizers"
                                    :class="{'block-disabled': parentConfiguration.scenario.contentPlacement.id === 'under'}"
                                >
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
                                            {{ optimizer.configurator.label | translate }}
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
                                        <label class="cc-input__label cc-teaser-configurator__optimizer-tool-label">{{ 'Intensity' | translate }}</label>
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
                                        <label class="cc-input__label cc-teaser-configurator__optimizer-tool-label">{{ 'Direction' | translate }}</label>
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
                                        <label for="cfg-teaser-{{teaserIndex}}-color-scheme" class="cc-input__label">{{ 'Text style' | translate }}:</label>
                                        <select
                                            name="cfg-teaser-{{teaserIndex}}-color-scheme"
                                            class="cc-input__select"
                                            id="cfg-teaser-{{teaserIndex}}-color-scheme"
                                            v-model="configuration.optimizers.color_scheme"
                                        >
                                            <option v-for="scheme in ccConfig.teaser.color_schemes" value="{{scheme}}">{{ scheme | capitalize | translate}}</option>
                                        </select>
                                    </div>

                                    <div class="cc-input cc-teaser-configurator__form-element cc-teaser-configurator__switcher cc-teaser-configurator__switcher--mirror-image">
                                        <div class="admin__actions-switch" data-role="switcher" :class="{'block-disabled': !configuration.image.raw}">
                                            <label for="cfg-teaser-{{teaserIndex}}-mirror-image" class="cc-input__label">{{ 'Mirror image' | translate }}: </label>
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
                                <div class="cc-custom-fields cc-custom-fields--narrow">
                                    <div class="cc-custom-fields__form-group" v-for="field in tab.content.fields">
                                        <component
                                            :is="'custom-element-' + field.type"
                                            :configuration="configuration"
                                            :field-configuration="field"
                                            :teaser-index="teaserIndex"
                                        ></component>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div
                        class="cc-teaser-configurator__tab-content"
                        :class="{'cc-teaser-configurator__tab-content--current': currentTab == callerComponentType}"
                    >
                        <template v-if="currentTab === 'magento-product-grid-teasers' || currentTab ===  'products-grid'">
                            <div class="cc-teaser-configurator__tab-section">
                                <div class="cc-input cc-input--group">
                                    <div class="cc-input cc-teaser-configurator__form-element">
                                        <label for="cfg-mpg-teaser-{{ teaserIndex }}-size-select" class="cc-input__label">{{ 'Teaser size' | translate }}:</label>
                                        <select name="cfg-mpg-teaser-{{ teaserIndex }}-size-select" class="cc-input__select" id="cfg-mpg-teaser-{{ teaserIndex }}-size-select" v-model="configuration.sizeSelect" @change="setTeaserSize()">
                                            <option value="1x1">{{ '1x1' | translate }}</option>
                                            <option value="1x2">{{ '1x2' | translate }}</option>
                                            <option value="2x1">{{ '2x1' | translate }}</option>
                                            <option value="2x2">{{ '2x2' | translate }}</option>
                                        </select>
                                    </div>
                                    <div class="cc-input cc-teaser-configurator__form-element">
                                        <label for="cfg-mpg-teaser-{{ teaserIndex }}-position" class="cc-input__label">{{ 'Position' | translate}}:</label>
                                        <select name="cfg-mpg-teaser-{{ teaserIndex }}-position" class="cc-input__select" id="cfg-mpg-teaser-{{ teaserIndex }}-position" v-model="configuration.position">
                                            <option value="left">{{ 'Left' | translate }}</option>
                                            <option value="center">{{ 'Center' | translate }}</option>
                                            <option value="right">{{ 'Right' | translate }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="cc-input cc-input--group">
                                    <div class="cc-input cc-teaser-configurator__form-element">
                                        <label for="cfg-mpg-teaser-{{ teaserIndex }}-row" class="cc-input__label">{{ 'Row' | translate }}:</label>
                                        <select name="cfg-mpg-teaser{{ teaserIndex }}-row" class="cc-input__select" id="cfg-mpg-teaser-{{ teaserIndex }}-row" v-model="configuration.row">
                                            <option v-for="i in rowsCount" value="{{ i + 1 }}">{{ i + 1 }}</option>
                                        </select>
                                    </div>
                                    <div class="cc-input cc-teaser-configurator__form-element">
                                        <label for="cfg-mpg-teaser-{{ teaserIndex }}-mobile" class="cc-input__label">{{ 'Show in mobiles' | translate }}:</label>
                                        <div class="admin__actions-switch-block" data-role="switcher">
                                            <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-mpg-teaser-{{ teaserIndex }}-mobile" name="cfg-mpg-teaser-{{ teaserIndex }}-mobile" v-model="configuration.isAvailableForMobile">
                                            <label class="admin__actions-switch-label" for="cfg-mpg-teaser-{{ teaserIndex }}-mobile"">
                                                <span class="admin__actions-switch-text" data-text-on="{{ 'Yes' | translate }}" data-text-off="{{ 'No' | translate }}"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="cc-input">
                                    <p class="cc-teaser-configurator__note">{{ 'Big image teasers (2x1 and 2x2) might not be displayed on mobile phones. Please switch Show in mobiles toggle to No.' | translate }}</p>
                                </div>
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
        /* Default layout is row (image on the left, texts on the right, but can be also column) */
        configuratorLayout: {
            type: String,
            default: 'row',
        },
        teaserType: {
            type: String,
            default: 'full',
        },
        productsPerPage: {
            type: String,
            default: '30',
        },
        videoTeaserPlaceholderError: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        /**
         * Magento product grid teasers use configuration with 'teasers' instead of 'items'
         * Backend change is required, for now if teaser is called from product grid
         * then it uses teasers instead of items (as other components do)
         */
        configuration: function(): object {
            if (this.callerComponentType === 'magento-product-grid-teasers') {
                return this.parentConfiguration.teasers[this.teaserIndex];
            }
            return this.parentConfiguration.items[this.teaserIndex];
        },
        imageActionText: function(): string {
            if (this.currentImageUploader === 'mobile') {
                return this.configuration.image.mobile.raw ? 'Change' : 'Upload';
            } else if (this.currentImageUploader === 'tablet') {
                return this.configuration.image.tablet.raw ? 'Change' : 'Upload';
            } else {
                return this.configuration.image.raw ? 'Change' : 'Upload';
            }
        },
        mirrorImageTextOutput: function(): string {
            return this.configuration.optimizers.mirror_image ? 'Yes' : 'No';
        },
        /**
         * Magento product grid teasers use configuration with 'teasers' instead of 'items'
         * Backend change is required, for now if teaser is called from product grid
         * then it uses teasers instead of items (as other components do)
         */
        parentConfigurationVariation: function(): object {
            if (this.callerComponentType === 'magento-product-grid-teasers') {
                return this.parentConfiguration.teasers;
            } else {
                return this.parentConfiguration.items;
            }
        },
        /**
         * Count rows if 'position' tab is available in magento product grid teasers and products grid
         * @return {number} number of rows or null if not available
         */
        rowsCount: function(): number {
            if (this.callerComponentType === 'magento-product-grid-teasers') {
                return this.getCurrentFErowsCount();
            } else if (this.callerComponentType === 'products-grid') {
                return parseInt(this.parentConfiguration.rows_desktop, 10);
            } else {
                return null;
            }
        },
        supportBreakpointDedicatedImages: function(): boolean {
            return this.callerComponentType === 'mosaic' && this.ccConfig.mosaic.support_breakpoint_dedicated_images;
        },
    },
    data(): any {
        return {
            currentTab: 0,
            currentImageUploader: 'desktop',
            videoInputVisible: false,
            videoInputValue: '',
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

        prefixFieldId(id: string): string {
            return `cfg-teaser-${this.teaserIndex}-${id}`;
        },

        prettify: {
            /**
             * @param txt {string} - original v-model value
             * @return {String} - HTML ready
             */
            read(txt: string): string {
                return (txt ? txt.replace(/<br\s*[\/]?>/gi, '\n') : '');
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
                Number(this.configuration.content_align.x) === x &&
                Number(this.configuration.content_align.y) === y
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
            for (const opt in this.configuration.optimizers.scenarios) {
                if (this.configuration.optimizers.scenarios[opt]) {
                    this.configuration.optimizers.scenarios[opt].enabled = false;
                }
            }

            optimizer.enabled = true;
        },

        getOptimizerIntensityStep(key: string): number {
            if (this.ccConfig.teaser.optimizers_intensity_steps[key]) {
                return this.ccConfig.teaser.optimizers_intensity_steps[key];
            }

            return 10;
        },

        setBadgeAlign(x: number, y: number): void {
            this.configuration.badge.align.x = x;
            this.configuration.badge.align.y = y;
        },

        isCurrentBadgeAlign(x: number, y: number): boolean {
            return (
                Number(this.configuration.badge.align.x) === x &&
                Number(this.configuration.badge.align.y) === y
            );
        },

        setTeaserSize(): void {
            if (this.callerComponentType === 'magento-product-grid-teasers') {
                this.getCurrentFErowsCount();
                this.fixOverflowedRowsSetup();
            }

            const size: any = this.configuration.sizeSelect.split('x');
            this.configuration.size.x = size[0];
            this.configuration.size.y = size[1];
        },

        /**
         * When you open component after changes in M2 grid settings (when products per page chnaged)
         * Or, after you delete some teasers - this method updates available rows count on FE side and checks if
         * current row setting of the teaser is not higher than this.rowsCount.
         * If yes, it changes row setting to be equal this.rowsCount
         */
        fixOverflowedRowsSetup(): void {
            for (
                let i: number = 0;
                i < this.parentConfiguration.teasers.length;
                i++
            ) {
                if (this.parentConfiguration.teasers[i].row > this.rowsCount) {
                    this.parentConfiguration.teasers[i].row = this.rowsCount;
                }
            }
        },

        /**
         * Calculates how many rows there's displayed if the grid on front-end
         * Currently divider is hardcoded for desktop breakpoint
         * @return {number} number of rows in FE grid
         *
         * If a store uses horizontal filters, please adjust default_layout in etc/view.xml to "one-column"
         */
        getCurrentFErowsCount(): number {
            return Math.floor(
                this.getVirtualBricksLength() /
                    this.ccConfig.columns[this.ccConfig.columns.default_layout]
                        .desktop
            );
        },
        /**
         * Calculates "virtual" length of products in the grid
         * "virtual" means that teasers are included and their sizes are calculated too
         * f.e if teaser covers 2 tiles it counts as 2 brics, accordingly if it's 2x2 then it takes 4 bricks
         * @return {number} number of available bricks in grid
         */
        getVirtualBricksLength(): number {
            let virtualLength: number = parseInt(this.productsPerPage, 10);

            for (
                let i: number = 0;
                i < this.parentConfiguration.teasers.length;
                i++
            ) {
                virtualLength +=
                    this.parentConfiguration.teasers[i].size.x *
                        this.parentConfiguration.teasers[i].size.y;
            }

            return virtualLength;
        },

        getMediaUploader(index: number, type?: 'video'): void {
            let url: string;

            if (type === 'video') {
                url = `${this.uploaderBaseUrl}target_element_id/teaser-video-${index}/`;
            } else {
                url = this.currentImageUploader === 'desktop' ?
                    `${this.uploaderBaseUrl}target_element_id/teaser-img-${index}/` :
                    `${this.uploaderBaseUrl}target_element_id/teaser-img-${this.currentImageUploader}-${index}/`;
            }

            MediabrowserUtility.openDialog(
                url,
                'auto',
                'auto',
                $.mage.__('Insert File...'),
                {
                    closed: true,
                }
            );
        },
        onVideoFileUrlChange(event: $.Event, teaserIndex: number): void {
            const rawValue: string = event.target.value;
            const encodedImage: string = rawValue.match(
                '___directive/([a-zA-Z0-9]*)'
            )[1];
            const decoded: string = Base64
                ? Base64.decode(encodedImage)
                : window.atob(encodedImage);

            this.videoInputValue = decoded;
            this.setVideoData(teaserIndex);
        },
        onRawImageUrlChange(event: $.Event): void {
            const rawValue: string = event.target.value;
            const encodedImage: string = rawValue.match(
                '___directive/([a-zA-Z0-9]*)'
            )[1];
            const decoded: string = Base64
                ? Base64.decode(encodedImage)
                : window.atob(encodedImage);

            if (this.currentImageUploader !== 'desktop') {
                this.$set(`configuration.image.${this.currentImageUploader}.raw`, rawValue);
                this.$set(`configuration.image.${this.currentImageUploader}.decoded`, decoded);
            } else {
                this.$set('configuration.image.raw', rawValue);
                this.$set('configuration.image.decoded', decoded);
            }

            const img: any = new Image();

            img.onload = (): void => {
                const aspectRatio: string = this.getAspectRatio(
                    img.naturalWidth,
                    img.naturalHeight
                );
                const imgPath: string = img.getAttribute('src');

                if (this.currentImageUploader !== 'desktop') {
                    if (this.configuration.image[this.currentImageUploader] && this.configuration.image[this.currentImageUploader].image) {
                        this.$set(`configuration.image.${this.currentImageUploader}.image`, imgPath);
                    } else {
                        this.$set(`configuration.image.${this.currentImageUploader}.raw`, imgPath);
                    }

                    this.$set(`configuration.image.${this.currentImageUploader}.aspect_ratio`, aspectRatio);
                } else {
                    if (this.configuration.image && this.configuration.image.image) {
                        this.$set('configuration.image.image', imgPath);
                    } else {
                        this.$set('configuration.image.raw', imgPath);
                    }

                    this.$set('configuration.image.aspect_ratio', aspectRatio);
                }

                /**
                 * If Mosaic component has support for breakpoint-dedicated pics and image is uploaded to any of breakpoint and
                 * image was not uploaded either for other breakpoints, fill missing breakpoints with just uploaded image data.
                 */
                if (this.supportBreakpointDedicatedImages) {
                    ['mobile', 'tablet', 'desktop'].forEach((item: string): void => {
                        if (item === 'desktop') {
                            if (this.configuration.image.aspect_ratio === '') {
                                this.$set('configuration.image.image', imgPath);
                                this.$set('configuration.image.raw', imgPath);
                                this.$set('configuration.image.aspect_ratio', aspectRatio);
                                this.$set('configuration.image.decoded', decoded);
                            }
                        } else {
                            if (this.configuration.image[item].aspect_ratio === '') {
                                this.$set(`configuration.image.${item}.image`, imgPath);
                                this.$set(`configuration.image.${item}.raw`, imgPath);
                                this.$set(`configuration.image.${item}.aspect_ratio`, aspectRatio);
                                this.$set(`configuration.image.${item}.decoded`, decoded);
                            }
                        }
                    });
                }

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
                    this.parentConfigurationVariation.splice(
                        index - 1,
                        0,
                        this.parentConfigurationVariation.splice(index, 1)[0]
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
            if (index < this.parentConfigurationVariation.length - 1) {
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
                    this.parentConfigurationVariation.splice(
                        index + 1,
                        0,
                        this.parentConfigurationVariation.splice(index, 1)[0]
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
         * Toggle image teaser item right by swaping it with next element.
         * @param {number} index Image teaser's index in array.
         */
        toggleTeaserAndTextItems(index: number): void {
            const $thisItem: any = $(`#cc-image-teaser-item-0`);
            const $nextItem: any = $(`#cc-image-teaser-item-1`);

            $(`.cc-teaser-configurator`).toggleClass('cc-teaser-configurator--text-only');

            $thisItem
                .addClass('cc-teaser-configurator--animating')
                .css(
                    'transform',
                    `translateX(${$nextItem.outerWidth(true)}px)`
                );
            $nextItem
                .addClass('cc-teaser-configurator--animating')
                .css(
                    'transform',
                    `translateX(${-Math.abs(
                        $thisItem.outerWidth(true)
                    )}px)`
                );

            setTimeout((): void => {
                $thisItem
                    .removeClass('cc-teaser-configurator--animating')
                    .css('transform', '');
                $nextItem
                    .removeClass('cc-teaser-configurator--animating')
                    .css('transform', '');

                this.parentConfiguration.items.reverse();
                this.onChange();
            }, 400);
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

            if (this.callerComponentType === 'mosaic') {
                this.$dispatch('teaser__deleteItem', index);
            } else {
                confirm({
                    content: $.mage.__(
                        'Are you sure you want to delete this item?'
                    ),
                    actions: {
                        confirm(): void {
                            if (component.callerComponentType === 'magento-product-grid-teasers') {
                                component.parentConfiguration.teasers.splice(index, 1);
                                component.getCurrentFErowsCount();
                                component.fixOverflowedRowsSetup();
                            } else {
                                component.parentConfiguration.items.splice(index, 1);
                            }
                        },
                    },
                });
            }
        },

        /* Checks if images are all the same size
         * If not - displays error by firing up this.displayImageSizeMismatchError()
         * @param images {array} - array of all uploaded images
         */
        checkImageSizes(): boolean {

            // Do not open alert if there is another alert shown or Mosaic component is a caller one
            if ($('.modal-popup.confirm._show').length || this.callerComponentType === 'mosaic') {
                return;
            }

            const itemsToCheck = JSON.parse(
                JSON.stringify(this.parentConfigurationVariation)
            ).filter(
                (item: any): boolean => {
                    return Boolean(item.image.aspect_ratio); // Filter out items without aspect ratio set yet.
                }
            );

            for (let i: number = 0; i < itemsToCheck.length; i++) {
                if (
                    itemsToCheck[i].image.aspect_ratio !==
                    itemsToCheck[0].image.aspect_ratio
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

            for (let i: number = 0; i < itemsToCheck.length; i++) {
                if (
                    itemsToCheck[i].image.aspect_ratio !==
                    itemsToCheck[0].image.aspect_ratio
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
        /**
         * Returns greatest common divisor for 2 numbers
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
        /**
         * Returns Aspect ratio for 2 numbers based on GDC algoritm (greatest common divisor)
         * @param a {number}
         * @param b {number}
         * @return {number} - greatest common divisor
         */
        getAspectRatio(a: number, b: number): string {
            const c: number = this.getGreatestCommonDivisor(a, b);

            return `${a / c}:${b / c}`;
        },
        handleJqEvents(): void {
            $(`.cc-teaser-configurator__image-url[data-teaser-index="${this.teaserIndex}"]`)
                .off('change')
                .on(
                    'change',
                    this.onRawImageUrlChange
                );

            $(`.cc-teaser-configurator__video-url[data-teaser-index="${this.teaserIndex}"]`)
                .off('change')
                .on(
                    'change',
                    (event: $.event) => { this.onVideoFileUrlChange(event, this.teaserIndex); }
                );
        },
        switchUploaderBreakpoint(deviceType: string): void {
            this.currentImageUploader = deviceType;
        },
        /**
         * Shows/hides video configuration flyout.
         * Focuses input on show and resetores default input on close.
         * @param teaserIndex
         */
        toggleVideoConfig(teaserIndex: number): void {
            this.videoInputVisible = !this.videoInputVisible;
            if (this.videoInputVisible) {
                document.getElementById(`cfg-teaser-${teaserIndex}-video-link`).focus();
            }
        },
        /**
         * Based on provided url, saves video type and url
         * Supports short urls as well.
         * @param teaserIndex {number}
         */
        setVideoData(teaserIndex: number): void {
            if (this.videoInputValue.length) {
                const videoType: VideoType = getVideoTypeFromUrl(this.videoInputValue);

                if (videoType) {
                    this.configuration.video = {
                        url: this.videoInputValue,
                        type: videoType,
                    };
                    this.toggleVideoConfig(teaserIndex);
                } else {
                    alert({
                        title: $.mage.__('Warning'),
                        content: `
                            ${$.mage.__('Please make sure that provided URL is correct') } \n
                        `,
                    });
                }
            } else if (this.configuration.video && this.configuration.video.url.length) {
                this.clearVideoData();
                this.toggleVideoConfig(teaserIndex);
            } else {
                this.toggleVideoConfig(teaserIndex);
            }
        },
        /**
         * Clears video configuration
         */
        clearVideoData(): void {
            this.configuration.video = {
                url: '',
                type: '',
            };
        },
    },
    ready(): void {
        this.handleJqEvents();

        // get aspect ratio for images from hero image-teaser (old products grid)
        if (this.callerComponentType === 'products-grid') {
            if (!this.configuration.image.aspect_ratio) {
                const tempImg = new Image();
                tempImg.src = this.configuration.image.raw;
                tempImg.onload = () => {
                    this.configuration.image.aspect_ratio = this.getAspectRatio(
                        tempImg.width,
                        tempImg.height
                    );
                };
            }
        }

        if (this.callerComponentType === 'magento-product-grid-teasers') {
            this.fixOverflowedRowsSetup();
        }

        if (!this.configuration.teaserType) {
            this.configuration.teaserType = this.teaserType;
        }

        $(`#cc-image-teaser-item-${this.teaserIndex} .cc-teaser-configurator`).toggleClass('cc-teaser-configurator--text-only', this.configuration.teaserType === 'text-only');

        if (this.configuration.video) {
            this.videoInputValue = this.configuration.video.url;
        }
    },
};

export default teaserConfigurator;
