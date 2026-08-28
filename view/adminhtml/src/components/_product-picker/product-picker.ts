import $ from 'jquery';
import $t from 'mage/translate';
import modal from 'Magento_Ui/js/modal/modal';

/**
 * Reusable product picker.
 * @type {vuejs.ComponentOption} Vue component object.
 */
const ccProductPicker: vuejs.ComponentOption = {
    template: `<div class="cc-product-picker">
        <label class="cc-input__label" :for="inputId" v-if="label">{{ label | translate }}:</label>
        <div class="cc-product-picker__field">
            <input
                type="text"
                class="cc-input__input cc-product-picker__input"
                :id="inputId"
                v-model="value"
                @input="onInput"
                placeholder="{{ 'Enter or paste a SKU' | translate }}"
            >
            <button type="button" class="cc-product-picker__browse action-secondary" @click="openBrowser">{{ 'Browse' | translate }}</button>
        </div>
        <p class="cc-input__hint" v-if="!product && !notFound && !lookupFailed && !loading">{{ 'The product page URL is attached automatically.' | translate }}</p>
        <p class="cc-product-picker__status cc-product-picker__status--loading" v-if="loading">{{ 'Searching…' | translate }}</p>
        <p class="cc-product-picker__status cc-product-picker__status--error" v-if="notFound && !loading">{{ 'Product not found' | translate }}</p>
        <p class="cc-product-picker__status cc-product-picker__status--error" v-if="lookupFailed && !loading">{{ 'Could not check this SKU. Please try again.' | translate }}</p>
        <div class="cc-product-picker__overview" v-if="product && !loading">
            <img class="cc-product-picker__thumb" :src="product.image" v-if="product.image">
            <div class="cc-product-picker__meta">
                <span class="cc-product-picker__name">{{ product.name }}</span>
                <a class="cc-product-picker__url" :href="product.url" target="_blank" v-if="product.url">{{ product.url }}</a>
            </div>
        </div>
    </div>`,
    props: {
        value: {
            type: String,
            twoWay: true,
            default: '',
        },
        productDataEndpoint: {
            type: String,
            default: '',
        },
        productChooserUrl: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: 'Product SKU',
        },
        inputId: {
            type: String,
            default: '',
        },
    },
    data(): any {
        return {
            product: null,
            notFound: false,
            lookupFailed: false,
            loading: false,
            lookupTimeout: null,
            modalInstance: null,
            chooserEl: null,
            chooserId: null,
        };
    },
    filters: {
        translate(text: string): string {
            return $t(text);
        },
    },
    methods: {
        onInput(): void {
            const self: any = this;
            self.product = null;
            self.notFound = false;
            self.lookupFailed = false;
            if (self.lookupTimeout) {
                clearTimeout(self.lookupTimeout);
            }
            self.lookupTimeout = setTimeout((): void => self.lookup(), 500);
        },
        lookup(): void {
            const self: any = this;
            const sku: string = (self.value || '').trim();

            self.notFound = false;
            self.lookupFailed = false;

            if (!sku || !self.productDataEndpoint) {
                self.product = null;
                self.loading = false;
                return;
            }

            self.loading = true;
            self.$http
                .get(`${self.productDataEndpoint}?sku=${encodeURIComponent(sku)}`)
                .then(
                    (response: vuejs.HttpResponse): void =>
                        self.handleLookup(response, sku),
                    (): void => self.failLookup(sku)
                );
        },
        isStaleLookup(sku?: string): boolean {
            const self: any = this;

            return sku !== undefined && sku !== (self.value || '').trim();
        },
        failLookup(sku?: string): void {
            const self: any = this;

            if (self.isStaleLookup(sku)) {
                return;
            }

            self.loading = false;
            self.product = null;
            self.notFound = false;
            self.lookupFailed = true;
        },
        handleLookup(response: vuejs.HttpResponse, sku?: string): void {
            const self: any = this;

            if (self.isStaleLookup(sku)) {
                return;
            }

            self.loading = false;

            if (!response.ok) {
                self.failLookup(sku);
                return;
            }

            let data: any = {};

            if (response.body && response.body.length) {
                try {
                    data =
                        typeof response.body === 'string'
                            ? JSON.parse(response.body)
                            : response.body;
                } catch (error) {
                    self.failLookup();
                    return;
                }
            }

            if (data.product && data.product.name) {
                self.product = data.product;
                self.notFound = false;
                return;
            }

            self.product = null;
            self.notFound = true;
        },
        openBrowser(): void {
            if (!this.productChooserUrl) {
                return;
            }
            (window as any).csProductChooserCallback = (sku: string): void => {
                this.onChooserSelect(sku);
            };
            this.loadChooser();
        },
        /**
         * Builds the chooser element ONCE and keeps it outside Vue's
         * template. The Magento modal relocates its element into the shared
         * modals-wrapper.
         */
        getChooserEl(): any {
            if (!this.chooserEl) {
                this.chooserId = `ccProductChooser_${this._uid}`;
                this.chooserEl = $(
                    '<div class="cc-product-picker__modal"><div class="cc-product-picker__chooser-host"></div></div>'
                ).appendTo('body');
                this.initGridLoader(this.chooserEl);
            }
            return this.chooserEl;
        },
        loadChooser(): void {
            const container: any = this.getChooserEl();
            const host: any = container.find('.cc-product-picker__chooser-host');
            $('body').trigger('showLoadingPopup');
            this._chooserRequest = $.ajax({
                url: this.productChooserUrl,
                type: 'GET',
                dataType: 'html',
                data: { uniq_id: this.chooserId },
            })
                .done((html: string): void => {
                    if (this._destroyed) {
                        return;
                    }
                    host.html(html);
                    this.openChooserModal();
                })
                .always((): void => {
                    this._chooserRequest = null;
                    $('body').trigger('hideLoadingPopup');
                });
        },
        initGridLoader(container: any): void {
            container.attr('data-role', 'loader');
            if (typeof container.loader === 'function') {
                container.loader();
            }
            container.on('gridajaxsettings.ccProductPicker', (event: any, settings: any): void => {
                settings.loaderContext = event.target;
            });
            container.on('processStart.ccProductPicker processStop.ccProductPicker', (event: any): void => {
                event.stopPropagation();
            });
        },
        openChooserModal(): void {
            const element: any = this.getChooserEl();
            if (!this.modalInstance) {
                this.modalInstance = modal(
                    {
                        type: 'slide',
                        title: $t('Select a product'),
                        modalClass: 'cc-product-picker-modal',
                        buttons: [
                            {
                                text: $t('Cancel'),
                                class: 'action-secondary',
                                click(): void {
                                    element.modal('closeModal');
                                },
                            },
                        ],
                    },
                    element
                );
            }
            element.modal('openModal');
        },
        onChooserSelect(sku: string): void {
            this.value = sku;
            this.getChooserEl().modal('closeModal');
            this.lookup();
        },
    },
    ready(): void {
        if (this.value) {
            this.lookup();
        }
    },
    beforeDestroy(): void {
        this._destroyed = true;

        if (this.lookupTimeout) {
            clearTimeout(this.lookupTimeout);
        }

        if (this._chooserRequest) {
            this._chooserRequest.abort();
            this._chooserRequest = null;
        }

        if ((window as any).csProductChooserCallback) {
            (window as any).csProductChooserCallback = null;
        }

        if (!this.chooserEl) {
            return;
        }
        const wrapper: any = this.chooserEl.closest('.cc-product-picker-modal');
        try {
            this.chooserEl.modal('closeModal');
        } catch (error) {
            // modal may already be torn down, nothing else to do
        }
        this.chooserEl.remove();
        if (wrapper && wrapper.length) {
            wrapper.remove();
        }
        this.chooserEl = null;
        this.modalInstance = null;
    },
};

export default ccProductPicker;
