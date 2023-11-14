<?php

namespace MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\ImageTeaser\Banner;

class Form extends \Magento\Mtf\Block\Block
{
    private $headlineInputSelector = '#cfg-it-teaser%s-headline';
    private $paragraphInputSelector = '#cfg-it-teaser%s-paragraph';
    private $ctaLabelInputSelector = '#cfg-it-teaser%s-cta-label';

    private $uploadFileLinkSelector = '.m2c-image-teaser-configurator__toolbar a';

    private $deleteBannerSelector = '.m2c-image-teaser-configurator__delete-button';

    private $pickCallToActionLinkSelector = '.m2c-image-teaser-configurator__cta-actions a';

    private $imageHolderSelector = '.m2c-image-teaser-configurator__image-holder-inner';

    public function fill($banner, &$bannerNumber)
    {
        $selectorNumber = $bannerNumber+1;

        $this->selectImage($banner['image']);

        $this->_rootElement->find(sprintf($this->headlineInputSelector, $selectorNumber))->setValue($banner['headline']);
        $this->_rootElement->find(sprintf($this->paragraphInputSelector, $selectorNumber))->setValue($banner['paragraph']);
        $this->_rootElement->find(sprintf($this->ctaLabelInputSelector, $selectorNumber))->setValue($banner['cta_label']);

        $this->selectCallToActionLink($banner);

        if ($banner['remove_after']) {
            $this->_rootElement->find($this->imageHolderSelector)->hover();
            $this->_rootElement->find($this->deleteBannerSelector)->click();
            $this->browser->acceptAlert();
            $bannerNumber -= 1;
        }
    }

    private function selectImage($fileName)
    {
        $this->_rootElement->find($this->uploadFileLinkSelector)->click();

        /** @var \MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Media\Uploader $uploader */
        $uploader = $this->blockFactory->create(
            \MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Media\Uploader::class,
            ['element' => $this->browser->find('aside')]
        );

        $uploader->pickFile($fileName);
    }

    /**
     * @param $banner
     */
    private function selectCallToActionLink($banner)
    {
        $ctaTargetLink = $banner['cta_target_link'];

        $this->_rootElement->find($this->pickCallToActionLinkSelector)->click();

        /** @var \MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Widget\LinkPicker $linkPicker */
        $linkPicker = $this->blockFactory->create(
            \MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Widget\LinkPicker::class,
            ['element' => $this->browser->find('aside')]
        );

        $linkPicker->pick($ctaTargetLink);
    }
}
