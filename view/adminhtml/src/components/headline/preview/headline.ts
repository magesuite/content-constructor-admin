/**
 * Single component information interface.
 */
interface IComponentInformation {
    title: string;
    subtitle: string;
}

/**
 * Headline preview component.
 * This component is responsible for displaying preview of headline component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const headlinePreview: vuejs.ComponentOption = {
    template: `<div class="cc-headline-preview">
        <h1 class="cc-headline-preview__headline">{{ configuration.title }}</h1>
        <h2 class="cc-headline-preview__subheadline">{{ configuration.subtitle }}</h2>
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

export default headlinePreview;
