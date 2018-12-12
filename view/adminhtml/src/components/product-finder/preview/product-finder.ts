import $ from 'jquery';
import $t from 'mage/translate';

/**
 * Single columns configuration interface.
 */
interface IOptionsPerRow {
    mobile: number;  // 1-3
    table: number;   // 2-4
    desktop: number; // 3-6
};

/**
 * Single step data interface.
 */
interface IStepInformation {
    id: string;
    title: string;
    description: string;
    options: object;
};

/**
 * Single component information interface.
 */
interface IComponentInformation {
    optionsPerRow: IOptionsPerRow;
    steps: IStepInformation[];
};


/**
 * Product Finder preview component.
 * This component is responsible for displaying preview of Product Finder component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const productFinderPreview: vuejs.ComponentOption = {
    template: `<div class="cc-product-finder-preview">
        <div class="cc-product-finder-preview__scene" :class="[ isConfiguratorPreview ? 'cc-product-finder-preview__scene--configurator' : '' ]" v-if="configuration.steps.length">
            <h2 class="cc-product-finder-preview__scene-title" :data-placeholder="'No title' | translate">{{{ configuration.steps[stepIndex].title }}}</h2>

            <div class="cc-product-finder-preview__scene-description" :data-placeholder="'No description' | translate">{{{ configuration.steps[stepIndex].description }}}</div>

            <ul class="cc-product-finder-preview__scene-options">
                <template v-for="option in configuration.steps[stepIndex].options">
                    <li class="cc-product-finder-preview__scene-option">
                        <figure class="cc-product-finder-preview__scene-option-figure">
                            <svg class="cc-product-finder-preview__scene-option-placeholder" v-show="!option.image">
                                <use xlink:href="#icon_image-placeholder"></use>
                            </svg>
                            <img class="cc-product-finder-preview__scene-option-image" src="{{ option.image | decode }}" alt="" v-show="option.image" />
                        </figure>
                        <span class="cc-product-finder-preview__scene-option-label" :data-placeholder="'No label' | translate">{{{ option.label }}}</span>
                    </li>
                </template>
            </ul>
        </div>

        <div class="cc-product-finder-preview__scene cc-product-finder-preview__scene--faded" v-if="configuration.steps.length > 1 && !isConfiguratorPreview"></div>
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
        /* Obtain image endpoint to place permanent url for uploaded images */
        imageEndpoint: {
            type: String,
            default: '',
        },
        /* Obtain index of step that shall be displayed in preview */
        stepIndex: {
            type: Number,
            default: 0,
        },
        /* Tells if preview is used in configurator component or in layout builder */
        isConfiguratorPreview: {
            type: Boolean,
            default: false,
        },
    },
    filters: {
        /** Decodes delivered image format to Base64, additionally removing escaped double-quotes
         * @param imageUrl {string} - image url in Magento-like format with escaped double-quotes, f.e. {{media url=\"wysiwyg/image.jpg\"}}
         * @return {string} - permanent image url that can be viewed in Magento's admin panel OR empty if something went wrong
         */
        decode(imageUrl: string): string {
            const decodedImage: string = window.btoa(imageUrl.replace(/\\\//g, "/"));

            if (decodedImage && decodedImage.length && this.imageEndpoint.length) {
                return this.imageEndpoint.replace('{/encoded_image}', decodedImage);
            }

            return '';
        },
        /** Translates given string
         * @param txt {string} - original, english string to be translated
         * @return {string} - translated string
         */
        translate(txt: string): string {
            return $.mage.__(txt);
        },
    },
};

export default productFinderPreview;
