/**
 * CC components display switcher.
 * This component is responsible for collecting input about display of given component on the FE side
 * it determines whether component should be shown on mobile, desktop, both or shouldn't be shown at all
 * @type {vuejs.ComponentOption} Vue component object.
 */

const componentDisplayController: vuejs.ComponentOption = {
    template: `<div class="cc-component-display-controller {{ class }}">
        <div class="cc-component-display-controller__content">
            <slot></slot>
        </div>
    </div>`,
};

export default componentDisplayController;
