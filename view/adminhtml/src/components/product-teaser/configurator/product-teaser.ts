import $t from 'mage/translate';
 
import componentConfigurator from '../../_component-configurator/component-configurator';
 
/**
 * Product teaser configurator component.
 * This component is responsible for displaying product teaser configuration modal
 * @type {vuejs.ComponentOption} Vue component object.
 */
const productTeaserConfigurator: vuejs.ComponentOption = {
    mixins: [
        componentConfigurator,
    ],
    /**
     * Get dependencies
     */
    template: `
    <form class="cc-product-teaser-configurator {{ classes }} | {{ mix }}" {{ attributes }}>
        <div class="cc-input cc-input--type-inline">
            <label class="cc-input__label" for="cfg-pc-sku">${$t( 'SKU' )}:</label>
            <input type="text" name="cfg-pc-sku" class="cc-input__input" id="cfg-pc-sku" v-model="configuration.sku" @change="onChange">
        </div>
    </form>
    `,
    props: {
        configuration: {
            type: Object,
            default(): any {
                return {
                    sku: '',
                };
            },
        },
    },
};
 
export default productTeaserConfigurator;