import $ from 'jquery';
import $t from 'mage/translate';
import templates from './category-picker-templates';

/**
 * component options interface.
 * Please refer to swiper documentation and our teaser component for more options and callbacks
 */
interface categoryPickerOptions {
    /**
     * Tells if multiple categories can be selected
     * @type {boolean}
     * @default true
     */
    multiple?: boolean;

    /**
     * Tells if picker should initialize with disabled items that have no children
     * @type {boolean}
     * @default false
     */
    disableLastLevelItems?: boolean;

    /**
     * Tells if picker should show children items or only root
     * @type {boolean}
     * @default false
     */
    showChildren?: boolean;

    /**
     * Tells if live-search functionality should be enabled
     * @type {boolean}
     * @default true
     */
    showSearch?: boolean;

    /**
     * Tells if picker should initialize as disabled
     * @type {boolean}
     * @default false
     */
    disabled?: boolean;

    /**
     * Defines minimum search query length to initialize filtring of options 
     * @type {boolean}
     * @default 3
     */
    minSearchQueryLength?: number;

    placeholders?: {
        /**
         * Placeholder for select field.
         * This string will be translateable via M2 JS translation system
         * @type {string}
         * @default Select...
         */
        select?: string;

        /**
         * Placeholder for Done button (on the bottom of UI box).
         * This string will be translateable via M2 JS translation system
         * @type {string}
         * @default Done
         */
        doneButton?: string;

        /**
         * Placeholder for search input
         * This string will be translateable via M2 JS translation system
         * @type {string}
         * @default [empty]
         */
        search?: string;
    };

    classes?: {};
};

export default class categoryPicker {
    protected _$output: any;
    protected _defaults: any;
    protected _categoriesData: any;
    protected _isOpen: boolean;
    protected _options: any;
    protected _$wrapper: any;
    protected _orderedCheckboxes: any;
    protected _prefix: string;
    public _categoriesLabels: any;

    /**
     * Creates new CcCategoryPicker component with optional settings.
     * @param {$output} Hidden input field that will be filled with IDs after used choses it
     * @param {data} JSON with categories data
     * @param {options}  Optional settings object.
     */
    public constructor($output: JQuery, data: any, options?: categoryPickerOptions) {
        this._defaults = {
            multiple: true,
            showChildren: true,
            showSearch: true,
            disabled: false,
            disableLastLevelItems: false,
            minSearchQueryLength: 3,
            placeholders: {
                select: $t('Select...'),
                doneButton: $t('Done'),
                search: $t('Type category name to search...'),
                empty: $t('There are no categories matching your selection'),
                removeCrumb: $t('Remove this category'),
            },
            classes: {
                base: 'cc-category-picker',
                baseMix: '',
                input: {
                    base: 'cc-category-picker__input',
                },
                menu: {
                    base: 'cc-category-picker__box',
                    open: 'cc-category-picker__box--open',
                    content: 'cc-category-picker__box-content',
                },
                search: {
                    wrapper: 'cc-category-picker__search',
                    input: 'cc-category-picker__search-input',
                    label: 'cc-category-picker__results-label',
                    resultsQty: 'cc-category-picker__results-qty',
                    resultsWrapper: 'cc-category-picker__results',
                    resultsUL: 'cc-category-picker__results-list',
                    resultsLI: 'cc-category-picker__results-item',
                    resultsPath: 'cc-category-picker__results-path',
                },
                actions: {
                    wrapper: 'cc-category-picker__actions',
                    button: 'cc-category-picker__button',
                },
                dropdown: {
                    ul: 'cc-category-picker__dropdown',
                    li: 'cc-category-picker__dropdown-item',
                    toggler: 'cc-category-picker__dropdown-toggler',
                    label: 'cc-category-picker__label',
                    checkbox: 'cc-category-picker__checkbox',
                    radio: 'cc-category-picker__radio',
                },
            },
        };

        this._categoriesData = data;
        this._categoriesLabels = [];
        this._options = $.extend(true, {}, this._defaults, options);
        this._$output = $output;
        this._$wrapper = undefined;
        this._isOpen = false;
        this._prefix = Math.random().toString(36).substring(2, 5);
        this._orderedCheckboxes = [];

        this._renderPicker();
        this._afterBuild(false);
        this._rebuildValues();
        this._setEvents();
    }

