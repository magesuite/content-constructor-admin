import $ from 'jquery';
import $t from 'mage/translate';
import alert from 'Magento_Ui/js/modal/alert';
import confirm from 'Magento_Ui/js/modal/confirm';
import modal from 'Magento_Ui/js/modal/modal';
import ccProductPicker from '../../_product-picker/product-picker';

/**
 * Teaser Pins configurator.
 * @type {vuejs.ComponentOption} Vue component object.
 */
const ccTeaserPins: vuejs.ComponentOption = {
    template: /* html */ `<div class="cc-teaser-pins">
        <div class="cc-teaser-pins__note cc-teaser-pins__note--warning" v-if="showImageTeaserLayoutWarning">
            <svg class="cc-teaser-pins__note-icon" aria-hidden="true">
                <use xlink:href="#icon_warning"></use>
            </svg>
            <span>{{ 'It is not advised to use the pin card for an Image Teaser with more than 2 images per row, because of the limited space.' | translate }}</span>
        </div>
        <div class="cc-teaser-pins__note cc-teaser-pins__note--warning" v-if="showTargetErrors && hasIncompletePins">
            <svg class="cc-teaser-pins__note-icon" aria-hidden="true">
                <use xlink:href="#icon_warning"></use>
            </svg>
            <span>{{ 'Every pin needs a product SKU or a custom URL. The component cannot be saved until each marked pin below has one.' | translate }}</span>
        </div>
        <div class="cc-teaser-pins__note cc-teaser-pins__note--warning" v-if="showLetterboxWarning">
            <svg class="cc-teaser-pins__note-icon" aria-hidden="true">
                <use xlink:href="#icon_warning"></use>
            </svg>
            <span>{{ 'This image does not fill the whole preview box. A pin far from the middle can sit a little differently on the storefront. Slight adjustments might be required.' | translate }}</span>
        </div>
        <div class="cc-teaser-pins__note">
            <svg class="cc-teaser-pins__note-icon" aria-hidden="true">
                <use xlink:href="#icon_info"></use>
            </svg>
            <span>{{ 'The product card is only shown above a configurable screen-width threshold. On smaller screens these pins act as simple links.' | translate }}</span>
        </div>
        <div class="cc-input cc-input--group">
            <div class="cc-input cc-input--type-color cc-teaser-configurator__form-element cc-teaser-pins__field">
                <label class="cc-input__label" for="cfg-teaser-{{ teaserIndex }}-pins-base-color">{{ 'Base pin colour' | translate }}:</label>
                <div class="cc-input__wrapper cc-teaser-pins__color">
                    <input
                        type="text"
                        class="cc-input__input cc-teaser-pins__color-text"
                        id="cfg-teaser-{{ teaserIndex }}-pins-base-color"
                        :value="basePinColor"
                        @change="commitBaseColor($event)"
                        pattern="#[a-fA-F0-9]{3}([a-fA-F0-9]{3})?"
                        maxlength="7"
                    >
                    <input
                        type="color"
                        class="cc-input__input cc-input__input--type-color cc-teaser-pins__color-picker"
                        :value="basePinColor"
                        @change="updateBaseColor($event)"
                    >
                </div>
                <p class="cc-input__hint">{{ 'Default colour for all pins on this image.' | translate }} {{ 'Hex values only, e.g. #324dcf.' | translate }}</p>
            </div>
        </div>
        <div class="cc-teaser-pins__manage">
            <div class="cc-teaser-pins__actions">
                <button type="button" class="cc-teaser-pins__add" @click="addPin">
                    <svg class="cc-teaser-pins__add-icon" aria-hidden="true">
                        <use xlink:href="#icon_plus"></use>
                    </svg>
                    <span class="cc-teaser-pins__add-label">{{ 'Add pin' | translate }}</span>
                </button>
                <button type="button" class="cc-teaser-pins__accuracy" @click="openAccuracy" title="{{ 'Accuracy' | translate }}" aria-label="{{ 'Accuracy' | translate }}">
                    <svg class="cc-teaser-pins__accuracy-icon" aria-hidden="true">
                        <use xlink:href="#icon_info"></use>
                    </svg>
                </button>
            </div>
            <p class="cc-input__hint cc-teaser-pins__hint">{{ 'Drag a pin on the image to position it.' | translate }}</p>
            <ul class="cc-teaser-pins__list" v-if="pinItems.length">
                <li class="cc-teaser-pins__item"
                    :class="{
                        'cc-teaser-pins__item--highlighted': hoveredPinIndex === $index,
                        'cc-teaser-pins__item--incomplete': showTargetErrors && !pinHasTarget(pin),
                    }"
                    v-for="pin in pinItems"
                    @mouseenter="highlightPin($index)"
                    @mouseleave="clearPinHighlight()">
                    <span class="cc-teaser-pins__item-dot" :style="{ backgroundColor: pin.override_color && pin.color ? pin.color : basePinColor }"></span>
                    <span class="cc-teaser-pins__item-label">{{ 'Pin' | translate }} {{ $index + 1 }}</span>
                    <span class="cc-teaser-pins__item-warning" v-if="showTargetErrors && !pinHasTarget(pin)" title="{{ 'No product or URL set yet' | translate }}">
                        <svg class="cc-teaser-pins__item-warning-icon" aria-hidden="true">
                            <use xlink:href="#icon_warning"></use>
                        </svg>
                    </span>
                    <button type="button" class="cc-teaser-pins__item-edit" title="{{ 'Edit pin' | translate }}" @click="openPin($index)">
                        <svg class="cc-teaser-pins__item-edit-icon">
                            <use xlink:href="#icon_edit"></use>
                        </svg>
                    </button>
                    <button type="button" class="cc-teaser-pins__item-remove" title="{{ 'Delete pin' | translate }}" @click="removePin($index)">
                        <svg class="cc-teaser-pins__item-remove-icon" aria-hidden="true">
                            <use xlink:href="#icon_trash-can"></use>
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
        <div class="cc-teaser-pins__modal" v-el:pin-modal>
            <div class="cc-teaser-pins__modal-body" v-if="editingPin">
                <p class="cc-teaser-pins__modal-subtitle">{{ 'Pin' | translate }} {{ editingIndex + 1 }} {{ 'of' | translate }} {{ configuration.pins.items.length }}</p>
                <fieldset class="cc-teaser-pins__panel-section">
                    <legend class="cc-teaser-pins__panel-legend">{{ 'Link target' | translate }}</legend>
                    <div class="cc-teaser-pins__panel-body">
                        <div class="cc-teaser-pins__note cc-teaser-pins__note--warning" v-if="showTargetErrors && !pinHasTarget(editingPin)">
                            <svg class="cc-teaser-pins__note-icon" aria-hidden="true">
                                <use xlink:href="#icon_warning"></use>
                            </svg>
                            <span>{{ 'This pin has no target yet. Pick a product or enter a custom URL.' | translate }}</span>
                        </div>
                        <div class="cc-input" v-if="!editingPin.use_custom_url">
                            <cc-product-picker
                                :value.sync="editingPin.sku"
                                :product-data-endpoint="productDataEndpoint"
                                :product-chooser-url="productChooserUrl"
                                :input-id="'cfg-teaser-' + teaserIndex + '-pin-sku'">
                            </cc-product-picker>
                        </div>
                        <div class="cc-input" v-if="editingPin.use_custom_url">
                            <label class="cc-input__label">{{ 'Custom URL' | translate }}:</label>
                            <input type="text" class="cc-input__input" v-model="editingPin.url" placeholder="https://…">
                        </div>
                        <div class="cc-input cc-teaser-pins__switch">
                            <div class="admin__actions-switch" data-role="switcher">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-custom" class="cc-input__label">{{ 'Use a custom URL instead of a product' | translate }}: </label>
                                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-teaser-{{ teaserIndex }}-pin-custom" v-model="editingPin.use_custom_url">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-custom" class="admin__actions-switch-label"></label>
                            </div>
                        </div>
                        <div class="cc-input cc-teaser-pins__switch">
                            <div class="admin__actions-switch" data-role="switcher">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-newtab" class="cc-input__label">{{ 'Open link in new tab' | translate }}: </label>
                                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-teaser-{{ teaserIndex }}-pin-newtab" v-model="editingPin.new_tab">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-newtab" class="admin__actions-switch-label"></label>
                            </div>
                        </div>
                        <p class="cc-input__hint">{{ 'By default the link opens in the same tab.' | translate }}</p>
                    </div>
                </fieldset>
                <fieldset class="cc-teaser-pins__panel-section">
                    <legend class="cc-teaser-pins__panel-legend">{{ 'Appearance' | translate }}</legend>
                    <div class="cc-teaser-pins__panel-body">
                        <p class="cc-teaser-pins__note" v-if="!supportsCard">
                            <svg class="cc-teaser-pins__note-icon"><use xlink:href="#icon_info"></use></svg>
                            <span>{{ 'A pin with a custom URL always renders as a plain link, so the product card options do not apply.' | translate }}</span>
                        </p>
                        <div class="cc-input cc-teaser-pins__switch" :class="{ 'cc-teaser-pins__setting--disabled': !supportsCard }">
                            <div class="admin__actions-switch" data-role="switcher">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-display" class="cc-input__label">{{ 'Show product card' | translate }}: </label>
                                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-teaser-{{ teaserIndex }}-pin-display" v-model="cardEnabled" :disabled="!supportsCard">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-display" class="admin__actions-switch-label"></label>
                            </div>
                        </div>
                        <p class="cc-input__hint" :class="{ 'cc-teaser-pins__setting--disabled': !supportsCard }">{{ 'Off — link only / On — product card' | translate }}</p>
                        <div class="cc-input cc-teaser-pins__switch" v-if="cardEnabled">
                            <div class="admin__actions-switch" data-role="switcher">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-trigger" class="cc-input__label">{{ 'Open card on click' | translate }}: </label>
                                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-teaser-{{ teaserIndex }}-pin-trigger" v-model="editingPin.card_trigger" :true-value="'click'" :false-value="'hover'">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-trigger" class="admin__actions-switch-label"></label>
                            </div>
                        </div>
                        <p class="cc-input__hint" v-if="cardEnabled">{{ 'Off: card appears on hover. On: card appears when the pin is clicked/tapped.' | translate }}</p>
                        <div class="cc-input cc-teaser-pins__switch" v-if="cardEnabled">
                            <div class="admin__actions-switch" data-role="switcher">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-show-rating" class="cc-input__label">{{ 'Show review rating' | translate }}: </label>
                                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-teaser-{{ teaserIndex }}-pin-show-rating" v-model="editingPin.show_rating">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-show-rating" class="admin__actions-switch-label"></label>
                            </div>
                        </div>
                        <div class="cc-input cc-teaser-pins__switch" v-if="cardEnabled">
                            <div class="admin__actions-switch" data-role="switcher">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-show-sale" class="cc-input__label">{{ 'Show sale badge' | translate }}: </label>
                                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-teaser-{{ teaserIndex }}-pin-show-sale" v-model="editingPin.show_sale">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-show-sale" class="admin__actions-switch-label"></label>
                            </div>
                        </div>
                        <div class="cc-input" v-if="cardEnabled">
                            <label class="cc-input__label" for="cfg-teaser-{{ teaserIndex }}-pin-position">{{ 'Preferred card position' | translate }}:</label>
                            <select class="cc-input__select" id="cfg-teaser-{{ teaserIndex }}-pin-position" v-model="editingPin.card_position">
                                <option value="top">{{ 'Top' | translate }}</option>
                                <option value="right">{{ 'Right' | translate }}</option>
                                <option value="bottom">{{ 'Bottom' | translate }}</option>
                                <option value="left">{{ 'Left' | translate }}</option>
                            </select>
                            <p class="cc-input__hint">{{ 'Where the card appears relative to the pin. Automatically adjusted to stay within the image when the pin is near an edge.' | translate }}</p>
                        </div>
                        <span class="cc-teaser-pins__separator"></span>
                        <div class="cc-teaser-pins__note">
                            <svg class="cc-teaser-pins__note-icon" aria-hidden="true">
                                <use xlink:href="#icon_info"></use>
                            </svg>
                            <span>{{ 'By default this pin uses the base colour set for the image. Turn on the override to give this pin its own colour.' | translate }}</span>
                        </div>
                        <div class="cc-input cc-teaser-pins__switch">
                            <div class="admin__actions-switch" data-role="switcher">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-override" class="cc-input__label">{{ 'Override pin colour' | translate }}: </label>
                                <input type="checkbox" class="admin__actions-switch-checkbox" id="cfg-teaser-{{ teaserIndex }}-pin-override" v-model="editingPin.override_color">
                                <label for="cfg-teaser-{{ teaserIndex }}-pin-override" class="admin__actions-switch-label"></label>
                            </div>
                        </div>
                        <div class="cc-input cc-input--type-color" v-if="editingPin.override_color">
                            <div class="cc-input__wrapper cc-teaser-pins__color">
                                <input type="text" class="cc-input__input cc-teaser-pins__color-text" :value="editingPin.color" @change="commitPinColor($event)" pattern="#[a-fA-F0-9]{3}([a-fA-F0-9]{3})?" maxlength="7">
                                <input type="color" class="cc-input__input cc-input__input--type-color cc-teaser-pins__color-picker" :value="editingPin.color || configuration.pins.base_color" @change="updatePinColor($event)">
                            </div>
                            <p class="cc-input__hint">{{ 'Hex values only, e.g. #324dcf.' | translate }}</p>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>`,
    props: {
        configuration: {
            type: Object,
            default(): any {
                return {};
            },
        },
        teaserIndex: {
            type: Number,
            default: 0,
        },
        /* Default (base) pin colour, provided from view.xml config */
        defaultColor: {
            type: String,
            default: '#324dcf',
        },
        productDataEndpoint: {
            type: String,
            default: '',
        },
        productChooserUrl: {
            type: String,
            default: '',
        },
        callerComponentType: {
            type: String,
            default: '',
        },
        parentConfiguration: {
            type: Object,
            default(): any {
                return {};
            },
        },
        hoveredPinIndex: {
            type: Number,
            default: null,
        },
    },
    components: {
        'cc-product-picker': ccProductPicker,
    },
    data(): any {
        return {
            editingIndex: null,
            pinSnapshot: null,
            pinSaved: false,
            modalInstance: null,
            pendingBaseColor: null,
            showTargetErrors: false,
            letterboxPct: 0,
        };
    },
    events: {
        'pins__targets-validated'(): void {
            this.showTargetErrors = this.hasIncompletePins;

            if (this.showTargetErrors) {
                this.$dispatch('pins__focus-tab');
            }
        },
    },
    computed: {
        pinItems: function(): any[] {
            return this.configuration.pins ? this.configuration.pins.items : [];
        },
        /* Image Teaser with 3+ teasers per row leaves too little space for the
         * product card — warn the editor.
         */
        showImageTeaserLayoutWarning: function(): boolean {
            if (this.callerComponentType !== 'image-teaser') {
                return false;
            }
            const scenario: any = this.parentConfiguration.scenario;
            const desktopLayout: any = scenario ? scenario.desktopLayout : null;
            const perRow: number = desktopLayout
                ? parseInt(desktopLayout.id, 10)
                : 0;
            return perRow >= 3;
        },
        showLetterboxWarning: function(): boolean {
            return this.letterboxPct >= 1;
        },
        hasIncompletePins: function(): boolean {
            const self: any = this;

            return self.pinItems.some(function(pin: any): boolean {
                return !self.pinHasTarget(pin);
            });
        },
        basePinColor: {
            get(): string {
                if (this.configuration.pins) {
                    return (
                        this.configuration.pins.base_color || this.defaultColor
                    );
                }
                return this.pendingBaseColor !== null
                    ? this.pendingBaseColor
                    : this.defaultColor;
            },
            set(value: string): void {
                if (this.configuration.pins) {
                    this.configuration.pins.base_color = value;
                    return;
                }
                this.pendingBaseColor = value;
            },
        },
        editingPin: function(): any {
            if (this.editingIndex === null || !this.configuration.pins) {
                return null;
            }
            return this.configuration.pins.items[this.editingIndex];
        },
        supportsCard: function(): boolean {
            return !!this.editingPin && !this.editingPin.use_custom_url;
        },
        cardEnabled: {
            get(): boolean {
                return this.supportsCard && this.editingPin.display === 'rich';
            },
            set(value: boolean): void {
                this.editingPin.display = value ? 'rich' : 'simple';
            },
        },
    },
    filters: {
        translate(text: string): string {
            return $t(text);
        },
    },
    methods: {
        updateBaseColor(event: Event): void {
            this.basePinColor = (event.target as HTMLInputElement).value;
        },
        openAccuracy(): void {
            const paragraphs: string[] = [
                $t(
                    'A pin is saved as a position on the image. It stays in place when the screen size changes.'
                ),
                $t(
                    'If the image does not fill the whole preview box, there is empty space around it. Then a pin is less exact the further it is from the middle. In the middle it is always correct.'
                ),
                $t(
                    'This does not happen when the image fills the whole preview box.'
                ),
            ];

            alert({
                title: $t('Accuracy'),
                content: paragraphs.map((text: string): string => `<p>${text}</p>`).join(''),
                modalClass: 'cc-teaser-pins-accuracy',
            });
        },
        previewImage(): any {
            const configurator: any = this.$el.closest('.cc-teaser-configurator');

            if (!configurator) {
                return null;
            }

            return (
                Array.from(
                    configurator.querySelectorAll('.cc-teaser-preview__image')
                ).find((image: any) => image.getBoundingClientRect().height > 0) ||
                null
            );
        },
        measureLetterbox(): void {
            const image: any = this.previewImage();
            const figure: any = image
                ? image.closest('.cc-teaser-preview__figure')
                : null;

            if (!image || !figure || !image.naturalWidth || !image.naturalHeight) {
                this.letterboxPct = 0;

                return;
            }

            const box: any = image.getBoundingClientRect();
            const outer: any = figure.getBoundingClientRect();

            if (!outer.width || !outer.height) {
                this.letterboxPct = 0;

                return;
            }

            const scale: number = Math.min(
                box.width / image.naturalWidth,
                box.height / image.naturalHeight
            );
            const drift: number = Math.max(
                (outer.width - image.naturalWidth * scale) / 2 / outer.width,
                (outer.height - image.naturalHeight * scale) / 2 / outer.height
            );

            this.letterboxPct = Math.max(0, Math.round(drift * 1000) / 10);
            this.observePreviewTargets([image, figure]);
        },
        observePreviewTargets(nodes: any[]): void {
            const self: any = this;

            if (!self._letterboxObserver) {
                return;
            }

            const next: any[] = nodes.filter(Boolean);
            const current: any[] = self._observedNodes || [];
            const unchanged: boolean =
                current.length === next.length &&
                current.every((node: any, index: number) => node === next[index]);

            if (unchanged) {
                return;
            }

            current.forEach((node: any) => self._letterboxObserver.unobserve(node));
            self._observedNodes = next;
            next.forEach((node: any) => self._letterboxObserver.observe(node));
        },
        resetCardSettings(pin: any): void {
            const defaults: any = this.pinDefaults();

            [
                'display',
                'card_trigger',
                'card_position',
                'show_rating',
                'show_sale',
            ].forEach((key: string): void => {
                pin[key] = defaults[key];
            });
        },
        pinHasTarget(pin: any): boolean {
            const target: string = pin.use_custom_url ? pin.url : pin.sku;

            return (target || '').trim() !== '';
        },
        highlightPin(index: number): void {
            this.hoveredPinIndex = index;
        },
        clearPinHighlight(): void {
            this.hoveredPinIndex = null;
        },
        pinDefaults(): any {
            return {
                x: 50,
                y: 50,
                sku: '',
                url: '',
                use_custom_url: false,
                new_tab: false,
                display: 'simple',
                card_trigger: 'hover',
                card_position: 'top',
                show_rating: true,
                show_sale: true,
                override_color: false,
                color: '',
            };
        },
        commitColor(event: Event, current: string): string | null {
            const input: HTMLInputElement = event.target as HTMLInputElement;
            const value: string = input.value.trim();

            if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value)) {
                return value;
            }

            input.value = current;

            return null;
        },
        commitBaseColor(event: Event): void {
            const self: any = this;
            const value: string | null = self.commitColor(
                event,
                self.basePinColor
            );

            if (value !== null) {
                self.basePinColor = value;
            }
        },
        commitPinColor(event: Event): void {
            const self: any = this;

            if (!self.editingPin) {
                return;
            }

            const value: string | null = self.commitColor(
                event,
                self.editingPin.color
            );

            if (value !== null) {
                self.editingPin.color = value;
            }
        },
        ensurePinsConfig(): void {
            if (this.configuration.pins) {
                return;
            }
            this.$set('configuration.pins', {
                base_color: this.pendingBaseColor !== null ? this.pendingBaseColor : this.defaultColor,
                items: [],
            });
        },
        addPin(): void {
            const self: any = this;
            self.ensurePinsConfig();
            self.configuration.pins.items.push(self.pinDefaults());
        },
        initPinModal(): void {
            if (this.modalInstance) {
                return;
            }
            const self: any = this;
            this.modalInstance = modal({
                type: 'slide',
                title: $t('Pin settings'),
                modalClass: 'cc-teaser-pins-modal',
                buttons: [
                    {
                        text: $t('Cancel'),
                        class: 'action-secondary',
                        click(): void {
                            self.cancelPin();
                        },
                    },
                    {
                        text: $t('Save'),
                        class: 'action-primary',
                        click(): void {
                            self.savePin();
                        },
                    },
                ],
                closed(): void {
                    self.onPinModalClosed();
                },
            }, $(this.$els.pinModal));
        },
        normalizePin(index: number): void {
            const self: any = this;
            const normalized: any = Object.assign(
                self.pinDefaults(),
                self.configuration.pins.items[index]
            );
            this.configuration.pins.items.$set(index, normalized);
        },
        openPin(index: number): void {
            this.normalizePin(index);
            this.editingIndex = index;
            this.pinSnapshot = JSON.parse(JSON.stringify(this.configuration.pins.items[index]));
            this.pinSaved = false;
            this.$nextTick((): void => {
                this.initPinModal();
                $(this.$els.pinModal).modal('openModal');
            });
        },
        savePin(): void {
            if (this.editingPin && this.editingPin.use_custom_url) {
                this.resetCardSettings(this.editingPin);
            }

            this.pinSaved = true;
            $(this.$els.pinModal).modal('closeModal');
        },
        cancelPin(): void {
            $(this.$els.pinModal).modal('closeModal');
        },
        onPinModalClosed(): void {
            const self: any = this;

            if (
                !self.pinSaved &&
                self.editingIndex !== null &&
                self.pinSnapshot
            ) {
                self.configuration.pins.items.$set(
                    self.editingIndex,
                    self.pinSnapshot
                );
            }

            self.editingIndex = null;
            self.pinSnapshot = null;
            self.pinSaved = false;
        },
        updatePinColor(event: Event): void {
            if (this.editingPin) {
                this.editingPin.color = (event.target as HTMLInputElement).value;
            }
        },
        removePin(index: number): void {
            const self: any = this;
            confirm({
                title: $t('Delete pin'),
                content: $t('Delete Pin') + ' ' + (index + 1) + '?',
                actions: {
                    confirm(): void {
                        self.configuration.pins.items.splice(index, 1);
                        self.editingIndex = null;
                        self.pinSnapshot = null;
                        // The removed pin's index now addresses a different pin.
                        self.hoveredPinIndex = null;
                    },
                    cancel(): void {},
                },
            });
        },
    },
    ready(): void {
        const self: any = this;
        const column: any = self.$el.closest('.cc-teaser-configurator')
            ? self.$el
                  .closest('.cc-teaser-configurator')
                  .querySelector('.cc-teaser-configurator__col--preview')
            : null;

        self.measureLetterbox();

        if (!column) {
            return;
        }

        self._letterboxLoad = (): void => self.measureLetterbox();
        self._letterboxColumn = column;
        column.addEventListener('load', self._letterboxLoad, true);

        if (typeof ResizeObserver === 'function') {
            self._letterboxObserver = new ResizeObserver((): void =>
                self.measureLetterbox()
            );
            self._letterboxObserver.observe(column);

            return;
        }

        window.addEventListener('resize', self._letterboxLoad);
        self._letterboxUsesWindow = true;
    },
    beforeDestroy(): void {
        const self: any = this;

        if (self._letterboxObserver) {
            self._letterboxObserver.disconnect();
            self._letterboxObserver = null;
        }

        if (self._letterboxLoad) {
            if (self._letterboxUsesWindow) {
                window.removeEventListener('resize', self._letterboxLoad);
            }
            if (self._letterboxColumn) {
                self._letterboxColumn.removeEventListener(
                    'load',
                    self._letterboxLoad,
                    true
                );
                self._letterboxColumn = null;
            }
            self._letterboxLoad = null;
        }

        if (self.$els.pinModal) {
            const element: any = $(self.$els.pinModal);
            const wrapper: any = element.closest('.cc-teaser-pins-modal');

            if (self.modalInstance) {
                element.modal('closeModal');
                self.modalInstance = null;
            }

            element.remove();

            if (wrapper.length) {
                wrapper.remove();
            }
        }
    },
};

export default ccTeaserPins;
