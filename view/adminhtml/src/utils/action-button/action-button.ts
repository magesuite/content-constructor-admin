/**
 * Action button component version.
 * Small component that allows to set it's content.
 *
 * @type {vuejs.ComponentOption} Vue component object.
 */
const actionButton: vuejs.ComponentOption = {
    template: `<button class="cc-action-button {{ class }}" @click="_onClick">
        <slot></slot>
    </button>`,
    props: {
        /**
         * Class property support to enable BEM mixes.
         */
        class: {
            type: [String, Object, Array],
            default: '',
        },
    },
    methods: {
        /**
         * Button click handler.
         * This handler triggers "action-button__click" event up the DOM chain when called.
         * @param {Event} event Click event object.
         */
        _onClick(event: Event): void {
            this.$dispatch('action-button__click', event);
        },
    },
};

export default actionButton;
