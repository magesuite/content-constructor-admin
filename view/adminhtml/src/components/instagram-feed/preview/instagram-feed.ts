import imageTeaserPreview from '../../image-teaser/preview/image-teaser';

/**
 * Instagram feed preview component.
 * This component is responsible for displaying preview of instagram feed component in Layout Builder (admin panel)
 * @type {vuejs.ComponentOption} Vue component object.
 */
const instagramFeedPreview: vuejs.ComponentOption = {
    template: `<ul class="cc-instagram-feed-preview">
        <template v-for="item in 4">
            <li class="cc-instagram-feed-preview__tile">
                <div class="cc-instagram-feed-preview__tile-inner">
                    <svg class="cc-instagram-feed-preview__icon">
                        <use xlink:href="#icon_instagram"></use>
                    </svg>
                </div>
            </li>
        </template>
    </ul`,
};

export default instagramFeedPreview;
