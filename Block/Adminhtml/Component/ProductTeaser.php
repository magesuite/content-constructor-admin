<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component;

class ProductTeaser extends \Magento\Framework\View\Element\Template
{
    protected $_template = 'components/configurators/product_teaser.phtml';
    /**
     * @var \Magento\Framework\Url
     */
    protected $urlHelper;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Url $urlHelper,
        array $data = []
    ) {
        \Magento\Framework\View\Element\Template::__construct($context, $data);
        $this->urlHelper = $urlHelper;
    }

    public function getProductTeaserDataEndpoint()
    {
        return $this->urlHelper->getUrl('content-constructor/component/productteaserdata');
    }
}
