<?php
/**
 * Translation Center for Magento 2
 *
 * @author    Marek Zabrowarny <marek.zabrowarny@creativestyle.pl>
 * @copyright 2016 creativestyle
 */


namespace MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\HeroCarousel;

use MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\AbstractComponentForm;
use MageSuite\ContentConstructorAdmin\Test\Fixture\HeroCarousel;
use Magento\Mtf\Client\Locator;

class Form extends AbstractComponentForm
{
    /**
     * @var string
     */
    protected $addButtonSelector = "(//*[contains(@class,'m2c-hero-carousel-configurator')]//*[contains(@class,'cc-component-adder__button-wrapper')])[%s]//button";

    /**
     * @var string
     */
    protected $bannerSelector = '#m2c-hero-carousel-item-%s';

    /**
     * @param HeroCarousel $heroCarousel
     */
    public function configure(HeroCarousel $heroCarousel)
    {
        foreach ($heroCarousel->getBanners() as $index => $banner) {
            if ($index) {
                $this->clickAddButton($index + 1);
            }
            $bannerForm = $this->blockFactory->create(
                Banner\Form::class,
                ['element' => $this->browser->find(sprintf($this->bannerSelector, $index))]
            );
            $bannerForm->fill($banner, $index);
        }
        $this->clickSave();
    }

    /**
     * @param int $index
     */
    public function clickAddButton($index)
    {
        $this->_rootElement->find(sprintf($this->addButtonSelector, $index), Locator::SELECTOR_XPATH)->click();
    }
}
