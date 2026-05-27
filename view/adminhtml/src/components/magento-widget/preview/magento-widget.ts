const magentoWidgetPreview: vuejs.ComponentOption = {
    template: `<div class="cc-magento-widget-preview">
        <div class="cc-magento-widget-preview__content">
            <svg class="cc-magento-widget-preview__bg">
                <use xlink:href="#icon_component-magento-widget"></use>
            </svg>
            <h2 class="cc-magento-widget-preview__title">{{ widgetTypeName }}</h2>
        </div>
    </div>`,
    props: {
        configuration: {
            type: Object,
        },
        class: {
            type: [String, Object, Array],
            default: '',
        },
    },
    computed: {
        widgetTypeName(): string {
            if (!this.configuration || !this.configuration.widget) {
                return 'Magento Widget';
            }
            const match: RegExpMatchArray | null = this.configuration.widget.match(/type="([^"]+)"/);
            if (!match) {
                return 'Magento Widget';
            }
            const parts: string[] = match[1].split('\\');
            return parts[parts.length - 1];
        },
    },
};

export default magentoWidgetPreview;
