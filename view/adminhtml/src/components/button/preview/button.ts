/**
 * Single component information interface.
 */
interface IComponentInformation {
    label: string;
    target: string;
}

/**
 * Button preview component.
 * This component is responsible for displaying preview of button component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const buttonPreview: vuejs.ComponentOption = {
    template: `<div class="cc-button-preview">
        <button class="cc-button-preview__button" type="button">{{ configuration.label }}</button>
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

export default buttonPreview;