    /**
     * This actually controls output of all events.
     * Updates picker's crumbs and values
     * @param {inputs} Optional. Array with inputs (checkboxes, radios) - they contain all data we need to show updated picker
     */
    public updatePicker(inputs?: any): void {
        const c: any = this._options.classes;
        const t: any = this._options.placeholders;
        const _this: any = this;

        const ids: string = $(inputs).map(function(): string {
            return this.value;
        }).get().join(',');

        this._categoriesLabels = $(inputs).map(function(): string {
            return $(this).next('label').clone().children().remove().end().text();
        });

        const crumbs: string = $(inputs).map(function(): string {
            const label: string = $(this).next('label').clone().children().remove().end().text();
            return templates.getCrumbTemplate(c.base, label, t.removeCrumb, this.value);
        }).get().join('');

        this._$output[0].value = ids;
        this._$output[0].dispatchEvent(new Event('change'));

        if (crumbs !== '') {
            this._$wrapper.find(`.${ c.input.base }`).html(crumbs);
        } else {
            this._$wrapper.find(`.${ c.input.base }`).html(this._options.placeholders.select);
        }

        this._setCrumbsEvents();
    }

    /**
     * Opens given parent - displays its children
     * @param {$item} Parent element, of which children we want to display
     */
    public openSubcategoriesTree($item: any): void {
        const c: any = this._options.classes;

        $item.find(`> .${ c.dropdown.ul }`).toggleClass(`${ c.dropdown.ul }--hidden`);
        $item.find(`> .${ c.dropdown.li }-content .${ c.dropdown.toggler }`).toggleClass(`${ c.dropdown.toggler }--active`);
    }

    /**
     * Opens picker's box
     * @param {$wrapper} wrapper (root element) of the component, since we want to know which picker should be opened
     */
    public openPicker($wrapper: any): void {
        // Close all open pickers if class matches
        this.closePicker($(`.${ this._options.classes.base }`));

        $wrapper.find('.cc-input__fake-select').addClass('cc-input__fake-select--active');
        $wrapper.find(`.${ this._options.classes.menu.base }`).addClass(`${ this._options.classes.menu.base }--open`);
        this._isOpen = true;
    }

    /**
     * Closes picker's box
     * @param {$wrapper} wrapper (root element) of the component, since we want to know which picker should be closed
     */
    public closePicker($wrapper: any): void {
        $wrapper.find('.cc-input__fake-select').removeClass('cc-input__fake-select--active');
        $wrapper.find(`.${ this._options.classes.menu.base }`).removeClass(`${ this._options.classes.menu.base }--open`);
        this._isOpen = false;
    }

    /**
     * Rebuilds content of picker to show only children elements of given parent (category ID)
     * @param {id} ID of category
     */
    public showChildrenOnly(id: number): void {
        const target = this._getChildren(id);

        if (target.optgroup) {
            this._orderedCheckboxes = [];
            this._$wrapper.find(`.${ this._options.classes.menu.content }`).html(this._getContents(target.optgroup, '', `${ this._options.classes.dropdown.ul }--normal`));
            this._afterBuild(false);
            this._rebuildValues();
            this._setEvents();
        } else {
            this._$wrapper.find(`.${ this._options.classes.menu.content }`).html(this._options.placeholders.empty);
        }
    }

    /**
     * Enables picker
     */
    public enable(): void {
        this._$wrapper.find(`.${ this._options.classes.input.base }`).removeClass(`${ this._options.classes.input.base }--disabled`);
        this._options.disabled = false;
    }

    /**
     * Disables picker
     */
    public disable(): void {
        this._$wrapper.find(`.${ this._options.classes.input.base }`).addClass(`${ this._options.classes.input.base }--disabled`);
        this.closePicker(this._$wrapper);
        this._options.disabled = true;
    }

    /**
     * Clears output, crumbs and inputs array
     */
    public resetAll(): void {
        this._$output[0].value = '';
        this._$wrapper.find(`.${ this._options.classes.input.base }`).html(this._options.placeholders.select);
        this._orderedCheckboxes = [];
    }

