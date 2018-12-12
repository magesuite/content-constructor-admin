const templates: any = {
    getComponentTemplate(classes: any, placeholders: any, disabledClass: string): string {
        return `<div class="cc-input__fake-select | ${ classes.input.base } ${ disabledClass }">${ placeholders.select }</div>
        <div class="${ classes.input.base }-opener"></div>
        <div class="${ classes.menu.base }">
            <div class="${ classes.search.wrapper }">
                <input class="cc-input__input | ${ classes.search.input }" data-role="advanced-select-text" type="text" placeholder="${ placeholders.search }">
                <div class="${ classes.search.resultsQty }"></div>
            </div>
            <div class="${ classes.menu.content }"></div>
            <div class="${ classes.search.resultsWrapper }"></div>
            <div class="${ classes.actions.wrapper }">
                <button class="action-default | ${ classes.actions.button }" type="button">${ placeholders.doneButton }</button>
            </div>
        </div>`;
    },
    getMinimalComponentTemplate(classes: any, placeholders: any, disabledClass: string): string {
        return `<div class="cc-input__fake-select | ${ classes.input.base } ${ disabledClass }">${ placeholders.select }</div>
        <div class="${ classes.input.base }-opener"></div>
        <div class="${ classes.menu.base }">
            <div class="${ classes.menu.content }"></div>
            <div class="${ classes.actions.wrapper }">
                <button class="action-default | ${ classes.actions.button }" type="button">${ placeholders.doneButton }</button>
            </div>
        </div>`;
    },
    getCrumbTemplate(baseClass: string, crumbLabel: string, title: string, inputValue: string): string {
        return `<span class="${ baseClass }__crumb">
            <span class="${ baseClass }__crumb-text">${ crumbLabel }</span>
            <button class="${ baseClass }__crumb-remove" type="button" title="${ title }" tabindex="-1" data-value="${ inputValue }"></button>
        </span>`;
    },
};

export default templates;
