<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component;

class ProductTeaser extends \Magento\Framework\View\Element\Template
{
    protected $_template = 'components/configurators/product_teaser.phtml';

    public function getProductTeaserDataEndpoint()
    {
        return $this->getUrl('content-constructor/component/productteaserdata');
    }
}
