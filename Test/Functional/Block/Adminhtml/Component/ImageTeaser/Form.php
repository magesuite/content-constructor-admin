<?php

namespace MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\ImageTeaser;

class Form extends \MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\AbstractComponentForm
{
    private $bannerSelector = '#m2c-image-teaser-item-%s';
    private $widthSelectSelector = '#cfg-it-width';

    /**
     * @param $component \MageSuite\ContentConstructorAdmin\Test\Fixture\ImageTeaser
     */
    public function configure(\MageSuite\ContentConstructorAdmin\Test\Fixture\ImageTeaser $imageTeaser)
    {
        $widthSelect = $this
            ->_rootElement
            ->find($this->widthSelectSelector, \Magento\Mtf\Client\Locator::SELECTOR_CSS, 'select');

        $widthSelect->setValue($imageTeaser->getWidth());

        $bannerNumber = 0;

        foreach($imageTeaser->getBanners() as $banner) {
            /** @var Banner\Form $bannerForm */
            $bannerForm = $this->blockFactory->create(
                Banner\Form::class,
                ['element' => $this->browser->find(sprintf($this->bannerSelector, $bannerNumber))]
            );

            $bannerForm->fill($banner, $bannerNumber);

            $bannerNumber++;
        }

        $this->clickSave();
    }
}