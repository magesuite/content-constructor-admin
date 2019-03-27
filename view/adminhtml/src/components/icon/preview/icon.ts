import imageTeaserPreview from '../../image-teaser/preview/image-teaser';

/**
 * Icon preview component.
 * This component is responsible for displaying preview of icon component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const iconPreview: vuejs.ComponentOption = {
    mixins: [imageTeaserPreview],
};

export default iconPreview;
