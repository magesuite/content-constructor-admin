import {IComponentInformation} from "../../../components/_layout-builder/layout-builder";

export interface ClipboardAdapter {
    addComponent(component: IComponentInformation): Promise<ClipboardAdapter> | ClipboardAdapter;
    setComponents(components: IComponentInformation[]): Promise<ClipboardAdapter> | ClipboardAdapter;
    getComponents(): Promise<IComponentInformation[]> | IComponentInformation[];
    clear(): Promise<ClipboardAdapter> | ClipboardAdapter;
}

export {IComponentInformation}
