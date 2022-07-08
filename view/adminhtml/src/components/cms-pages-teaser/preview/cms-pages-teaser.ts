import $ from 'jquery';
import $t from 'mage/translate';
/**
 * Single component information interface.
 */
interface IComponentInformation {
    tags: string;
    limit: string;
    currentScenario: {
        desktopLayout: {
            id: string,
        },
    };
}

/**
 * CMS teaser preview component.
 * This component is responsible for displaying preview of CMS teaser component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const cmsPagesTeaserPreview: vuejs.ComponentOption = {
    template: `<div class="cc-cms-pages-teaser-preview">
        <div class="cc-cms-pages-teaser-preview__wrapper">
            <ul class="cc-component-placeholder__pills">
                <li class="cc-component-placeholder__pill cc-component-placeholder__pill--clean">
                    <span class="cc-component-placeholder__pill-label"><strong>${ $t('Tags') }:</strong></span>
                </li>
                <li class="cc-component-placeholder__pill" v-for="tag in getTagsArray()">
                    <span class="cc-component-placeholder__pill-label">{{ tag }}</span>
                </li>
            </ul>
            <ul class="cc-cms-pages-teaser-preview__scene" v-el:scene>
                <li class="cc-cms-pages-teaser-preview__item" v-for="(n, index) in 4">
                    <div class="cc-cms-pages-teaser-preview__teaser-wrapper">
                        <svg class="cc-cms-pages-teaser-preview__teaser">
                            <use xlink:href="#icon_cms-teaser-placeholder"></use>
                        </svg>
                    </div>
                </li>
            </ul>
            <ul class="cc-component-placeholder__pills cc-component-placeholder__pills--on-bottom">
                <li class="cc-component-placeholder__pill">
                    <span class="cc-component-placeholder__pill-label">${ $t('Teasers limit') }: <strong>{{ configuration.limit }}</strong></span>
                </li>
                <li class="cc-component-placeholder__pill">
                    <span class="cc-component-placeholder__pill-label">${ $t('Desktop layout') }: <strong>{{ configuration.currentScenario.desktopLayout.id }} ${ $t('teasers per row') }</strong></span>
                </li>
                <li class="cc-component-placeholder__pill">
                    <span class="cc-component-placeholder__pill-label">${ $t('Mobile layout') }: <strong>{{ configuration.currentScenario.mobileLayout.id }}</strong></span>
                </li>
            </ul>
        </div>
    </div>`,
    props: {
        configuration: {
            type: Object,
        },
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: [String, Object, Array],
            default: '',
        },
    },
    methods: {
        getTagsArray(): any[] {
            return this.configuration.tags.split(',');
        },
    },
};

export default cmsPagesTeaserPreview;
