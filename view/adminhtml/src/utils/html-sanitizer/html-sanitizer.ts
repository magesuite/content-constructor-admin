const ALLOWED_TAGS: string[] = ['A', 'B', 'BR', 'EM', 'I', 'LI', 'OL', 'P', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP', 'U', 'UL'];
const REMOVED_WITH_CONTENT_TAGS: string[] = ['EMBED', 'IFRAME', 'MATH', 'NOSCRIPT', 'OBJECT', 'SCRIPT', 'STYLE', 'SVG', 'TEMPLATE'];
const ALLOWED_ATTRIBUTES: string[] = ['class', 'href', 'target', 'title'];
const SAFE_URL_PATTERN: RegExp = /^(https?:|mailto:|tel:|\/|#)/i;

/**
 * Keeps only basic inline formatting of editor-provided HTML so it can be rendered in admin previews
 * without executing scripts, event handlers or unsafe URLs.
 */
const sanitizeChildren = (parent: Node): void => {
    Array.prototype.slice.call(parent.childNodes).forEach((node: Node): void => {
        if (node.nodeType === Node.TEXT_NODE) {
            return;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            parent.removeChild(node);
            return;
        }

        sanitizeElement(parent, node as Element);
    });
};

const sanitizeElement = (parent: Node, element: Element): void => {
    const tagName: string = element.tagName.toUpperCase();

    if (REMOVED_WITH_CONTENT_TAGS.indexOf(tagName) !== -1) {
        parent.removeChild(element);
        return;
    }

    sanitizeChildren(element);

    if (ALLOWED_TAGS.indexOf(tagName) === -1) {
        while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
        }

        parent.removeChild(element);
        return;
    }

    sanitizeAttributes(element);
};

const sanitizeAttributes = (element: Element): void => {
    Array.prototype.slice.call(element.attributes).forEach((attribute: Attr): void => {
        const name: string = attribute.name.toLowerCase();
        const isAllowed: boolean = ALLOWED_ATTRIBUTES.indexOf(name) !== -1
            && (name !== 'href' || SAFE_URL_PATTERN.test(attribute.value.trim()));

        if (!isAllowed) {
            element.removeAttribute(attribute.name);
        }
    });
};

const sanitizeHtml = (html: any): string => {
    const template: HTMLTemplateElement = document.createElement('template');
    template.innerHTML = html === null || html === undefined ? '' : String(html);
    sanitizeChildren(template.content);

    return template.innerHTML;
};

export default sanitizeHtml;
