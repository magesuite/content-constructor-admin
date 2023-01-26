import extendedMosaicConfigurator from './components/extended-mosaic/configurator/extended-mosaic';
import extendedMosaicPreview from './components/extended-mosaic/preview/extended-mosaic';

import backgroundConfigurator from './components/background/configurator/background';
import backgroundPreview from './components/background/preview/background';

import {default as imageTeaserConfiguratorBase} from '../components/image-teaser/configurator/image-teaser';

// Show all options for image teaser as text under image scenario actualy has text over image (just in bottom and with different styling)
const imageTeaserConfiguratorAdjusted: vuejs.ComponentOption = {
    extends: imageTeaserConfiguratorBase,
    ready(): void {
        this.togglePossibleOptions = function() {
            Object.keys(this.scenarioOptions).forEach(
                (optionCategory: string) => {
                    Object.keys(this.scenarioOptions[optionCategory]).forEach(
                        (scenarioOptionId: string) => {
                            this.scenarioOptions[optionCategory][
                                scenarioOptionId
                            ].disabled = false;
                        }
                    );
                }
            );
        };

        this.togglePossibleOptions();
    },
};

export const customComponentsConfigurator = {
    'extended-mosaic-configurator': extendedMosaicConfigurator,
    'background-configurator': backgroundConfigurator,
    'image-teaser-configurator': imageTeaserConfiguratorAdjusted
};

export const customComponentsPreview = {
    'extended-mosaic-preview': extendedMosaicPreview,
    'background-preview': backgroundPreview,
};
