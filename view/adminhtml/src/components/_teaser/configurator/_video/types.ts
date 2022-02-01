const MATCH_URL_YOUTUBE = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
const MATCH_URL_VIMEO = /vimeo\.com\/.+/;
const MATCH_URL_FACEBOOK = /^https?:\/\/(www\.)?facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/;
const MATCH_URL_FACEBOOK_WATCH = /^https?:\/\/fb\.watch\/.+$/;
const MATCH_URL_FILE = /(^\{\{media url=")|($\}\})/;

type VideoType = 'youtube' | 'vimeo' | 'facebook' | 'file';

const getVideoTypeFromUrl = (url: string) => {
    switch (true) {
        case MATCH_URL_YOUTUBE.test(url):
            return 'youtube';
            break;
        case MATCH_URL_FACEBOOK.test(url) || MATCH_URL_FACEBOOK_WATCH.test(url):
            return 'facebook';
            break;
        case MATCH_URL_VIMEO.test(url):
            return 'vimeo';
            break;
        case MATCH_URL_FILE.test(url):
            return 'file';
        default:
            return null;
    }
};

export {
    VideoType,
    getVideoTypeFromUrl
};
