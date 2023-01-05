import imageTeaserConfigurator from '../../image-teaser/configurator/image-teaser';

/**
 * Image teaser configurator component.
 * This component is responsible for displaying image teaser's configuration form
 * @type {vuejs.ComponentOption} Vue component object.
 */
const iconConfigurator: vuejs.ComponentOption = {
    extends: imageTeaserConfigurator,
    props: {
        /* Caller component type */
        callerComponentType: {
            type: String,
            default: 'icon'
        },
        mix: {
            type: String,
            default: 'cc-image-teaser-configurator--icon'
        }
    },
    ready(): void {
        this.scenarioOptions = {
            // Teaser width scenario elements.
            teaserWidth: {
                container: {
                    name: 'Content width',
                    iconId: 'tw_content-width',
                    disabled: false,
                },
                'container-slider': {
                    name: 'Content width Slider',
                    iconId: 'tw_content-slider',
                    disabled: false,
                },
            },
            // Desktop layout scenario elements.
            desktopLayout: {
                '5': {
                    name: '5 in row',
                    iconId: 'dl_5',
                    disabled: false,
                    teasersNum: 5,
                },
                '6': {
                    name: '6 in row',
                    iconId: 'dl_6',
                    disabled: false,
                    teasersNum: 6,
                },
                '7': {
                    name: '7 in row',
                    iconId: 'dl_7',
                    disabled: false,
                    teasersNum: 7,
                },
                '8': {
                    name: '8 in row',
                    iconId: 'dl_8',
                    disabled: false,
                    teasersNum: 8,
                },
            },
            // Text positioning scenario elements.
            contentPlacement: {
                under: {
                    name: 'Text below image',
                    iconId: 'tl_under',
                    disabled: false,
                    contentPlacement: false,
                },
            },

            // Mobile layout scenario elements.
            mobileLayout: {
                'mobile-slider': {
                    name: 'Slider',
                    iconId: 'ml_slider',
                    disabled: false,
                },
            },
        };
        this.availableScenarios = [
            ['container', '4', 'under', ['mobile-slider']],
            ['container-slider', '4', 'under', ['mobile-slider']],
            ['container', '5', 'under', ['mobile-slider']],
            ['container-slider', '5', 'under', ['mobile-slider']],
            ['container', '6', 'under', ['mobile-slider']],
            ['container-slider', '6', 'under', ['mobile-slider']],
            ['container', '7', 'under', ['mobile-slider']],
            ['container-slider', '7', 'under', ['mobile-slider']],
            ['container', '8', 'under', ['mobile-slider']],
            ['container-slider', '8', 'under', ['mobile-slider']],
        ];

        if (
            this.configuration.teaserWidth &&
            !this.configuration.teaserWidth.name
        ) {
            this.toggleOption('teaserWidth', 'container');
        }
        if (
            this.configuration.contentPlacement &&
            !this.configuration.contentPlacement
        ) {
            this.toggleOption('contentPlacement', 'under');
        }
        if (
            this.configuration.mobileLayout &&
            !this.configuration.mobileLayout
        ) {
            this.toggleOption('mobileLayout', 'mobile-slider');
        }
    },
};

export default iconConfigurator;
