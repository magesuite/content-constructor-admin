import imageTeaserPreview from '../../../../components/image-teaser/preview/image-teaser';
import teaserPreview from '../../../../components/_teaser/preview/teaser';

/**
 * Extended Mosaic preview component.
 * This component is responsible for displaying preview of Extended Mosaic component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const extendedMosaicPreview: vuejs.ComponentOption = {
    mixins: [imageTeaserPreview],
    template: `<div data-role="spinner" class="cc-component-placeholder__loading" v-show="isLoading">
        <div class="spinner">
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
    </div>
    <div class="cc-image-teaser-preview cc-image-teaser-preview--extended-mosaic" v-show="!isLoading">
        <div class="cc-image-teaser-preview__wrapper">
            <ul class="cc-image-teaser-preview__scene cc-image-teaser-preview__scene-{{configuration.scenario.proportions.id}}" v-el:scene>
                <template v-for="item in configuration.items">
                    <li class="cc-image-teaser-preview__item">
                        <teaser-preview :configuration="configuration.items[$index]" :parent-configuration="configuration"></teaser-preview>
                    </li>
                </template>
            </ul>
        </div>
    </div>`,
};

export default extendedMosaicPreview;
