import $t from 'mage/translate';

/**
 * Single component information interface.
 */
interface IComponentInformation {
    bgType: string;
    color: string;
}

/**
 * background preview component.
 * This component is responsible for displaying preview of background component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const backgroundPreview: vuejs.ComponentOption = {
    template: `<div class="cc-background-preview" style="background: {{ configuration.color }};">
        <h1 class="cc-background-preview__type">${ $t('Background type: ') }{{ configuration.bgType }}</h1>
    </div>`,
    props: {
        /**
         * Single's component configuration 
         */
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
};

export default backgroundPreview;
