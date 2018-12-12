import $ from 'jquery';
import $t from 'mage/translate';

import componentConfigurator from '../../_component-configurator/component-configurator';

/**
 * Static block configurator component.
 * This component is responsible for displaying static block's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const staticBlockConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    template: '#cc-static-block-template',
    props: {
        configuration: {
            type: Object,
            default(): Object {
                return {
                    identifier: '',
                    title: '',
                    resetstyles: false,
                };
            },
        },
    },
    events: {
        /**
         * Listen on save event from Content Configurator component.
         */
        'component-configurator__save'(): void {
            const selectedOption: any = this.$els.cmsBlocksSelect.options[this.$els.cmsBlocksSelect.selectedIndex];

            if (this.configuration.identifier === selectedOption.value && this.configuration.identifier !== '') {
                this.configuration.title = selectedOption.text;
                this.onSave();
            }
        },
    },
};

export default staticBlockConfigurator;
