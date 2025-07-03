import { ClipboardAdapter, IComponentInformation } from "./types";

export class SystemClipboard implements ClipboardAdapter {
    private storageKey = "magesuite-cc-admin-copied-components";

    constructor(private readonly onClipboardChange: () => void) {
        document.addEventListener("visibilitychange", this.onClipboardChange);
        document.addEventListener("copy", this.onClipboardChange);
    }

    async addComponent(component: IComponentInformation): Promise<ClipboardAdapter> {
        const components = await this.getComponents();
        components.push(component);

        return this.setComponents(components);
    }

    async setComponents(components: Array<IComponentInformation>): Promise<ClipboardAdapter> {
        try {
            await navigator.clipboard.writeText(JSON.stringify({
                [this.storageKey]: components
            }));
        } catch (error) {
            console.error(error);
        }

        return this;
    }

    async getComponents(): Promise<IComponentInformation[]> {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const data = JSON.parse(clipboardText);

            return data[this.storageKey] ?? [];
        } catch (error) {
            return [];
        }
    }

    async clear(): Promise<ClipboardAdapter> {
        await navigator.clipboard.writeText(null);

        return this;
    }
}