    /**
     * Renders picker component markup and initial setup
     */
    protected _renderPicker(): void {
        const c: any = this._options.classes;
        const t: any = this._options.placeholders;

        const disabledClass = this._options.disabled ? `${ c.input.base }--disabled` : '';

        let tpl: string = '';

        if (this._options.showChildren && this._options.showSearch) {
            tpl = templates.getComponentTemplate(c, t, disabledClass);
        } else {
            tpl = templates.getMinimalComponentTemplate(c, t, disabledClass);
        }

        this._$output.wrap(`<div class="${ c.base } ${ c.baseMix }"></div>`);
        this._$wrapper = this._$output.parent(`.${ c.base }`);
        this._$wrapper.append(tpl);

        if (this._categoriesData.optgroup) {
            this._$wrapper.find(`.${ c.menu.content }`).html(this._getContents(this._categoriesData.optgroup, ''));
        } else {
            this._$wrapper.find(`.${ c.menu.content }`).html(t.empty);
        }
    }

    /**
     * Renders new options list based on given catehories data
     * @param {data} Array of categories
     */
    protected _renderSearchResults(data: any): void {
        const c: any = this._options.classes;
        const _this: any = this;
        let result: string = '';

        this._$wrapper.find(`.${ c.search.resultsWrapper }`).html('');

        if (data.length) {
            result += `<ul class="${ c.search.resultsUL }">`;

            for (let i: number = 0; i < data.length; i++) {
                const path: string = $(data[i].path).map(function(): string {
                    return this;
                }).get().join(' / ');
                const checked: string = $(`#cp-${ this._prefix }-${ data[i].value }` ).prop('checked') ? 'checked' : '';
                const disabled: string = $(`#cp-${ this._prefix }-${ data[i].value }`).prop( 'disabled' ) ? 'disabled' : '';

                result += `<li class="${ c.search.resultsLI }" role="option-group">`;

                if (this._options.multiple) {
                    result += `<div class="cc-input cc-input--type-checkbox">
                        <input class="cc-input__checkbox | ${ c.dropdown.checkbox }" type="checkbox" value="${ data[i].value }" name="cp-sr-${ this._prefix }[]" id="cp-sr-${ this._prefix }-${ data[i].value }" tabindex="-1" ${ checked } ${ disabled }>`;
                } else {
                    result += `<div class="cc-input cc-input--type-radio">
                        <input class="cc-input__radio | ${ c.dropdown.radio }" type="radio" value="${ data[i].value }" name="cp-sr-${ this._prefix }[]" id="cp-sr-${ this._prefix }-${ data[i].value }" tabindex="-1" ${ checked } ${ disabled }>`;
                }

                result += `<label for="cp-sr-${ this._prefix }-${ data[i].value }" class="cc-input__label | ${ c.search.label }">
                    ${ data[i].label } 
                    <span class="${ c.search.resultsPath }">${ path }</span>
                </label></div>
                </li>`;
            }

            result += '</ul>';
        }

        this._$wrapper.find(`.${ c.search.resultsWrapper }` ).html(result);

        this._$wrapper.find(`.${ c.search.resultsUL } input[type="checkbox"]`).off('change').on('change', function(): void {
            _this._$wrapper.find(`.${ c.menu.content } :input[value="${ this.value }"]`).trigger('click');
        } );

        const text: string = data.length === 1 ? `${ data.length } ${ $t('Result') }` : `${ data.length } ${ $t('Results') }`;
        this._$wrapper.find(`.${ this._options.classes.search.resultsQty }`).html(text);

        this._setEvents();
    }

    /**
     * Recursive method to filter categories by label based on given query (string or its part)
     * @param {category} root category to start from
     * @param {query} string that we look for in category labels
     * @param {path} Path to the subcategory (used to display crumbs)
     * @return {categories} Array of filtered categories
     */
    protected _getByQuery(category: any, query: string, path: any = []): any {
        const categories: any = [];

        if (category.is_active === '1' && category.label && category.label.match(new RegExp(query, 'i'))) {
            categories.push({
                label: category.label,
                value: category.value,
                path: path,
            });
        }

        if (category.optgroup) {
            const categoryPath = category.label ? path.concat([category.label]) : [];
            category.optgroup.forEach(subcategory => {
                this._getByQuery(subcategory, query, categoryPath).map(function(cat: any): any {
                    if (subcategory.is_active === '1') {
                        return categories.push(cat);
                    }
                });
            });
        }

        return categories;
    }

