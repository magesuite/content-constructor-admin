<?php

namespace MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\Headline;

class Form extends \MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\AbstractComponentForm
{
    private $headlineInputSelector = '#cfg-headline';
    private $subHeadlineInputSelector = '#cfg-subheadline';

    /**
     * @param $component \MageSuite\ContentConstructorAdmin\Test\Fixture\Headline
     */
    public function configure(\MageSuite\ContentConstructorAdmin\Test\Fixture\Headline $headline)
    {
        $this->browser->selectWindow($this->browser->getWindowHandles()[0]);

        $this->_rootElement->waitUntil(function() {
            return $this->_rootElement->find($this->headlineInputSelector)->isVisible();
        });

        $this->_rootElement
            ->find($this->headlineInputSelector)
            ->setValue($headline->getTitle());

        $subtitle = $headline->getSubtitle() == null ? '' : $headline->getSubtitle();

        $this->_rootElement
            ->find($this->subHeadlineInputSelector)
            ->setValue($subtitle);

        $this->clickSave();
    }
}