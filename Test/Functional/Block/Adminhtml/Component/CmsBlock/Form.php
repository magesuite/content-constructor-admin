<?php

namespace MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\CmsBlock;

class Form extends \MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Component\AbstractComponentForm
{
    private $staticBlockSelectSelector = '#cfg-static-block';

    /**
     * @param $cmsBlock \Magento\Cms\Test\Fixture\CmsBlock
     */
    public function configure(\Magento\Cms\Test\Fixture\CmsBlock $cmsBlock)
    {
        $this->browser->selectWindow($this->browser->getWindowHandles()[0]);

        $this->_rootElement->waitUntil(function () {
            return $this->_rootElement->find($this->staticBlockSelectSelector)->isVisible();
        });

        $this->_rootElement
            ->find($this->staticBlockSelectSelector, \Magento\Mtf\Client\Locator::SELECTOR_CSS, 'select')
            ->setValue($cmsBlock->getTitle());

        $this->clickSave();
    }
}
