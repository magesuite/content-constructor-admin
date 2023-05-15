<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component;

class Paragraph extends \Magento\Framework\View\Element\Template
{
    protected $_template = 'components/configurators/paragraph.phtml';

    /**
     * @var \MageSuite\ContentConstructorAdmin\DataProviders\WysiwygConfigDataProvider
     */
    protected $wysiwygConfigDataProvider;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \MageSuite\ContentConstructorAdmin\DataProviders\WysiwygConfigDataProvider $wysiwygConfigDataProvider,
        array $data = []
    )
    {
        \Magento\Framework\View\Element\Template::__construct($context, $data);

        $this->wysiwygConfigDataProvider = $wysiwygConfigDataProvider;
    }


    public function getWysiwygConfig() {
        return $this->wysiwygConfigDataProvider->getConfig();
    }
}
