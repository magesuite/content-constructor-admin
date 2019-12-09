interface itemPrototype {
    headline: string,
    content: string,
};

/**
 * Single component information interface.
 */
interface IComponentInformation {
    groups: Array<itemPrototype>,
}

/**
 * Accordion preview component.
 * This component is responsible for displaying preview of accordion component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const accordionPreview: vuejs.ComponentOption = {
    template: `<div class="cc-accordion-preview">
        <div class="cc-accordion-preview__wrapper">
            <ul class="cc-accordion-preview__items">
                <li 
                    :class="{
                        'cc-accordion-preview__item': true,
                        'cc-accordion-preview__item--open': $index === 0,
                    }"
                    v-for="item in configuration.groups[0].items" 
                    v-if="$index < 10"
                >
                    <div class="cc-accordion-preview__item-headline">
                        {{ item.headline }}
                        <svg class="cc-accordion-preview__arrow"><use xlink:href="#icon_accordion-arrow"></use></svg>
                    </div>
                    <div class="cc-accordion-preview__item-content" v-if="$index === 0">{{ item.content }}</div>
                </li>
            </ul>
        </div>
    </div>`,
    props: {
        /**
         * Single's component configuration 
         */
        configuration: {
            type: Object,
        },
    },
};

export default accordionPreview;