    /**
     * Recursive methods to filter categories collection to get only children of given ID
     * @param {id} ID of category to filter
     * @param {children} Optional - Array of children of a category
     * @return {result} Filtered array of children
     */
    protected _getChildren(id: number, children?: any): any {
        const collection: any = children || this._categoriesData;

        if (collection.value && collection.value === id) {
            return collection;
        }

        if (collection.optgroup) {
            const c = collection.optgroup;

            for (let i = 0; i < c.length; i++) {
                const result: any = this._getChildren(id, c[i]);
                if (result) {
                    return result;
                }
            }
        }

        return null;
    }

    /**
     * Recursive method to render list with categories as a radios / checkboxes using
     * @param {categories} Array with categories
     * @param {str} Current HTML markup of the list
     * @param {dropdownModifier} Modifier class for dropdown for styling purposes
     * @return {str} HTML markup of options list
     */
    protected _getContents(categories: any, str: string, dropdownModifier?: string): string {
        const c: any = this._options.classes;

        if (!dropdownModifier) {
            dropdownModifier = '';
        }

        str += `<ul class="${ c.dropdown.ul } ${ c.dropdown.ul }--hidden ${ dropdownModifier }">`;

        /**
         * Loop through categories array and find optgroups.
         * Then make a UL element out of each optgroup and build general markup
         */
        for (let i: number = 0; i < categories.length; i++) {
            if (categories[i].is_active === '1') {
                const checked = $( `#cp-${ this._prefix }-${ categories[i].value }`).prop('checked') ? 'checked' : '';

                str += `<li class="${ c.dropdown.li }" data-role="option-group">`;

                if (this._options.multiple) {
                    str += `<div class="cc-input cc-input--type-checkbox | ${ c.dropdown.li }-content">
                        <input class="cc-input__checkbox | ${ c.dropdown.checkbox }" type="checkbox" value="${ categories[i].value }" name="cp-${ this._prefix }[]" id="cp-${ this._prefix }-${ categories[i].value }" tabindex="-1" ${ checked }>`;
                } else {
                    str += `<div class="cc-input cc-input--type-radio | ${ c.dropdown.li }-content">
                        <input class="cc-input__radio | ${ c.dropdown.radio }" type="radio" value="${ categories[i].value }" name="cp-${ this._prefix }[]" id="cp-${ this._prefix }-${ categories[i].value }" tabindex="-1" ${ checked }>`;
                }

                str += `<label for="cp-${ this._prefix }-${ categories[i].value }" class="cc-input__label | ${ c.dropdown.label }">${ categories[i].label }</label>`;

                if (categories[i].optgroup && categories[i].optgroup.length && this._options.showChildren) {
                    str += `<div class="${ c.dropdown.toggler }"></div></div>
                        ${ this._getContents( categories[i].optgroup, '' ) }`;
                } else {
                    str += '</div>';
                }

                str += '</li>';
            }
        }

        str += '</ul>';

        return str;
    }

    /**
     * Adjusts markup after it is build
     */
    protected _afterBuild(openSubTree: boolean = true): void {
        const c: any = this._options.classes;
        const _this: any = this;

        this._$wrapper.find(`.${ c.menu.content } > .${ c.dropdown.ul }`).removeClass(`${ c.dropdown.ul }--hidden`);

        if (openSubTree) {
            this.openSubcategoriesTree(this._$wrapper.find(`.${ c.menu.content } > ul > li:first-child`));
        }

        this._$wrapper.find(`.${ c.dropdown.li }`).each(function(): void {
            if ($(this).find(`.${ c.dropdown.ul }`).length) {
                $(this).addClass(`${ c.dropdown.li }--has-children`);
            } else if (_this._options.disableLastLevelItems) {
                $(this).addClass(`${ c.dropdown.li }--disabled`).find('input').prop('disabled', true);
            }
        });
    }

    /**
     * Support for exising value. If there is already some input (category IDs) in $output field
     * then it constrols initialization to setup those categories in picker's output HTML
     */
    protected _rebuildValues(): void {
        if (this._$output[0].value !== '') {
            const values = this._$output[ 0 ].value.split(',');

            for (let i: number = 0; i < values.length; i++) {
                const $cb = this._$wrapper.find(`.${ this._options.classes.menu.content } input[value="${ values[i] }"]`);
                
                if ($cb.length) {
                    $cb.prop('checked', true);
                    this._orderedCheckboxes.push($cb[0]);
                }
            }

            this.updatePicker(this._orderedCheckboxes);
        }
    }

