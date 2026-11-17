import $t from 'mage/translate';

/**
 * Devices on which component is rendered as the first visual element of the page.
 * Null means that component position cannot be determined, so no notice should be displayed.
 */
interface IAboveTheFoldDevices {
    mobile: boolean;
    desktop: boolean;
}

/**
 * Lists defined in etc/view.xml (MageSuite_ContentConstructor > above_the_fold) come as objects with numeric keys.
 */
const getAboveTheFoldConfigValues = (ccConfig: any, configKey: string): string[] => {
    const configValues: any = ccConfig && ccConfig.above_the_fold && ccConfig.above_the_fold[configKey];

    return configValues ? Object.keys(configValues).map((key: string): string => configValues[key]) : [];
};

/**
 * Number of teasers rendered in the first row of the component on each device.
 */
interface IVisibleTeasersCount {
    mobile: number;
    desktop: number;
}

const imageTeaserComponentTypes: string[] = [
    'image-teaser',
    'image-teaser-2',
];

const mobileInRowTeasersCount: number = 2;

const mosaicDesktopTeasersCount: number = 2;

const teaserAndTextItemsCount: number = 2;

interface IAboveTheFoldNoticeTypes {
    lazyLoaded: string;
    eagerNotNeeded: string;
}

const aboveTheFoldNoticeTypes: IAboveTheFoldNoticeTypes = {
    lazyLoaded: 'lazy-loaded',
    eagerNotNeeded: 'eager-not-needed',
};

const disabledVisibilityFlag: string = '0';

const isVisibilityFlagEnabled = (visibilityFlag: any): boolean =>
    !!visibilityFlag && visibilityFlag !== disabledVisibilityFlag;

const isComponentVisibleOnDevice = (componentData: any, device: string): boolean => {
    const componentVisibility: any = componentData && componentData.componentVisibility;

    if (!componentVisibility) {
        return true;
    }

    return isVisibilityFlagEnabled(componentVisibility[device]);
};

const isEmptyTeaserComponent = (componentType: string, componentData: any, aboveTheFoldComponentTypes: string[]): boolean =>
    aboveTheFoldComponentTypes.indexOf(componentType) !== -1 && !!componentData && Array.isArray(componentData.items) && componentData.items.length === 0;

const isAboveTheFold = (aboveTheFoldDevices: IAboveTheFoldDevices): boolean =>
    !!aboveTheFoldDevices && (aboveTheFoldDevices.mobile || aboveTheFoldDevices.desktop);

const hasAboveTheFoldImageSettings = (image: any): boolean =>
    !image.lazyload && !!image.eagerload && !!image.fetch_priority;

const hasEagerImageSettings = (image: any): boolean =>
    !!image.eagerload || !!image.fetch_priority;

const getImageTeaserVisibleTeasersCount = (componentConfiguration: any): IVisibleTeasersCount => {
    const scenario: any = (componentConfiguration && componentConfiguration.scenario) || {};
    const desktopTeasersCount: number = parseInt(scenario.desktopLayout && scenario.desktopLayout.id, 10);
    const isMobileInRow: boolean = !!scenario.mobileLayout && scenario.mobileLayout.id === 'mobile-in-row';

    return {
        mobile: isMobileInRow ? mobileInRowTeasersCount : 1,
        desktop: desktopTeasersCount > 0 ? desktopTeasersCount : 1,
    };
};

const getVisibleTeasersCount = (componentType: string, componentConfiguration: any): IVisibleTeasersCount => {
    if (imageTeaserComponentTypes.indexOf(componentType) !== -1) {
        return getImageTeaserVisibleTeasersCount(componentConfiguration);
    }

    if (componentType === 'mosaic') {
        return { mobile: 1, desktop: mosaicDesktopTeasersCount };
    }

    if (componentType === 'teaser-and-text') {
        return { mobile: teaserAndTextItemsCount, desktop: teaserAndTextItemsCount };
    }

    return { mobile: 1, desktop: 1 };
};

