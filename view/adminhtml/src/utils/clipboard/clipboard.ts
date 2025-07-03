import { ClipboardAdapter, IComponentInformation } from "./adapter/types";
import { LocalStorageClipboard} from "./adapter/local-storage-clipboard";
import { SystemClipboard} from "./adapter/system-clipboard";

const clipboard: vuejs.ComponentOption = {
    data(): any {
        return {
            clipboardStoredComponentsIds: []
        };
    },

    computed: {
        clipboardAdapter(): ClipboardAdapter {
            if (navigator.clipboard) {
                return new SystemClipboard(this.syncClipboardStoredComponentsIds.bind(this));
            }

            return new LocalStorageClipboard();
        }
    },

    ready(): void {
        this.syncClipboardStoredComponentsIds();
    },

    methods: {
        async addComponentToClipboard(component: IComponentInformation): Promise<void> {
            await this.clipboardAdapter.addComponent(component);
            this.syncClipboardStoredComponentsIds();
        },

        async getComponentsFromClipboard(): Promise<IComponentInformation[]> {
            return await this.clipboardAdapter.getComponents();
        },

        async setComponentsToClipboard(components: Array<IComponentInformation>): Promise<void> {
            await this.clipboardAdapter.setComponents(components);
            this.syncClipboardStoredComponentsIds();
        },

        isComponentInClipboard(id: string): boolean {
            return this.clipboardStoredComponentsIds.includes(id);
        },

        clearClipboard(): void {
            this.clipboardStoredComponentsIds = [];
            this.clipboardAdapter.clear();
        },

        async syncClipboardStoredComponentsIds(): Promise<void> {
            const components = await this.getComponentsFromClipboard();
            this.clipboardStoredComponentsIds = components.map((component: IComponentInformation) => component.id);
        }
    }
}

export default clipboard;
