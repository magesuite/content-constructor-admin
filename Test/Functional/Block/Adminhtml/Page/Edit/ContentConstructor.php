<?php

namespace MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Page\Edit;

class ContentConstructor extends \Magento\Mtf\Block\Block
{


    private $fixtureNameToComponentTypeMappings = [
        'headline' => 'headline',
        'cmsBlock' => 'static-cms-block',
        'imageTeaser' => 'image-teaser',
        'heroCarousel' => 'hero-carousel'
    ];

    private $addButtonSelector = "(//*[contains(@class,'cc-component-adder__button-wrapper')])[%s]//button";
    private $deleteButtonSelector = '.js-component-placeholder-delete';
    private $modalSelector = '//aside[contains(@class, "modal-slide")][%s]';

    public function removeAllExistingComponents()
    {
        $element = $this->_rootElement->find($this->deleteButtonSelector);

        while ($element->isVisible()) {
            $element->click();
            $this->browser->acceptAlert();

            $element = $this->_rootElement->find($this->deleteButtonSelector);
        }
    }

    public function addComponents($components)
    {
        $number = 1;

        foreach ($components as $component) {
            $this->addComponent($number, $component);
            $this->configureComponent($number, $component);

            $number++;
        }
    }

    /**
     * @param $number
     */
    private function addComponent($number, $component)
    {
        $addButtonSelector = sprintf($this->addButtonSelector, $number);

        $this->_rootElement->find($addButtonSelector, \Magento\Mtf\Client\Locator::SELECTOR_XPATH)->click();

        $this->browser->waitUntil(function () {
            return $this->browser->find('.m2c-component-picker')->isVisible();
        });

        $this->browser->find('.cc-component-picker__list-item--' . $this->fixtureNameToComponentTypeMappings[ $component['type'] ] . ' a')->click();
    }

    /**
     * @param $number
     */
    private function configureComponent($number, $component)
    {
        $this->browser->waitUntil(function () {
            return $this->browser->find('.m2c-content-constructor__modal--configurator')->isVisible();
        });

        $type = $component['type'];

        $block = $this->getBlockByComponentType($type, $number);

        $block->configure($component['data']);
    }

    private function getBlockByComponentType($componentType, $number)
    {
        $className = 'MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\\' . ucfirst($componentType) . '\\Form';

        return $this->blockFactory->create(
            $className,
            ['element' => $this->browser->find(sprintf($this->modalSelector, $number+1), \Magento\Mtf\Client\Locator::SELECTOR_XPATH)]
        );
    }
}