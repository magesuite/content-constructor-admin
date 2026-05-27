<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component;

class MagentoWidget extends \Magento\Framework\View\Element\Template
{
    protected $_template = 'components/configurators/magento_widget.phtml';

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        protected \Magento\Backend\Model\UrlInterface $backendUrl,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    public function getWidgetWindowUrl(): string
    {
        return $this->backendUrl->getUrl('adminhtml/widget/index');
    }
}