    /**
     * Sets most of events of picker
     */
    protected _setEvents(): void {
        const c: any = this._options.classes;
        const _this: any = this;
        const fKeys: any = [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]; // F1-F12
        const listen: any = /^[a-zA-Z0-9._\b\-\s]+$/i;

        this._$wrapper.find(`.${ c.input.base }-opener`).off('click').on('click', function(): void {
            if (_this._isOpen) {
                _this.closePicker($(this).parents(`.${ c.base }`));
            } else {
                _this.openPicker($(this).parents(`.${ c.base }`));
            }
        });

        this._$wrapper.find(`.${ c.actions.button }`).off('click').on('click', function(): void {
            _this.closePicker($(this).parents(`.${ c.base }`));
        });

        this._$wrapper.find(`.${ c.dropdown.toggler }`).off('click').on('click', function(): void {
            _this.openSubcategoriesTree($(this).parents(`.${ c.dropdown.li }`).first());
        });

        this._$wrapper.find(`.${ c.menu.content } input[type="checkbox"]`).off('change').on('change', function(): void {
            const idx = _this._orderedCheckboxes.indexOf(this);

            if (idx !== -1) {
                _this._orderedCheckboxes.splice(idx, 1);
            }

            if (this.checked) {
                _this._orderedCheckboxes.push(this);
            }

            for (let i: number; i < _this._orderedCheckboxes.length; i++) {
                const val: any = _this._orderedCheckboxes[i].value;

                if (_this._$wrapper.find(`.${ c.search.resultsUL } input[value="${ val }"]`).length) {
                    _this._$wrapper.find(`.${ c.menu.content } input[value="${ val }"]`).prop('checked', true);
                }
            }

            _this.updatePicker(_this._orderedCheckboxes);
        });

        this._$wrapper.find(`.${ c.menu.base } input[type="radio"]`).off('change').on('change', function(): void {
            if (_this._$wrapper.find(`.${ c.search.resultsUL } input[value="${ this.value }"]`).length) {
                _this._$wrapper.find(`.${ c.menu.content } input[value="${ this.value }"]`).prop('checked', true);
            }
            _this.updatePicker(this);
        });

        this._$wrapper.find(`.${ c.search.input }`).off('keyup').on({
            keyup: function(e: Event): void {
                if (this.value.length >= _this._options.minSearchQueryLength) {
                    const key: any = String.fromCharCode(e.keyCode).toLowerCase();

                    if (key.match(listen) && fKeys.indexOf(e.which) === -1 && !e.ctrlKey && !e.metaKey && !e.altKey ) {
                        _this._renderSearchResults(_this._getByQuery(_this._categoriesData, this.value));
                    }

                    _this._$wrapper.find(`.${ c.search.resultsWrapper }`).show();
                    _this._$wrapper.find(`.${ c.search.resultsQty }`).show();
                    _this._$wrapper.find(`.${ c.menu.content }`).hide();
                } else {
                    _this._$wrapper.find(`.${ c.search.resultsWrapper }`).hide();
                    _this._$wrapper.find(`.${ c.search.resultsQty }`).hide();
                    _this._$wrapper.find(`.${ c.menu.content }`).show();
                }
            },
        });
    }

    /**
     * Controls crumbs in picker's select field
     */
    protected _setCrumbsEvents(): void {
        const _this: any = this;

        this._$wrapper.find(`.${ _this._options.classes.base }__crumb-remove`).off('click').on('click', function(e: Event): void {
            const $target: any = _this._$wrapper.find(`.${ _this._options.classes.menu.content } input[value="${ $(this).data('value') }"]`);
            const $srTarget: any = _this._$wrapper.find(`.${ _this._options.classes.search.resultsWrapper } input[value="${ $(this).data('value') }"]`);

            if (_this._options.multiple) {
                $target.click();
            } else {
                if ($target.prop('checked')) {
                    $target.prop('checked', false);
                    _this.updatePicker();
                }
            }

            if ($srTarget.length) {
                $srTarget.prop('checked', !$srTarget.prop('checked'));
            }

            e.preventDefault();
        });
    }
}
