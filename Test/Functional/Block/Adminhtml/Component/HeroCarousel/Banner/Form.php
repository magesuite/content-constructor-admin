<?php
/**
 * Translation Center for Magento 2
 *
 * @author    Marek Zabrowarny <marek.zabrowarny@creativestyle.pl>
 * @copyright 2016 creativestyle
 */


namespace MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\HeroCarousel\Banner;

use MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Media\Uploader;
use MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Widget\LinkPicker;
use Magento\Mtf\Block\Block;
use Magento\Mtf\Client\Locator;

class Form extends Block
{
    /**
     * @var string
     */
    protected $uploadFileLinkSelector = '.m2c-hero-carousel-configurator__toolbar a';

    /**
     * @var string
     */
    protected $variantSelectSelector = '#cfg-hc-item%s-variant';

    /**
     * @var string
     */
    protected $headlineInputSelector = '#cfg-hc-item%s-headline';

    /**
     * @var string
     */
    protected $paragraphInputSelector = '#cfg-hc-item%s-paragraph';

    /**
     * @var string
     */
    protected $ctaLabelInputSelector = '#cfg-hc-item%s-cta-label';

    /**
     * @var string
     */
    protected $pickCallToActionSelector = '#hero-ctatarget-output-%s + .m2c-hero-carousel-configurator__widget-chooser-trigger';

    /**
     * @var string
     */
    protected $deleteBannerSelector = '.m2c-hero-carousel-configurator__delete-button';

    /**
     * @var string
     */
    protected $moveUpBannerSelector = '.m2c-hero-carousel-configurator__item-action-button.cc-component-actions__button--up';

    /**
     * @var string
     */
    protected $moveDownBannerSelector = '.m2c-hero-carousel-configurator__item-action-button.cc-component-actions__button--down';

    /**
     * @param array $banner
     * @param int $index
     */
    public function fill($banner, $index)
    {
        $this->selectImage($banner['image']);
        $this->_rootElement->find(
            sprintf($this->variantSelectSelector, $index),
            Locator::SELECTOR_CSS,
            'select'
        )->setValue($banner['variant']);
        $this->_rootElement->find(sprintf($this->headlineInputSelector, $index))->setValue($banner['headline']);
        $this->_rootElement->find(sprintf($this->paragraphInputSelector, $index))->setValue($banner['paragraph']);
        $this->_rootElement->find(sprintf($this->ctaLabelInputSelector, $index))->setValue($banner['cta_label']);
        $this->selectCallToActionLink($banner, $index);

        if ($banner['remove_after']) {
            $this->_rootElement->find($this->deleteBannerSelector)->click();
            $this->browser->acceptAlert();
        }

        if ($banner['move_up']) {
            $this->_rootElement->find($this->moveUpBannerSelector)->click();
        }

        if ($banner['move_down']) {
            $this->_rootElement->find($this->moveDownBannerSelector)->click();
        }
    }

    /**
     * @param string $fileName
     */
    protected function selectImage($fileName)
    {
        $this->_rootElement->find($this->uploadFileLinkSelector)->click();
        $uploader = $this->blockFactory->create(
            Uploader::class,
            ['element' => $this->browser->find('aside')]
        );
        $uploader->pickFile($fileName);
    }

    /**
     * @param array $banner
     * @param int $index
     */
    protected function selectCallToActionLink($banner, $index)
    {
        $ctaTargetLink = $banner['cta_target_link'];
        $this->_rootElement->find(sprintf($this->pickCallToActionSelector, $index))->click();
        $linkPicker = $this->blockFactory->create(
            LinkPicker::class,
            ['element' => $this->browser->find('aside')]
        );
        $linkPicker->pick($ctaTargetLink);
    }

}
