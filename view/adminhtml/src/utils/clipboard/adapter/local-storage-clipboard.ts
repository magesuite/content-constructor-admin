import { ClipboardAdapter, IComponentInformation } from "./types";

export class LocalStorageClipboard implements ClipboardAdapter {
    private storageKey = "magesuite-cc-admin-copied-components";
    private maxStorageSize = 2 * 1024 * 1024; // 2MB

    addComponent(component: IComponentInformation): ClipboardAdapter {
        const components = this.getComponents();
        components.push(component);

        if (!this.validateDataSize(components)) {
            components.shift();
        }

        return this.setComponents(components);
    }

    setComponents(components: IComponentInformation[]): ClipboardAdapter {
        localStorage.setItem(this.storageKey, JSON.stringify(components));

        return this;
    }

    getComponents(): IComponentInformation[] {
        const components= localStorage.getItem(this.storageKey) || '[]';

        return JSON.parse(components);
    }

    clear(): ClipboardAdapter {
        localStorage.removeItem(this.storageKey);

        return this;
    }

    private validateDataSize(data: IComponentInformation[]): boolean {
        const jsonString = JSON.stringify(data);

        return new TextEncoder().encode(jsonString).length <= this.maxStorageSize;
    }
}