const getTeaserAboveTheFoldDevices = (
    teaserIndex: number,
    aboveTheFoldDevices: IAboveTheFoldDevices,
    visibleTeasersCount: IVisibleTeasersCount
): IAboveTheFoldDevices => ({
    mobile: !!aboveTheFoldDevices && aboveTheFoldDevices.mobile && teaserIndex < visibleTeasersCount.mobile,
    desktop: !!aboveTheFoldDevices && aboveTheFoldDevices.desktop && teaserIndex < visibleTeasersCount.desktop,
});

const getTeaserNoticeType = (
    teaser: any,
    teaserIndex: number,
    aboveTheFoldDevices: IAboveTheFoldDevices,
    visibleTeasersCount: IVisibleTeasersCount
): string => {
    if (!aboveTheFoldDevices || !teaser || !teaser.image || !teaser.image.raw) {
        return '';
    }

    if (isAboveTheFold(aboveTheFoldDevices)) {
        return isAboveTheFold(getTeaserAboveTheFoldDevices(teaserIndex, aboveTheFoldDevices, visibleTeasersCount)) && !hasAboveTheFoldImageSettings(teaser.image)
            ? aboveTheFoldNoticeTypes.lazyLoaded
            : '';
    }

    return hasEagerImageSettings(teaser.image) ? aboveTheFoldNoticeTypes.eagerNotNeeded : '';
};

const getComponentNoticeType = (
    teasers: any[],
    aboveTheFoldDevices: IAboveTheFoldDevices,
    visibleTeasersCount: IVisibleTeasersCount
): string => {
    const noticeTypes: string[] = (teasers || []).map(
        (teaser: any, teaserIndex: number): string => getTeaserNoticeType(teaser, teaserIndex, aboveTheFoldDevices, visibleTeasersCount)
    );

    if (noticeTypes.indexOf(aboveTheFoldNoticeTypes.lazyLoaded) !== -1) {
        return aboveTheFoldNoticeTypes.lazyLoaded;
    }

    if (noticeTypes.indexOf(aboveTheFoldNoticeTypes.eagerNotNeeded) !== -1) {
        return aboveTheFoldNoticeTypes.eagerNotNeeded;
    }

    return '';
};

/**
 * Devices on which at least one of the component's top images is lazy-loaded.
 */
const getLazyLoadedDevices = (
    teasers: any[],
    aboveTheFoldDevices: IAboveTheFoldDevices,
    visibleTeasersCount: IVisibleTeasersCount
): IAboveTheFoldDevices =>
    (teasers || []).reduce(
        (lazyLoadedDevices: IAboveTheFoldDevices, teaser: any, teaserIndex: number): IAboveTheFoldDevices => {
            if (getTeaserNoticeType(teaser, teaserIndex, aboveTheFoldDevices, visibleTeasersCount) !== aboveTheFoldNoticeTypes.lazyLoaded) {
                return lazyLoadedDevices;
            }

            const teaserDevices: IAboveTheFoldDevices = getTeaserAboveTheFoldDevices(teaserIndex, aboveTheFoldDevices, visibleTeasersCount);

            return {
                mobile: lazyLoadedDevices.mobile || teaserDevices.mobile,
                desktop: lazyLoadedDevices.desktop || teaserDevices.desktop,
            };
        },
        { mobile: false, desktop: false }
    );

const getAboveTheFoldDevicesText = (aboveTheFoldDevices: IAboveTheFoldDevices): string => {
    if (aboveTheFoldDevices.mobile && aboveTheFoldDevices.desktop) {
        return $t('mobile, tablet and desktop');
    }

    if (aboveTheFoldDevices.mobile) {
        return $t('mobile');
    }

    return $t('tablet and desktop');
};

export {
    IAboveTheFoldDevices,
    IVisibleTeasersCount,
    aboveTheFoldNoticeTypes,
    getAboveTheFoldConfigValues,
    getVisibleTeasersCount,
    isComponentVisibleOnDevice,
    isEmptyTeaserComponent,
    getTeaserAboveTheFoldDevices,
    getTeaserNoticeType,
    getComponentNoticeType,
    getLazyLoadedDevices,
    getAboveTheFoldDevicesText,
};
