import $ from 'jquery';

/**
 * Image interface
 */
interface IComponentInformationImage {
    raw: string;
    decoded: string;
    endpoint: string;
    aspect_ratio: string;
}

/**
 * Call To Action interface
 */
interface IComponentInformationCta {
    label: string;
    href: string;
}

/**
 * Content align interface
 */
interface IComponentInformationContentAlign {
    x: number;
    y: number;
}

/**
 * Optimizers scenarios interface
 */
interface IComponentInformationSingleOptimizerScenario {
    enabled: boolean;
    intensity: number;
    direction: string | object;
    configurator: object;
}

/**
 * Optimizers scenarios interface
 */
interface IComponentInformationOptimizersScenarios {
    none: IComponentInformationSingleOptimizerScenario;
    overlay: IComponentInformationSingleOptimizerScenario;
    gradient: IComponentInformationSingleOptimizerScenario;
    container: IComponentInformationSingleOptimizerScenario;
    text_shadow: IComponentInformationSingleOptimizerScenario;
}

/**
 * Optimizers interface
 */
interface IComponentInformationOptimizers {
    color_scheme: string;
    mirror_image: boolean;
    scenarios: IComponentInformationOptimizersScenarios;
}

/**
 * Badge interface
 */
interface IComponentBadge {
    value: string;
    align: IComponentInformationContentAlign;
}

/**
 * Single component information interface.
 */
interface IComponentInformation {
    image: IComponentInformationImage;
    slogan: string;
    description: string;
    cta: IComponentInformationCta;
    content_align: IComponentInformationContentAlign;
    optimizers: IComponentInformationOptimizers;
}

/**
 * Teaser preview component.
 * This component is responsible for displaying preview of single Teaser component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const teaserPreview: vuejs.ComponentOption = {
    template: `<div class="cc-teaser-preview cc-teaser-preview--content-{{ parentConfiguration.scenario.contentPlacement.id ? parentConfiguration.scenario.contentPlacement.id : 'over' }}{{configuration.image.image || configuration.image.raw ? '' : ' cc-teaser-preview--no-image'}}">
        <div class="cc-teaser-preview__slide cc-teaser-preview__slide--scheme-{{configuration.optimizers.color_scheme}}" v-el:scale-relation>
            <div class="cc-teaser-preview__aspect-ratio" v-if="configuration.image.aspect_ratio && parentConfiguration.scenario.contentPlacement.id !== 'under'" :style="{paddingTop: aspectRatio}"></div>
            <div class="cc-teaser-preview__slide-wrapper">
                <div class="cc-teaser-preview__aspect-ratio" v-if="configuration.image.aspect_ratio && parentConfiguration.scenario.contentPlacement.id === 'under'" :style="{paddingTop: aspectRatio}"></div>
                <figure class="cc-teaser-preview__figure">
                    <img
                        :src="configuration.image.image || configuration.image.raw"
                        class="cc-teaser-preview__image"
                        :class="{'cc-teaser-preview__image--mirror': configuration.optimizers.mirror_image}"
                        v-if="configuration.image.image || configuration.image.raw"
                    >
                    <svg class="cc-teaser-preview__image-placeholder" v-if="!configuration.image.image && !configuration.image.raw">
                        <use xlink:href="#icon_image-placeholder"></use>
                    </svg>
                </figure>

                <div class="cc-teaser-preview__overlay" v-if="configuration.optimizers.scenarios.overlay.enabled" :style="{opacity: configuration.optimizers.scenarios.overlay.intensity / 100}"></div>
                <div
                    v-if="configuration.optimizers.scenarios.gradient.enabled"
                    class="cc-teaser-preview__gradient cc-teaser-preview__gradient--direction-x-{{configuration.optimizers.scenarios.gradient.direction.x}} cc-teaser-preview__gradient--direction-y-{{configuration.optimizers.scenarios.gradient.direction.y}}"
                    :style="{opacity: configuration.optimizers.scenarios.gradient.intensity / 100}"
                ></div>
                <div
                    class="cc-teaser-preview__badge-wrapper cc-teaser-preview__badge-wrapper--content-align-x-{{configuration.badge.align.x}} cc-teaser-preview__badge-wrapper--content-align-y-{{configuration.badge.align.y}}"
                    v-if="configuration.badge.value"
                >
                    {{configuration.badge.value}}
                </div>

                <div
                    class="cc-teaser-preview__content-wrapper cc-teaser-preview__content-wrapper--content-align-x-{{configuration.content_align.x}} cc-teaser-preview__content-wrapper--content-align-y-{{configuration.content_align.y}}"
                    v-if="configuration.slogan || configuration.description || (configuration.cta.label && configuration.cta.href)"
                >
                    <div
                        class="cc-teaser-preview__content"
                        :class="{'cc-teaser-preview__content--container': configuration.optimizers.scenarios.container.enabled}"
                    >
                        <div
                            v-if="configuration.optimizers.scenarios.container.enabled"
                            class="cc-teaser-preview__optimizer-container"
                            :style="{opacity: configuration.optimizers.scenarios.container.intensity / 100}"
                        ></div>

                        <div
                            class="cc-teaser-preview__text-content cc-teaser-preview__text-content--text-shadow-{{ configuration.optimizers.scenarios.text_shadow.enabled ? configuration.optimizers.scenarios.text_shadow.intensity : ''}}"
                            :class="{'cc-teaser-preview__text-content--text-shadow': configuration.optimizers.scenarios.text_shadow.enabled}"
                            :style="{fontSize: fontSize + 'px'}"
                        >
                            <h2 v-if="configuration.slogan" class="cc-teaser-preview__slogan" @change="recalculateFontSize()">{{{configuration.slogan}}}</h2>
                            <p v-if="configuration.description" class="cc-teaser-preview__description" @change="recalculateFontSize()">{{{configuration.description}}}</p>
                        </div>

                        <div v-if="configuration.cta.label && configuration.cta.href" class="cc-teaser-preview__cta">
                            <span role="button" class="cc-teaser-preview__cta-button" title="{{configuration.cta.href}}">
                                <span class="cc-teaser-preview__cta-button-span">{{configuration.cta.label}}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    props: {
        /**
         * Parent component configuration
         */
        parentConfiguration: {
            type: Object,
            default(): object {
                return {};
            },
        },
        configuration: {
            type: Object,
        },
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
    },
    computed: {
        aspectRatio: function (): string {
            if (this.configuration.image.aspect_ratio.length) {
                const rawArr: any[] = this.configuration.image.aspect_ratio.split(
                    ':'
                );
                return `${(rawArr[1] / rawArr[0]) * 100}%`;
            }
            return '0';
        },
    },
    data(): any {
        return {
            scaleRatio: 0.002,
            initialFontSize: 14,
            isScaleScheduled: false,
            fontSize: this.recalculateFontSize(),
        };
    },
    methods: {
        recalculateFontSize(): number {
            try {
                return (
                    this.initialFontSize *
                    this.$els.scaleRelation.offsetWidth *
                    this.scaleRatio
                );
            } catch (error) { }
        },

        setEvents(): void {
            window.addEventListener(
                'resize',
                (): any => {
                    if (this.isScaleScheduled) {
                        return;
                    }
                    this.isScaleScheduled = true;

                    window.requestAnimationFrame(
                        (): void => {
                            this.isScaleScheduled = false;
                            const fontSize = this.recalculateFontSize();
                            if (fontSize) {
                                this.fontSize = fontSize;
                            }
                        }
                    );
                }
            );
        },
    },
    ready(): void {
        this.setEvents();
    },
};

export default teaserPreview;
