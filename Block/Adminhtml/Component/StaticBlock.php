<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component;

class StaticBlock extends \Magento\Framework\View\Element\Template
{
    protected $_template = 'components/configurators/static_block.phtml';

    /**
     * @var \MageSuite\ContentConstructorAdmin\DataProviders\StaticBlockDataProvider
     */
    protected $staticBlockDataProvider;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \MageSuite\ContentConstructorAdmin\DataProviders\StaticBlockDataProvider $staticBlockDataProvider,
        array $data = []
    )
    {
        parent::__construct($context, $data);

        $this->staticBlockDataProvider = $staticBlockDataProvider;
    }

    public function getBlocks() {
        return $this->staticBlockDataProvider->getBlocks();
    }
}
